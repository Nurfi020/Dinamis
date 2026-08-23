import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { License, LicenseDevice, ActivationTokenRecord } from './types';

// Server-side secret for hashing and signing (never sent to client)
const SERVER_SECRET = process.env.LICENSE_SERVER_SECRET || 'kelola-lead-lifetime-secret-salt-2026';
const DB_FILE_PATH = path.join(process.cwd(), '.license_db.json');

export function hashLicenseKey(key: string): string {
  const normalized = normalizeKey(key);
  return crypto.createHmac('sha256', SERVER_SECRET).update(normalized).digest('hex');
}

export function normalizeKey(key: string): string {
  return key.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export function generateRandomSegment(length: number = 4): string {
  // Exclude ambiguous characters (0, O, 1, I) for clear readability
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export function generateLifetimeKey(): string {
  const seg1 = generateRandomSegment(4);
  const seg2 = generateRandomSegment(4);
  const seg3 = generateRandomSegment(4);
  return `KLDN-LIFE-${seg1}-${seg2}-${seg3}`;
}

export function generateActivationToken(licenseId: string, deviceId: string): string {
  const payload = `${licenseId}:${deviceId}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
  const signature = crypto.createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}::${signature}`).toString('base64url');
}

interface DatabaseSchema {
  licenses: License[];
  devices: LicenseDevice[];
  tokens: ActivationTokenRecord[];
}

// Initial Seed Keys
export const INITIAL_TEST_KEY = 'KLDN-LIFE-TEST-TEST-0001';
export const SAMPLE_LIFETIME_KEY_1 = 'KLDN-LIFE-A7X9-K2MP-8Q4T';
export const SAMPLE_LIFETIME_KEY_2 = 'KLDN-LIFE-9R2M-5P8X-3W7V';
export const SAMPLE_LIFETIME_KEY_3 = 'KLDN-LIFE-J4K8-M2N6-Q9X1';

function createInitialSeed(): DatabaseSchema {
  const now = new Date().toISOString();

  const licenses: License[] = [
    {
      id: 'lic-dev-test-0001',
      licenseKeyHash: hashLicenseKey(INITIAL_TEST_KEY),
      licenseKeyLast4: '0001',
      productCode: 'KEL0LA-LEAD',
      plan: 'lifetime',
      status: 'pending',
      maxDevices: 1,
      createdAt: now,
      activatedAt: null,
      lastVerifiedAt: null,
      revokedAt: null,
      expiresAt: null,
      isTest: true,
      notes: 'Development / Testing License Key',
    },
    {
      id: 'lic-life-0001',
      licenseKeyHash: hashLicenseKey(SAMPLE_LIFETIME_KEY_1),
      licenseKeyLast4: '8Q4T',
      productCode: 'KEL0LA-LEAD',
      plan: 'lifetime',
      status: 'pending',
      maxDevices: 1,
      createdAt: now,
      activatedAt: null,
      lastVerifiedAt: null,
      revokedAt: null,
      expiresAt: null,
      isTest: false,
      notes: 'Lifetime License #1 (Sample Batch)',
    },
    {
      id: 'lic-life-0002',
      licenseKeyHash: hashLicenseKey(SAMPLE_LIFETIME_KEY_2),
      licenseKeyLast4: '3W7V',
      productCode: 'KEL0LA-LEAD',
      plan: 'lifetime',
      status: 'pending',
      maxDevices: 1,
      createdAt: now,
      activatedAt: null,
      lastVerifiedAt: null,
      revokedAt: null,
      expiresAt: null,
      isTest: false,
      notes: 'Lifetime License #2 (Sample Batch)',
    },
    {
      id: 'lic-life-0003',
      licenseKeyHash: hashLicenseKey(SAMPLE_LIFETIME_KEY_3),
      licenseKeyLast4: 'Q9X1',
      productCode: 'KEL0LA-LEAD',
      plan: 'lifetime',
      status: 'pending',
      maxDevices: 1,
      createdAt: now,
      activatedAt: null,
      lastVerifiedAt: null,
      revokedAt: null,
      expiresAt: null,
      isTest: false,
      notes: 'Lifetime License #3 (Sample Batch)',
    },
  ];

  return {
    licenses,
    devices: [],
    tokens: [],
  };
}

class LicenseDatabase {
  private fallbackData: DatabaseSchema;
  private isPrismaInitialized = false;

  constructor() {
    this.fallbackData = this.loadFromDisk();
    this.ensurePrismaSeeds();
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.licenses && Array.isArray(parsed.licenses)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read license db from disk, creating seed:', e);
    }
    const seed = createInitialSeed();
    this.saveToDisk(seed);
    return seed;
  }

  private saveToDisk(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not save license db to disk:', e);
    }
  }

  private async ensurePrismaSeeds() {
    if (this.isPrismaInitialized) return;
    try {
      if (prisma && prisma.license) {
        const count = await prisma.license.count();
        if (count === 0) {
          const seeds = createInitialSeed().licenses;
          for (const s of seeds) {
            await prisma.license.create({
              data: {
                id: s.id,
                licenseKeyHash: s.licenseKeyHash,
                licenseKeyLast4: s.licenseKeyLast4,
                productCode: s.productCode,
                plan: s.plan,
                status: s.status,
                maxDevices: s.maxDevices,
                isTest: s.isTest || false,
                notes: s.notes,
              },
            });
          }
        }
        this.isPrismaInitialized = true;
      }
    } catch (err) {
      // Prisma database may not be available or table not migrated yet, use disk store
    }
  }

  public async getLicenses(): Promise<License[]> {
    try {
      if (prisma && prisma.license) {
        const records = await prisma.license.findMany({
          orderBy: { createdAt: 'desc' },
        });
        if (records && records.length > 0) {
          return records.map((r) => ({
            id: r.id,
            licenseKeyHash: r.licenseKeyHash,
            licenseKeyLast4: r.licenseKeyLast4,
            productCode: r.productCode,
            plan: 'lifetime',
            status: r.status as any,
            maxDevices: r.maxDevices,
            createdAt: r.createdAt.toISOString(),
            activatedAt: r.activatedAt ? r.activatedAt.toISOString() : null,
            lastVerifiedAt: r.lastVerifiedAt ? r.lastVerifiedAt.toISOString() : null,
            revokedAt: r.revokedAt ? r.revokedAt.toISOString() : null,
            expiresAt: null,
            isTest: r.isTest,
            notes: r.notes || undefined,
          }));
        }
      }
    } catch (e) {
      // fallback
    }
    return this.fallbackData.licenses;
  }

  public async getDevices(): Promise<LicenseDevice[]> {
    try {
      if (prisma && prisma.licenseDevice) {
        const records = await prisma.licenseDevice.findMany();
        if (records) {
          return records.map((d) => ({
            id: d.id,
            licenseId: d.licenseId,
            deviceId: d.deviceId,
            deviceName: d.deviceName,
            browser: d.browser,
            operatingSystem: d.operatingSystem,
            activatedAt: d.activatedAt.toISOString(),
            lastSeenAt: d.lastSeenAt.toISOString(),
            status: d.status as any,
          }));
        }
      }
    } catch (e) {
      // fallback
    }
    return this.fallbackData.devices;
  }

  public async getTokens(): Promise<ActivationTokenRecord[]> {
    try {
      if (prisma && prisma.activationToken) {
        const records = await prisma.activationToken.findMany();
        if (records) {
          return records.map((t) => ({
            token: t.token,
            licenseId: t.licenseId,
            deviceId: t.deviceId,
            issuedAt: t.issuedAt.toISOString(),
            expiresAt: null,
          }));
        }
      }
    } catch (e) {
      // fallback
    }
    return this.fallbackData.tokens;
  }

  public async findLicenseByHash(hash: string): Promise<License | undefined> {
    try {
      if (prisma && prisma.license) {
        const r = await prisma.license.findUnique({
          where: { licenseKeyHash: hash },
        });
        if (r) {
          return {
            id: r.id,
            licenseKeyHash: r.licenseKeyHash,
            licenseKeyLast4: r.licenseKeyLast4,
            productCode: r.productCode,
            plan: 'lifetime',
            status: r.status as any,
            maxDevices: r.maxDevices,
            createdAt: r.createdAt.toISOString(),
            activatedAt: r.activatedAt ? r.activatedAt.toISOString() : null,
            lastVerifiedAt: r.lastVerifiedAt ? r.lastVerifiedAt.toISOString() : null,
            revokedAt: r.revokedAt ? r.revokedAt.toISOString() : null,
            expiresAt: null,
            isTest: r.isTest,
            notes: r.notes || undefined,
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return this.fallbackData.licenses.find((l) => l.licenseKeyHash === hash);
  }

  public async findLicenseById(id: string): Promise<License | undefined> {
    try {
      if (prisma && prisma.license) {
        const r = await prisma.license.findUnique({
          where: { id },
        });
        if (r) {
          return {
            id: r.id,
            licenseKeyHash: r.licenseKeyHash,
            licenseKeyLast4: r.licenseKeyLast4,
            productCode: r.productCode,
            plan: 'lifetime',
            status: r.status as any,
            maxDevices: r.maxDevices,
            createdAt: r.createdAt.toISOString(),
            activatedAt: r.activatedAt ? r.activatedAt.toISOString() : null,
            lastVerifiedAt: r.lastVerifiedAt ? r.lastVerifiedAt.toISOString() : null,
            revokedAt: r.revokedAt ? r.revokedAt.toISOString() : null,
            expiresAt: null,
            isTest: r.isTest,
            notes: r.notes || undefined,
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return this.fallbackData.licenses.find((l) => l.id === id);
  }

  public async findActiveDeviceByLicenseId(licenseId: string): Promise<LicenseDevice | undefined> {
    try {
      if (prisma && prisma.licenseDevice) {
        const d = await prisma.licenseDevice.findFirst({
          where: { licenseId, status: 'active' },
        });
        if (d) {
          return {
            id: d.id,
            licenseId: d.licenseId,
            deviceId: d.deviceId,
            deviceName: d.deviceName,
            browser: d.browser,
            operatingSystem: d.operatingSystem,
            activatedAt: d.activatedAt.toISOString(),
            lastSeenAt: d.lastSeenAt.toISOString(),
            status: d.status as any,
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return this.fallbackData.devices.find((d) => d.licenseId === licenseId && d.status === 'active');
  }

  public async findDeviceByLicenseAndDeviceId(licenseId: string, deviceId: string): Promise<LicenseDevice | undefined> {
    try {
      if (prisma && prisma.licenseDevice) {
        const d = await prisma.licenseDevice.findUnique({
          where: {
            licenseId_deviceId: { licenseId, deviceId },
          },
        });
        if (d) {
          return {
            id: d.id,
            licenseId: d.licenseId,
            deviceId: d.deviceId,
            deviceName: d.deviceName,
            browser: d.browser,
            operatingSystem: d.operatingSystem,
            activatedAt: d.activatedAt.toISOString(),
            lastSeenAt: d.lastSeenAt.toISOString(),
            status: d.status as any,
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return this.fallbackData.devices.find((d) => d.licenseId === licenseId && d.deviceId === deviceId);
  }

  public async findTokenRecord(token: string): Promise<ActivationTokenRecord | undefined> {
    try {
      if (prisma && prisma.activationToken) {
        const t = await prisma.activationToken.findUnique({
          where: { token },
        });
        if (t) {
          return {
            token: t.token,
            licenseId: t.licenseId,
            deviceId: t.deviceId,
            issuedAt: t.issuedAt.toISOString(),
            expiresAt: null,
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return this.fallbackData.tokens.find((t) => t.token === token);
  }

  public async addLicense(license: License): Promise<void> {
    try {
      if (prisma && prisma.license) {
        await prisma.license.create({
          data: {
            id: license.id,
            licenseKeyHash: license.licenseKeyHash,
            licenseKeyLast4: license.licenseKeyLast4,
            productCode: license.productCode,
            plan: license.plan,
            status: license.status,
            maxDevices: license.maxDevices,
            isTest: license.isTest || false,
            notes: license.notes,
            activatedAt: license.activatedAt ? new Date(license.activatedAt) : null,
            lastVerifiedAt: license.lastVerifiedAt ? new Date(license.lastVerifiedAt) : null,
            revokedAt: license.revokedAt ? new Date(license.revokedAt) : null,
          },
        });
      }
    } catch (e) {
      // fallback
    }
    this.fallbackData.licenses.push(license);
    this.saveToDisk(this.fallbackData);
  }

  public async updateLicense(updated: License): Promise<void> {
    try {
      if (prisma && prisma.license) {
        await prisma.license.update({
          where: { id: updated.id },
          data: {
            status: updated.status,
            activatedAt: updated.activatedAt ? new Date(updated.activatedAt) : null,
            lastVerifiedAt: updated.lastVerifiedAt ? new Date(updated.lastVerifiedAt) : null,
            revokedAt: updated.revokedAt ? new Date(updated.revokedAt) : null,
            notes: updated.notes,
          },
        });
      }
    } catch (e) {
      // fallback
    }
    const idx = this.fallbackData.licenses.findIndex((l) => l.id === updated.id);
    if (idx !== -1) {
      this.fallbackData.licenses[idx] = updated;
      this.saveToDisk(this.fallbackData);
    }
  }

  public async addOrUpdateDevice(device: LicenseDevice): Promise<void> {
    try {
      if (prisma && prisma.licenseDevice) {
        await prisma.licenseDevice.upsert({
          where: {
            licenseId_deviceId: {
              licenseId: device.licenseId,
              deviceId: device.deviceId,
            },
          },
          create: {
            id: device.id,
            licenseId: device.licenseId,
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            browser: device.browser,
            operatingSystem: device.operatingSystem,
            status: device.status,
            activatedAt: new Date(device.activatedAt),
            lastSeenAt: new Date(device.lastSeenAt),
          },
          update: {
            deviceName: device.deviceName,
            browser: device.browser,
            operatingSystem: device.operatingSystem,
            status: device.status,
            lastSeenAt: new Date(device.lastSeenAt),
          },
        });
      }
    } catch (e) {
      // fallback
    }
    const idx = this.fallbackData.devices.findIndex(
      (d) => d.id === device.id || (d.licenseId === device.licenseId && d.deviceId === device.deviceId)
    );
    if (idx !== -1) {
      this.fallbackData.devices[idx] = device;
    } else {
      this.fallbackData.devices.push(device);
    }
    this.saveToDisk(this.fallbackData);
  }

  public async saveToken(record: ActivationTokenRecord): Promise<void> {
    try {
      if (prisma && prisma.activationToken) {
        await prisma.activationToken.deleteMany({
          where: { licenseId: record.licenseId, deviceId: record.deviceId },
        });
        await prisma.activationToken.create({
          data: {
            token: record.token,
            licenseId: record.licenseId,
            deviceId: record.deviceId,
            issuedAt: new Date(record.issuedAt),
          },
        });
      }
    } catch (e) {
      // fallback
    }
    this.fallbackData.tokens = this.fallbackData.tokens.filter(
      (t) => !(t.licenseId === record.licenseId && t.deviceId === record.deviceId)
    );
    this.fallbackData.tokens.push(record);
    this.saveToDisk(this.fallbackData);
  }

  public async removeTokensForLicense(licenseId: string): Promise<void> {
    try {
      if (prisma && prisma.activationToken) {
        await prisma.activationToken.deleteMany({
          where: { licenseId },
        });
      }
    } catch (e) {
      // fallback
    }
    this.fallbackData.tokens = this.fallbackData.tokens.filter((t) => t.licenseId !== licenseId);
    this.saveToDisk(this.fallbackData);
  }

  public async removeTokensForDevice(licenseId: string, deviceId: string): Promise<void> {
    try {
      if (prisma && prisma.activationToken) {
        await prisma.activationToken.deleteMany({
          where: { licenseId, deviceId },
        });
      }
    } catch (e) {
      // fallback
    }
    this.fallbackData.tokens = this.fallbackData.tokens.filter(
      (t) => !(t.licenseId === licenseId && t.deviceId === deviceId)
    );
    this.saveToDisk(this.fallbackData);
  }

  public async resetAllToSeed(): Promise<void> {
    this.fallbackData = createInitialSeed();
    this.saveToDisk(this.fallbackData);
  }
}

export const licenseDb = new LicenseDatabase();
