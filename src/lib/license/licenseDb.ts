import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
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
const INITIAL_TEST_KEY = 'KLDN-LIFE-TEST-TEST-0001';
const SAMPLE_LIFETIME_KEY_1 = 'KLDN-LIFE-A7X9-K2MP-8Q4T';
const SAMPLE_LIFETIME_KEY_2 = 'KLDN-LIFE-9R2M-5P8X-3W7V';
const SAMPLE_LIFETIME_KEY_3 = 'KLDN-LIFE-J4K8-M2N6-Q9X1';

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
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromDisk();
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

  public getLicenses(): License[] {
    return this.data.licenses;
  }

  public getDevices(): LicenseDevice[] {
    return this.data.devices;
  }

  public getTokens(): ActivationTokenRecord[] {
    return this.data.tokens;
  }

  public findLicenseByHash(hash: string): License | undefined {
    return this.data.licenses.find((l) => l.licenseKeyHash === hash);
  }

  public findLicenseById(id: string): License | undefined {
    return this.data.licenses.find((l) => l.id === id);
  }

  public findActiveDeviceByLicenseId(licenseId: string): LicenseDevice | undefined {
    return this.data.devices.find((d) => d.licenseId === licenseId && d.status === 'active');
  }

  public findDeviceByLicenseAndDeviceId(licenseId: string, deviceId: string): LicenseDevice | undefined {
    return this.data.devices.find((d) => d.licenseId === licenseId && d.deviceId === deviceId);
  }

  public findTokenRecord(token: string): ActivationTokenRecord | undefined {
    return this.data.tokens.find((t) => t.token === token);
  }

  public addLicense(license: License): void {
    this.data.licenses.push(license);
    this.saveToDisk(this.data);
  }

  public updateLicense(updated: License): void {
    const idx = this.data.licenses.findIndex((l) => l.id === updated.id);
    if (idx !== -1) {
      this.data.licenses[idx] = updated;
      this.saveToDisk(this.data);
    }
  }

  public addOrUpdateDevice(device: LicenseDevice): void {
    const idx = this.data.devices.findIndex((d) => d.id === device.id || (d.licenseId === device.licenseId && d.deviceId === device.deviceId));
    if (idx !== -1) {
      this.data.devices[idx] = device;
    } else {
      this.data.devices.push(device);
    }
    this.saveToDisk(this.data);
  }

  public saveToken(record: ActivationTokenRecord): void {
    this.data.tokens = this.data.tokens.filter(
      (t) => !(t.licenseId === record.licenseId && t.deviceId === record.deviceId)
    );
    this.data.tokens.push(record);
    this.saveToDisk(this.data);
  }

  public removeTokensForLicense(licenseId: string): void {
    this.data.tokens = this.data.tokens.filter((t) => t.licenseId !== licenseId);
    this.saveToDisk(this.data);
  }

  public removeTokensForDevice(licenseId: string, deviceId: string): void {
    this.data.tokens = this.data.tokens.filter(
      (t) => !(t.licenseId === licenseId && t.deviceId === deviceId)
    );
    this.saveToDisk(this.data);
  }

  public resetAllToSeed(): void {
    this.data = createInitialSeed();
    this.saveToDisk(this.data);
  }
}

export const licenseDb = new LicenseDatabase();
