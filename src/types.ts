export type LeadStatus = 'Cold' | 'Warm' | 'Hot' | 'Closing' | 'Tidak Berhasil';

export type LeadSource = 
  | 'WhatsApp'
  | 'Facebook'
  | 'Instagram'
  | 'TikTok'
  | 'Website'
  | 'Referral'
  | 'Marketplace'
  | 'Lainnya';

export type FollowUpMethod = 'WhatsApp' | 'Telepon' | 'Meeting' | 'Email' | 'Lainnya';

export type FollowUpResult = 
  | 'Tertarik'
  | 'Minta Harga'
  | 'Minta Detail'
  | 'Masih Pertimbangkan'
  | 'Siap Membeli'
  | 'Tidak Tertarik'
  | 'Tidak Bisa Dihubungi'
  | 'Buka Kembali'
  | 'Lainnya';

export type LostReason = 
  | 'Harga terlalu mahal'
  | 'Memilih kompetitor'
  | 'Tidak membutuhkan produk'
  | 'Tidak dapat dihubungi'
  | 'Nomor tidak valid'
  | 'Lainnya';

export interface FollowUpLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  method: FollowUpMethod;
  result: FollowUpResult;
  notes?: string;
  oldStatus?: LeadStatus;
  newStatus: LeadStatus;
  lostReason?: LostReason | string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  source: LeadSource;
  product: string;
  status: LeadStatus;
  value?: number; // Estimasi nilai nominal deal (Rupiah)
  initialNotes?: string;
  createdAt: string;
  updatedAt: string;
  lastFollowUpDate?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  closedAt?: string;
  lostAt?: string;
  lostReason?: LostReason | string;
  followUps: FollowUpLog[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl?: string;
  monthlyTarget: number;
  closingCount: number;
}

export type ActiveTab = 'dashboard' | 'leads' | 'followup' | 'reports' | 'profile' | 'admin_licenses';

export interface LicenseInfo {
  id: string;
  plan: 'lifetime';
  status: 'active' | 'pending' | 'suspended' | 'revoked';
  productCode: 'KEL0LA-LEAD';
  licenseKeyLast4: string;
  fullKeyMasked?: string;
  isTest?: boolean;
  activatedAt: string;
  lastVerifiedAt?: string;
  expiresAt: null;
  deviceName?: string;
  browser?: string;
  operatingSystem?: string;
}

export interface StoredActivationState {
  token: string;
  license: LicenseInfo;
  deviceId: string;
  lastVerifiedTimestamp: number;
}

export interface FilterState {
  search: string;
  status: string; // 'all' or LeadStatus
  product: string; // 'all' or specific product
  city: string; // 'all' or specific city
  source: string; // 'all' or LeadSource
  dateRange: 'all' | 'today' | 'this_week' | 'this_month' | 'last_month';
  sortBy: 'latest' | 'oldest' | 'next_followup' | 'overdue' | 'name' | 'value_high' | 'value_low';
}

export interface DevModeInfo {
  isDevMode: boolean;
  startDate?: string;
  expiresAt?: string;
  remainingDays?: number;
  environment?: string;
  host?: string;
}