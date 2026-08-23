import {
  licenseDb,
  hashLicenseKey,
  normalizeKey,
  generateLifetimeKey,
  generateActivationToken,
} from './licenseDb';
import {
  License,
  LicenseDevice,
  ActivateRequest,
  VerifyRequest,
  DeactivateRequest,
} from './types';

export class LicenseService {
  /**
   * Validate key format: KLDN-LIFE-XXXX-XXXX-XXXX
   */
  public static isValidKeyFormat(key: string): boolean {
    if (!key) return false;
    const normalized = normalizeKey(key);
    const regex = /^KLDN-LIFE-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return regex.test(normalized);
  }

  /**
   * Activate a license key on a device (1 Device Policy)
   */
  public static async activate(req: ActivateRequest): Promise<{
    success: boolean;
    status: number;
    error?: string;
    token?: string;
    license?: {
      id: string;
      plan: string;
      status: string;
      productCode: string;
      licenseKeyLast4: string;
      isTest?: boolean;
      activatedAt: string;
      expiresAt: null;
      deviceName: string;
      browser: string;
      operatingSystem: string;
    };
  }> {
    const rawKey = req.licenseKey;
    const deviceId = req.deviceId?.trim();
    const deviceName = req.deviceName?.trim() || 'Unknown Device';
    const browser = req.browser?.trim() || 'Unknown Browser';
    const operatingSystem = req.operatingSystem?.trim() || 'Unknown OS';

    if (!rawKey) {
      return { success: false, status: 400, error: 'License Key wajib diisi.' };
    }

    if (!deviceId) {
      return { success: false, status: 400, error: 'Device Identifier tidak valid.' };
    }

    if (!this.isValidKeyFormat(rawKey)) {
      return {
        success: false,
        status: 400,
        error: 'Format License Key tidak valid. Format harus: KLDN-LIFE-XXXX-XXXX-XXXX',
      };
    }

    const normalized = normalizeKey(rawKey);
    const keyHash = hashLicenseKey(normalized);
    const license = await licenseDb.findLicenseByHash(keyHash);

    if (!license) {
      return {
        success: false,
        status: 404,
        error: 'License Key tidak ditemukan atau tidak terdaftar pada sistem.',
      };
    }

    if (license.productCode !== 'KEL0LA-LEAD') {
      return {
        success: false,
        status: 403,
        error: 'License Key ini bukan untuk produk Kelola Lead Sales.',
      };
    }

    if (license.status === 'revoked') {
      return {
        success: false,
        status: 403,
        error: 'License Key ini telah dicabut (revoked) dan tidak dapat digunakan lagi.',
      };
    }

    if (license.status === 'suspended') {
      return {
        success: false,
        status: 403,
        error: 'License Key ini sedang ditangguhkan (suspended). Silakan hubungi tim support.',
      };
    }

    // Check device binding (1 Device Enforcement)
    const existingActiveDevice = await licenseDb.findActiveDeviceByLicenseId(license.id);
    const now = new Date().toISOString();

    if (existingActiveDevice && existingActiveDevice.deviceId !== deviceId) {
      // License is already bound to another active device!
      return {
        success: false,
        status: 409,
        error: `Lisensi ini sudah terpasang pada perangkat lain (${existingActiveDevice.deviceName || 'Perangkat Lain'}). Satu lisensi Lifetime hanya berlaku untuk 1 perangkat. Silakan lakukan Reset Perangkat terlebih dahulu di perangkat lama atau hubungi admin.`,
      };
    }

    // Bind or update device
    const deviceRecord: LicenseDevice = {
      id: existingActiveDevice?.id || `dev-bind-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      licenseId: license.id,
      deviceId,
      deviceName,
      browser,
      operatingSystem,
      activatedAt: existingActiveDevice?.activatedAt || now,
      lastSeenAt: now,
      status: 'active',
    };
    await licenseDb.addOrUpdateDevice(deviceRecord);

    // Update license record
    const updatedLicense: License = {
      ...license,
      status: 'active',
      activatedAt: license.activatedAt || now,
      lastVerifiedAt: now,
    };
    await licenseDb.updateLicense(updatedLicense);

    // Issue activation token
    const token = generateActivationToken(license.id, deviceId);
    await licenseDb.saveToken({
      token,
      licenseId: license.id,
      deviceId,
      issuedAt: now,
      expiresAt: null,
    });

    return {
      success: true,
      status: 200,
      token,
      license: {
        id: updatedLicense.id,
        plan: updatedLicense.plan,
        status: updatedLicense.status,
        productCode: updatedLicense.productCode,
        licenseKeyLast4: updatedLicense.licenseKeyLast4,
        isTest: updatedLicense.isTest,
        activatedAt: updatedLicense.activatedAt || now,
        expiresAt: null,
        deviceName,
        browser,
        operatingSystem,
      },
    };
  }

  /**
   * Verify activation token and device binding
   */
  public static async verify(req: VerifyRequest): Promise<{
    valid: boolean;
    status: number;
    error?: string;
    license?: {
      id: string;
      plan: string;
      status: string;
      productCode: string;
      licenseKeyLast4: string;
      isTest?: boolean;
      activatedAt: string | null;
      lastVerifiedAt: string;
      expiresAt: null;
      deviceName?: string;
    };
  }> {
    const { activationToken, deviceId } = req;

    if (!activationToken || !deviceId) {
      return {
        valid: false,
        status: 401,
        error: 'Token aktivasi atau device identifier tidak ditemukan.',
      };
    }

    const tokenRecord = await licenseDb.findTokenRecord(activationToken);
    if (!tokenRecord) {
      return {
        valid: false,
        status: 401,
        error: 'Sesi aktivasi tidak valid atau sudah kadaluarsa. Silakan aktivasi ulang.',
      };
    }

    if (tokenRecord.deviceId !== deviceId) {
      return {
        valid: false,
        status: 403,
        error: 'Perangkat tidak cocok dengan sesi aktivasi lisensi.',
      };
    }

    const license = await licenseDb.findLicenseById(tokenRecord.licenseId);
    if (!license) {
      return {
        valid: false,
        status: 404,
        error: 'Lisensi terkait tidak ditemukan.',
      };
    }

    if (license.status !== 'active') {
      return {
        valid: false,
        status: 403,
        error: `Status lisensi saat ini: ${license.status.toUpperCase()}. Akses dibatasi.`,
      };
    }

    const device = await licenseDb.findDeviceByLicenseAndDeviceId(license.id, deviceId);
    if (!device || device.status !== 'active') {
      return {
        valid: false,
        status: 403,
        error: 'Perangkat ini telah dinonaktifkan dari lisensi.',
      };
    }

    const now = new Date().toISOString();
    // Update last seen and verified
    device.lastSeenAt = now;
    await licenseDb.addOrUpdateDevice(device);

    license.lastVerifiedAt = now;
    await licenseDb.updateLicense(license);

    return {
      valid: true,
      status: 200,
      license: {
        id: license.id,
        plan: license.plan,
        status: license.status,
        productCode: license.productCode,
        licenseKeyLast4: license.licenseKeyLast4,
        isTest: license.isTest,
        activatedAt: license.activatedAt,
        lastVerifiedAt: now,
        expiresAt: null,
        deviceName: device.deviceName,
      },
    };
  }

  /**
   * Deactivate license on device (Reset Perangkat)
   */
  public static async deactivate(req: DeactivateRequest): Promise<{
    success: boolean;
    status: number;
    error?: string;
    message?: string;
  }> {
    const { activationToken, deviceId } = req;

    if (!activationToken && !deviceId) {
      return { success: false, status: 400, error: 'Data deactivasi tidak lengkap.' };
    }

    // Find any active device matching deviceId
    const allDevices = await licenseDb.getDevices();
    const devices = allDevices.filter((d) => d.deviceId === deviceId && d.status === 'active');
    
    for (const d of devices) {
      d.status = 'deactivated';
      await licenseDb.addOrUpdateDevice(d);
      await licenseDb.removeTokensForDevice(d.licenseId, d.deviceId);
      
      const lic = await licenseDb.findLicenseById(d.licenseId);
      if (lic) {
        lic.lastVerifiedAt = new Date().toISOString();
        await licenseDb.updateLicense(lic);
      }
    }

    return {
      success: true,
      status: 200,
      message: 'Perangkat berhasil dilepaskan dari lisensi. Anda dapat mengaktifkan lisensi di perangkat baru.',
    };
  }

  /**
   * Admin: List all licenses with device info
   */
  public static async listAll(query?: { search?: string; status?: string }) {
    const allLicenses = await licenseDb.getLicenses();
    let licenses = [...allLicenses];

    if (query?.status && query.status !== 'all') {
      licenses = licenses.filter((l) => l.status === query.status);
    }

    if (query?.search) {
      const term = query.search.toUpperCase().trim();
      licenses = licenses.filter(
        (l) =>
          l.id.toUpperCase().includes(term) ||
          l.licenseKeyLast4.includes(term) ||
          (l.notes && l.notes.toUpperCase().includes(term))
      );
    }

    const devices = await licenseDb.getDevices();

    return licenses.map((lic) => {
      const boundDevice = devices.find((d) => d.licenseId === lic.id && d.status === 'active');
      return {
        ...lic,
        activeDevice: boundDevice
          ? {
              deviceId: boundDevice.deviceId,
              deviceName: boundDevice.deviceName,
              browser: boundDevice.browser,
              operatingSystem: boundDevice.operatingSystem,
              activatedAt: boundDevice.activatedAt,
              lastSeenAt: boundDevice.lastSeenAt,
            }
          : null,
      };
    });
  }

  /**
   * Admin: Create new Lifetime Key
   */
  public static async createNewKey(notes?: string): Promise<{ key: string; license: License }> {
    const key = generateLifetimeKey();
    const keyHash = hashLicenseKey(key);
    const last4 = key.slice(-4);
    const now = new Date().toISOString();

    const license: License = {
      id: `lic-life-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      licenseKeyHash: keyHash,
      licenseKeyLast4: last4,
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
      notes: notes || 'Generated Lifetime License Key',
    };

    await licenseDb.addLicense(license);
    return { key, license };
  }

  /**
   * Admin: Reset Device Binding for a license
   */
  public static async resetDeviceByAdmin(licenseId: string): Promise<boolean> {
    const license = await licenseDb.findLicenseById(licenseId);
    if (!license) return false;

    const allDevices = await licenseDb.getDevices();
    const devices = allDevices.filter((d) => d.licenseId === licenseId);
    for (const d of devices) {
      d.status = 'deactivated';
      await licenseDb.addOrUpdateDevice(d);
    }

    await licenseDb.removeTokensForLicense(licenseId);
    license.status = 'pending';
    await licenseDb.updateLicense(license);
    return true;
  }

  /**
   * Admin: Update License Status (pending, active, suspended, revoked)
   */
  public static async updateStatusByAdmin(licenseId: string, status: License['status']): Promise<boolean> {
    const license = await licenseDb.findLicenseById(licenseId);
    if (!license) return false;

    license.status = status;
    if (status === 'revoked') {
      license.revokedAt = new Date().toISOString();
      await licenseDb.removeTokensForLicense(licenseId);
    } else if (status === 'suspended') {
      await licenseDb.removeTokensForLicense(licenseId);
    }
    await licenseDb.updateLicense(license);
    return true;
  }
}
