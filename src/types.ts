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

export type FollowUpMethod = 'WhatsApp' | 'Telepon' | 'Meeting' | 'Email';

export type FollowUpResult = 
  | 'Tertarik'
  | 'Minta Harga'
  | 'Minta Detail'
  | 'Masih Pertimbangkan'
  | 'Siap Membeli'
  | 'Tidak Tertarik'
  | 'Tidak Bisa Dihubungi'
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
  initialNotes?: string;
  createdAt: string;
  updatedAt: string;
  lastFollowUpDate?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
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

export type ActiveTab = 'dashboard' | 'leads' | 'followup' | 'reports' | 'profile';

export interface FilterState {
  search: string;
  status: string; // 'all' or LeadStatus
  product: string; // 'all' or specific product
  city: string; // 'all' or specific city
  source: string; // 'all' or LeadSource
  dateRange: 'all' | 'today' | 'this_week' | 'this_month' | 'last_month';
  sortBy: 'latest' | 'oldest' | 'next_followup' | 'name';
}
