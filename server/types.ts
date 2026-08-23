export type LicenseStatus = 'pending' | 'active' | 'suspended' | 'revoked';
export type LicensePlan = 'lifetime';

export interface LicenseDevice {
  id: string;
  licenseId: string;
  deviceId: string;
  deviceName: string;
  browser: string;
  operatingSystem: string;
  activatedAt: string;
  lastSeenAt: string;
  status: 'active' | 'deactivated';
}

export interface License {
  id: string;
  licenseKeyHash: string;
  licenseKeyLast4: string;
  productCode: 'KEL0LA-LEAD';
  plan: 'lifetime';
  status: LicenseStatus;
  maxDevices: number; // default 1
  createdAt: string;
  activatedAt: string | null;
  lastVerifiedAt: string | null;
  revokedAt: string | null;
  expiresAt: null; // strictly null for lifetime
  isTest?: boolean;
  notes?: string;
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
  deviceName: string;
  browser: string;
  operatingSystem: string;
}

export interface VerifyRequest {
  activationToken: string;
  deviceId: string;
  productCode?: string;
}

export interface DeactivateRequest {
  activationToken: string;
  deviceId: string;
  licenseKey?: string;
}
