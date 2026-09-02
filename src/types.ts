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

export type DemoRole = 'sales' | 'supervisor' | 'manager' | 'admin';

export interface DemoPersona {
  id: string;
  role: DemoRole;
  name: string;
  title: string;
  organization: string;
  branch: string;
  team?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  monthlyTarget?: number;
  closingCount?: number;
}

export interface TeamMemberPerformance {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  leadsCount: number;
  hotLeadsCount: number;
  pipelineValue: number;
  closingCount: number;
  closingValue: number;
  monthlyTarget: number;
  achievementPct: number;
  conversionRatePct: number;
  pendingFollowUps: number;
}

export interface BranchPerformance {
  id: string;
  name: string;
  city: string;
  headName: string;
  teamsCount: number;
  salesCount: number;
  leadsCount: number;
  pipelineValue: number;
  closingCount: number;
  closingValue: number;
  monthlyTarget: number;
  achievementPct: number;
  conversionRatePct: number;
}

export interface TeamPerformance {
  id: string;
  name: string;
  branchName: string;
  supervisorName: string;
  salesCount: number;
  leadsCount: number;
  pipelineValue: number;
  closingCount: number;
  closingValue: number;
  conversionRatePct: number;
  achievementPct: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityName: string;
  details: string;
  ipAddress?: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'leads'
  | 'pipeline'
  | 'followup'
  | 'contractor_rab'
  | 'contractor_quotation'
  | 'contractor_project'
  | 'team_performance'
  | 'branches'
  | 'teams'
  | 'reports'
  | 'users'
  | 'audit_log'
  | 'settings'
  | 'profile'
  | 'admin_licenses';

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

export type DemoPackage = 'basic' | 'business' | 'enterprise';

export interface DemoPackageConfig {
  id: DemoPackage;
  name: string;
  tagline: string;
  badge?: string;
  targetAudience: string;
  colorTheme: {
    name: string;
    primary: string;
    dark: string;
    light: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    pillActive: string;
  };
  allowedRoles: DemoRole[];
  availableTabs: ActiveTab[];
  features: string[];
}

export type DemoIndustry = 'general' | 'umkm' | 'contractor';

export interface DemoIndustryConfig {
  id: DemoIndustry;
  name: string;
  badge: string;
  leadLabel: string;
  leadsLabel: string;
  productLabel: string;
  valueLabel: string;
  pipelineLabel: string;
  closingLabel: string;
  defaultOrganization: {
    basic: string;
    business: string;
    enterprise: string;
  };
  projectTypes: string[];
  pipelineStages: {
    key: LeadStatus;
    contractorStage: string;
    label: string;
    subLabel: string;
    description: string;
  }[];
}

// ==========================================
// PHASE 2D-1: CONTRACTOR RAB CORE DATA MODEL
// ==========================================

export type RABStatus = 'Draft' | 'Final';

export type WorkCategory =
  | 'Pekerjaan Persiapan'
  | 'Pekerjaan Pondasi & Struktur'
  | 'Pekerjaan Dinding & Plesteran'
  | 'Pekerjaan Atap & Plafon'
  | 'Pekerjaan Lantai & Keramik'
  | 'Pekerjaan Pintu, Jendela & Kaca'
  | 'Pekerjaan Instalasi Listrik & MEP'
  | 'Pekerjaan Sanitasi & Plumbing'
  | 'Pekerjaan Pengecatan & Finishing'
  | 'Pekerjaan Eksterior & Lanskap'
  | 'Lain-lain';

export interface RABItem {
  id: string;
  rabId: string;
  category: WorkCategory;
  itemName: string;
  description?: string;
  volume: number;
  unit: string;
  materialUnitPrice: number;
  materialTotal: number;
  laborUnitPrice: number;
  laborTotal: number;
  subtotal: number;
}

export interface RAB {
  id: string;
  rabNumber: string;
  leadId?: string;
  projectName: string;
  clientName: string;
  clientPhone: string;
  projectLocation: string;
  buildingAreaM2?: number;
  status: RABStatus;
  items: RABItem[];
  materialTotal: number;
  laborTotal: number;
  subtotalCost: number;
  overheadType: 'percent' | 'nominal';
  overheadValue: number;
  overheadAmount: number;
  marginType: 'percent' | 'nominal';
  marginValue: number;
  marginAmount: number;
  discountAmount: number;
  grandTotal: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ====================================================
// PHASE 2D-2: CONTRACTOR QUOTATION / SPH DATA MODEL
// ====================================================

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. SPH-2026-0001
  rabId: string;
  rabNumber: string;
  leadId?: string;

