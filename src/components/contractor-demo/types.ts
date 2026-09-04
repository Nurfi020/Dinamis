export type LeadStatus =
  | 'Lead Baru'
  | 'Dihubungi'
  | 'Survey'
  | 'RAB'
  | 'Negosiasi'
  | 'Deal'
  | 'Tidak Jadi';

export type ProjectStage =
  | 'Lead'
  | 'Survey'
  | 'RAB'
  | 'Negosiasi'
  | 'SPK'
  | 'Pengerjaan'
  | 'Selesai';

export type SPKStatus = 'Draft' | 'Menunggu Persetujuan' | 'Aktif' | 'Selesai';

export type MaterialStatus = 'Menunggu' | 'Dibeli' | 'Terpakai';

export type TeamRole = 'Mandor' | 'Tukang' | 'Helper' | 'Supervisor' | 'Estimator';

export interface DemoLead {
  id: string;
  name: string;
  phone: string;
  source: string;
  projectType: string;
  status: LeadStatus;
  potentialValue: number;
  notes: string;
  lastFollowUp: string;
  createdAt: string;
}

export interface DemoSurvey {
  id: string;
  leadId: string;
  leadName: string;
  projectTitle: string;
  date: string;
  locationAddress: string;
  gpsCoords: string;
  notes: string;
  status: 'Dijadwalkan' | 'Selesai' | 'Dibatalkan';
}

export interface DemoRABItem {
  id: string;
  projectId: string;
  category: string;
  taskName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface DemoProject {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string;
  stage: ProjectStage;
  contractValue: number;
  rabBudget: number;
  materialBudget: number;
  startDate: string;
  targetEndDate: string;
  location: string;
  assignedMandor: string;
}

export interface DemoSPK {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  contractValue: number;
  downPayment: number;
  startDate: string;
  targetEndDate: string;
  status: SPKStatus;
  spkNumber: string;
}

export interface DemoMaterial {
  id: string;
  projectId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  actualCost: number;
  supplier: string;
  status: MaterialStatus;
  purchaseDate?: string;
}

export interface DemoTeamMember {
  id: string;
  name: string;
  role: TeamRole;
  phone: string;
  assignedProjectTitle: string;
  dailyRate: number;
  status: 'Aktif di Proyek' | 'Standby';
}

export interface DemoActivity {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'lead' | 'survey' | 'rab' | 'project' | 'material' | 'team';
}
