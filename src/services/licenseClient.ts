import { LicenseInfo, StoredActivationState } from '../types';
import { getClientDeviceMetadata } from '../utils/device';

const ACTIVATION_STORAGE_KEY = 'kelola_lead_activation_v1';
export const OFFLINE_GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days

export interface VerificationResult {
  valid: boolean;
  isOffline?: boolean;
  graceRemainingDays?: number;
  license?: LicenseInfo;
  error?: string;
  offlineExpired?: boolean;
}

export class LicenseClient {
  /**
   * Get stored activation state from localStorage
   */
  public static getStoredState(): StoredActivationState | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(ACTIVATION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Save activation state
   */
  public static saveStoredState(state: StoredActivationState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACTIVATION_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save activation state to localStorage', e);
    }
  }

  /**
   * Clear activation state (e.g. upon deactivation / reset)
   * Note: NEVER clears leads data!
   */
  public static clearStoredState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(ACTIVATION_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove activation state', e);
    }
  }

  /**
   * Activate a license key
   */
  public static async activate(licenseKey: string): Promise<{
    success: boolean;
    license?: LicenseInfo;
    error?: string;
  }> {
    const meta = getClientDeviceMetadata();

    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: licenseKey.trim(),
          deviceId: meta.deviceId,
          deviceName: meta.deviceName,
          browser: meta.browser,
          operatingSystem: meta.operatingSystem,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Aktivasi gagal. Silakan periksa kembali License Key Anda.',
        };
      }

      const maskKey = `KLDN-LIFE-****-****-${data.license.licenseKeyLast4}`;
      const licenseInfo: LicenseInfo = {
        ...data.license,
        fullKeyMasked: maskKey,
      };

      const activationState: StoredActivationState = {
        token: data.token,
        license: licenseInfo,
        deviceId: meta.deviceId,
        lastVerifiedTimestamp: Date.now(),
      };

      this.saveStoredState(activationState);

      return {
        success: true,
        license: licenseInfo,
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Gagal terhubung ke server aktivasi. Pastikan koneksi internet Anda aktif.',
      };
    }
  }

  /**
   * Verify license with server or offline 7-day grace period
   */
  public static async verify(): Promise<VerificationResult> {
    const stored = this.getStoredState();
    if (!stored || !stored.token || !stored.deviceId) {
      return {
        valid: false,
        error: 'Aplikasi belum diaktifkan dengan License Key Lifetime.',
      };
    }

    const meta = getClientDeviceMetadata();
    // Check if device matches
    if (stored.deviceId !== meta.deviceId) {
      return {
        valid: false,
        error: 'Perangkat ini tidak cocok dengan lisensi yang tersimpan.',
      };
    }

    const now = Date.now();
    const timeSinceLastVerification = now - (stored.lastVerifiedTimestamp || 0);
    const graceRemainingMs = Math.max(0, OFFLINE_GRACE_PERIOD_MS - timeSinceLastVerification);
    const graceRemainingDays = Math.ceil(graceRemainingMs / (1000 * 60 * 60 * 24));

    // Try server verification
    try {
      const res = await fetch('/api/license/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activationToken: stored.token,
          deviceId: meta.deviceId,
          productCode: 'KEL0LA-LEAD',
        }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        // Successful online verification! Update timestamp
        stored.lastVerifiedTimestamp = now;
        stored.license = {
          ...stored.license,
          ...data.license,
          lastVerifiedAt: data.license.lastVerifiedAt,
        };
        this.saveStoredState(stored);

        return {
          valid: true,
          isOffline: false,
          license: stored.license,
        };
      }

      // If server explicitly returned 401 / 403 / 404 (e.g. revoked or suspended or device reset elsewhere)
      if (res.status === 401 || res.status === 403 || res.status === 404) {
        return {
          valid: false,
          error: data.error || 'Lisensi tidak valid atau telah dicabut/ditangguhkan.',
        };
      }

      // If 500 error on server, fallback to offline grace period
      if (timeSinceLastVerification < OFFLINE_GRACE_PERIOD_MS) {
        return {
          valid: true,
          isOffline: true,
          graceRemainingDays,
          license: stored.license,
        };
      } else {
        return {
          valid: false,
          offlineExpired: true,
          error: 'Masa tenggang verifikasi offline (7 hari) telah berakhir. Sambungkan ke internet untuk verifikasi ulang.',
        };
      }
    } catch (netError) {
      // Network error -> user is offline or server unreachable
      if (timeSinceLastVerification < OFFLINE_GRACE_PERIOD_MS) {
        return {
          valid: true,
          isOffline: true,
          graceRemainingDays,
          license: stored.license,
        };
      } else {
        return {
          valid: false,
          offlineExpired: true,
          error: 'Masa tenggang verifikasi offline (7 hari) telah berakhir. Mohon sambungkan ke internet untuk verifikasi lisensi.',
        };
      }
    }
  }

  /**
   * Deactivate current device
   */
  public static async deactivate(): Promise<{ success: boolean; error?: string; message?: string }> {
    const stored = this.getStoredState();
    const meta = getClientDeviceMetadata();

    try {
      if (stored?.token) {
        await fetch('/api/license/deactivate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activationToken: stored.token,
            deviceId: meta.deviceId,
          }),
        });
      }
    } catch (e) {
      console.warn('Deactivate API call failed, removing local activation anyway', e);
    } finally {
      this.clearStoredState();
    }

    return {
      success: true,
      message: 'Perangkat berhasil dilepaskan dari lisensi.',
    };
  }
}