  // Project & Client Info Snapshot
  projectName: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  projectLocation: string;
  buildingAreaM2?: number;

  // Quotation Specific Dates & Validity
  quotationDate: string; // YYYY-MM-DD
  validityDays: number; // e.g. 14, 30 days
  validUntil: string; // YYYY-MM-DD

  // Company Information (Contractor / Vendor)
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;

  // Work Scope & Commercial Terms
  workDescription: string;
  paymentTerms: string;
  termsAndConditions: string;
  notes?: string;

  // Financial Breakdown Snapshot (Inherited from approved RAB)
  materialTotal: number;
  laborTotal: number;
  subtotalCost: number; // HPP Riil
  overheadAmount: number;
  overheadValue: number;
  marginAmount: number;
  marginValue: number;
  discountAmount: number;
  grandTotal: number; // Nilai Total Penawaran SPH

  // Status & Metadata
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
}

// ====================================================
// PHASE 2D-3: CONTRACTOR PROJECT TRACKING & PROGRESS MODEL
// ====================================================

export type ProjectStage =
  | 'Persiapan'
  | 'Struktur'
  | 'Arsitektur'
  | 'MEP'
  | 'Finishing'
  | 'Serah Terima (PHO)'
  | 'Selesai';

export type ProjectStatus =
  | 'Planning'
  | 'In_Progress'
  | 'Delayed'
  | 'Completed'
  | 'On_Hold';

export interface ProjectMilestone {
  id: string;
  name: string;
  category: string;
  weightPercent: number; // Bobot % (Total sum of all milestones = 100%)
  targetStartDate: string; // YYYY-MM-DD
  targetEndDate: string; // YYYY-MM-DD
  actualProgressPercent: number; // 0 - 100%
  status: 'Pending' | 'In_Progress' | 'Completed';
}

export interface ProgressLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weekNumber: number; // Minggu ke-N
  plannedProgressPercent: number; // Target Kurva S % pada tanggal tsb
  actualProgressPercent: number; // Realisasi Lapangan kumulatif %
  deviationPercent: number; // Actual - Planned (+ / -)
  workSummary: string;
  weatherCondition?: 'Cerah' | 'Hujan Ringan' | 'Hujan Lebat';
  manpowerCount?: number;
  notes?: string;
  createdAt: string;
}

export interface ContractorProject {
  id: string;
  projectNumber: string; // e.g. PRJ-2026-0001
  quotationId?: string;
  quotationNumber?: string;
  rabId: string;
  rabNumber: string;
  leadId?: string;

  // Identity & Client Info Snapshot
  projectName: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  projectLocation: string;
  buildingAreaM2?: number;

  // Contract & Financial Value
  contractValue: number; // Snapshot dari SPH grandTotal / RAB fallback
  contractNumber?: string;
  contractStartDate: string; // YYYY-MM-DD
  contractEndDate: string; // YYYY-MM-DD
  durationDays: number;

  // Execution State & Calculated Metrics
  status: ProjectStatus;
  stage: ProjectStage;
  targetProgressPercent: number; // Target Kurva S saat ini
  currentProgressPercent: number; // Realisasi bobot tertimbang saat ini
  deviationPercent: number; // currentProgress - targetProgress

  // Milestones & Progress Log History
  milestones: ProjectMilestone[];
  progressLogs: ProgressLogEntry[];

  // Site Supervisor / Field Management
  siteManagerName?: string;
  siteManagerPhone?: string;

  createdAt: string;
  updatedAt: string;
}