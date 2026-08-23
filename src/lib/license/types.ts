export type LicenseStatus = 'pending' | 'active' | 'suspended' | 'revoked';
export type DeviceStatus = 'active' | 'deactivated';

export interface License {
  id: string;
  licenseKeyHash: string;
  licenseKeyLast4: string;
  productCode: string;
  plan: 'lifetime';
  status: LicenseStatus;
  maxDevices: number;
  createdAt: string;
  activatedAt: string | null;
  lastVerifiedAt: string | null;
  revokedAt: string | null;
  expiresAt: null;
  isTest?: boolean;
  notes?: string;
}

export interface LicenseDevice {
  id: string;
  licenseId: string;
  deviceId: string;
  deviceName: string;
  browser: string;
  operatingSystem: string;
  activatedAt: string;
  lastSeenAt: string;
  status: DeviceStatus;
}

export interface ActivationTokenRecord {
  token: string;
  licenseId: string;
  deviceId: string;
  issuedAt: string;
  expiresAt: null;
}

export interface ActivateRequest {
  licenseKey: string;
  deviceId: string;
  deviceName?: string;
  browser?: string;
  operatingSystem?: string;
}

export interface VerifyRequest {
  activationToken: string;
  deviceId: string;
  productCode?: string;
}

export interface DeactivateRequest {
  activationToken?: string;
  deviceId: string;
}
