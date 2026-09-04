export type PipelineStage =
  | 'Lead Baru'
  | 'Dihubungi'
  | 'Follow-up'
  | 'Negosiasi'
  | 'Deal'
  | 'Tidak Jadi';

export type LeadSource =
  | 'WhatsApp'
  | 'Instagram'
  | 'Facebook'
  | 'Google'
  | 'Referral'
  | 'Walk-in'
  | 'Marketplace'
  | 'Lainnya';

export type FollowUpType = 'WhatsApp' | 'Telepon' | 'Meeting' | 'Kirim Penawaran';
export type FollowUpStatus = 'Pending' | 'Selesai' | 'Terlambat';

export type DealStatus = 'Menunggu Pembayaran' | 'DP Diterima' | 'Lunas' | 'Batal';

export interface DemoLead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  source: LeadSource;
  stage: PipelineStage;
  interestProduct: string;
  potentialValue: number;
  notes: string;
  lastContact: string;
  nextFollowUpDate?: string;
  createdAt: string;
}

export interface DemoFollowUp {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  type: FollowUpType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  status: FollowUpStatus;
  notes: string;
  completedAt?: string;
}

export interface DemoProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'Aktif' | 'Nonaktif';
  description: string;
}

export interface DemoDeal {
  id: string;
  leadId: string;
  customerName: string;
  customerCompany: string;
  productId: string;
  productName: string;
  dealValue: number;
  status: DealStatus;
  dealDate: string; // YYYY-MM-DD
  notes: string;
}

export interface DemoActivity {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'lead' | 'pipeline' | 'followup' | 'deal';
  leadId?: string;
}

export type BusinessTabKey =
  | 'dashboard'
  | 'leads'
  | 'pipeline'
  | 'followup'
  | 'deals'
  | 'reports';
