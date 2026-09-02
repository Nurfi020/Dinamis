import {
  LayoutDashboard,
  Users,
  PlusCircle,
  CalendarClock,
  BarChart3,
  UserCircle2,
  Award,
  Layers,
  Building2,
  KeyRound,
  Activity,
  Settings,
  Hammer,
  Store,
  FileSpreadsheet,
  FileText,
  HardHat,
  Wallet,
} from 'lucide-react';
import { ActiveTab, DemoRole, DemoPackage, DemoIndustry } from '../types';

export interface NavItem {
  id: ActiveTab;
  label: string;
  icon: any;
  badge?: number;
  isAction?: boolean;
}

export interface LockedTeaserItem {
  id: string;
  label: string;
  icon: any;
  featureTitle: string;
  featureDesc: string;
  reqPackage: DemoPackage;
}

export interface NavigationContext {
  currentPackage: DemoPackage;
  currentRole: DemoRole;
  currentIndustry?: DemoIndustry;
  followUpCount?: number;
}

/**
 * Single Source of Truth for application navigation items.
 * Shared directly by Sidebar (desktop) and MobileNavDrawer (mobile).
 */
export function getNavItems({
  currentPackage,
  currentRole,
  currentIndustry = 'general',
  followUpCount = 0,
}: NavigationContext): NavItem[] {
  const isContractor = currentIndustry === 'contractor';
  const isUmkm = currentIndustry === 'umkm';

  // 1. When in Basic package: Focus on Solo Sales / Small Contractor / Solo UMKM
  if (currentPackage === 'basic') {
    return [
      {
        id: 'dashboard' as ActiveTab,
        label: isContractor ? 'Dashboard Proyek' : isUmkm ? 'Dashboard Usaha' : 'Dashboard Saya',
        icon: LayoutDashboard,
      },
      {
        id: 'leads' as ActiveTab,
        label: isContractor ? 'Prospek Proyek' : isUmkm ? 'Calon Pelanggan' : 'Semua Lead',
        icon: isContractor ? Hammer : isUmkm ? Store : Users,
      },
      ...(isContractor ? [
        {
          id: 'contractor_rab' as ActiveTab,
          label: 'Rencana Anggaran (RAB)',
          icon: FileSpreadsheet,
        },
        {
          id: 'contractor_quotation' as ActiveTab,
          label: 'Penawaran / SPH',
          icon: FileText,
        },
        {
          id: 'contractor_project' as ActiveTab,
          label: 'Proyek & Progress',
          icon: HardHat,
        },
        {
          id: 'contractor_finance' as ActiveTab,
          label: 'Keuangan & Termin',
          icon: Wallet,
        },
      ] : []),
      {
        id: 'add_lead_action' as ActiveTab,
        label: isContractor ? 'Tambah Proyek' : isUmkm ? 'Tambah Pelanggan' : 'Tambah Lead',
        icon: PlusCircle,
        isAction: true,
      },
      {
        id: 'followup' as ActiveTab,
        label: isContractor ? 'Survey & Follow-up' : isUmkm ? 'Follow-up Pelanggan' : 'Follow Up',
        icon: CalendarClock,
        badge: followUpCount > 0 ? followUpCount : undefined,
      },
      {
        id: 'reports' as ActiveTab,
        label: isContractor ? 'Laporan Proyek' : isUmkm ? 'Laporan Penjualan' : 'Laporan Performa',
        icon: BarChart3,
      },
      {
        id: 'profile' as ActiveTab,
        label: 'Pengaturan & Profil',
        icon: UserCircle2,
      },
    ];
  }

  // 2. When in Business package: Focus on Sales & Supervisor teams
  if (currentPackage === 'business') {
    if (currentRole === 'supervisor') {
      return [
        {
          id: 'dashboard' as ActiveTab,
          label: isContractor ? 'Dashboard Tim Proyek' : isUmkm ? 'Dashboard Tim Sales' : 'Dashboard Tim',
          icon: LayoutDashboard,
        },
        {
          id: 'leads' as ActiveTab,
          label: isContractor ? 'Prospek Proyek Tim' : isUmkm ? 'Pelanggan Tim Sales' : 'Lead Anggota Tim',
          icon: isContractor ? Hammer : isUmkm ? Store : Users,
        },
        ...(isContractor ? [
          {
            id: 'contractor_rab' as ActiveTab,
            label: 'Rencana Anggaran (RAB)',
            icon: FileSpreadsheet,
          },
          {
            id: 'contractor_quotation' as ActiveTab,
            label: 'Penawaran / SPH',
            icon: FileText,
          },
          {
            id: 'contractor_project' as ActiveTab,
            label: 'Proyek & Progress',
            icon: HardHat,
          },
          {
            id: 'contractor_finance' as ActiveTab,
            label: 'Keuangan & Termin',
            icon: Wallet,
          },
        ] : []),
        {
          id: 'add_lead_action' as ActiveTab,
          label: isContractor ? 'Tambah Proyek Tim' : isUmkm ? 'Tambah Pelanggan' : 'Tambah Lead Tim',
          icon: PlusCircle,
          isAction: true,
        },
        {
          id: 'followup' as ActiveTab,
          label: isContractor ? 'Monitoring Survey Tim' : isUmkm ? 'Monitoring Follow-up' : 'Follow Up Tim',
          icon: CalendarClock,
          badge: followUpCount > 0 ? followUpCount : undefined,
        },
        {
          id: 'team_performance' as ActiveTab,
          label: isContractor ? 'Kinerja Estimator & Sales' : isUmkm ? 'Kinerja Tim Penjualan' : 'Kinerja Sales Tim',
          icon: Award,
        },
        {
          id: 'reports' as ActiveTab,
          label: isContractor ? 'Laporan Proyek Tim' : isUmkm ? 'Laporan Penjualan Tim' : 'Laporan Tim',
          icon: BarChart3,
        },
        {
          id: 'profile' as ActiveTab,
          label: isContractor ? 'Profil SPV Proyek' : isUmkm ? 'Profil SPV Toko' : 'Profil Supervisor',
          icon: UserCircle2,
        },
      ];
    }

    // Sales in Business
    return [
      {
        id: 'dashboard' as ActiveTab,
        label: isContractor ? 'Dashboard Proyek' : isUmkm ? 'Dashboard Usaha' : 'Dashboard Saya',
        icon: LayoutDashboard,
      },
      {
        id: 'leads' as ActiveTab,
        label: isContractor ? 'Prospek Proyek' : isUmkm ? 'Calon Pelanggan' : 'Semua Lead',
        icon: isContractor ? Hammer : isUmkm ? Store : Users,
      },
      ...(isContractor ? [
        {
          id: 'contractor_rab' as ActiveTab,
          label: 'Rencana Anggaran (RAB)',
          icon: FileSpreadsheet,
        },
        {
          id: 'contractor_quotation' as ActiveTab,
          label: 'Penawaran / SPH',
          icon: FileText,
        },
        {
          id: 'contractor_project' as ActiveTab,
          label: 'Proyek & Progress',
          icon: HardHat,
        },
        {
          id: 'contractor_finance' as ActiveTab,
          label: 'Keuangan & Termin',
          icon: Wallet,
        },
      ] : []),
      {
        id: 'add_lead_action' as ActiveTab,
        label: isContractor ? 'Tambah Proyek' : isUmkm ? 'Tambah Pelanggan' : 'Tambah Lead',
        icon: PlusCircle,
        isAction: true,
      },
      {
        id: 'followup' as ActiveTab,
        label: isContractor ? 'Survey & Follow-up' : isUmkm ? 'Follow-up Pelanggan' : 'Follow Up',
        icon: CalendarClock,
        badge: followUpCount > 0 ? followUpCount : undefined,
      },
      {
        id: 'team_performance' as ActiveTab,
        label: isContractor ? 'Leaderboard Proyek' : isUmkm ? 'Leaderboard Sales' : 'Leaderboard Tim',
        icon: Award,
      },
      {
        id: 'reports' as ActiveTab,
        label: isContractor ? 'Laporan Proyek' : isUmkm ? 'Laporan Penjualan' : 'Laporan Performa',
        icon: BarChart3,
      },
      {
        id: 'profile' as ActiveTab,
        label: 'Pengaturan & Profil',
        icon: UserCircle2,
      },
    ];
  }

  // 3. When in Enterprise package: Full 4 Roles Matrix
  switch (currentRole) {
    case 'sales':
      return [
        {
          id: 'dashboard' as ActiveTab,
          label: isContractor ? 'Dashboard Proyek Saya' : isUmkm ? 'Dashboard Penjualan' : 'Dashboard Saya',
          icon: LayoutDashboard,
        },
        {
          id: 'leads' as ActiveTab,
          label: isContractor ? 'Prospek Proyek' : isUmkm ? 'Calon Pelanggan' : 'Semua Lead',
          icon: isContractor ? Hammer : isUmkm ? Store : Users,
        },
        ...(isContractor ? [
          {
            id: 'contractor_rab' as ActiveTab,
            label: 'Rencana Anggaran (RAB)',
            icon: FileSpreadsheet,
          },
          {
            id: 'contractor_quotation' as ActiveTab,
            label: 'Penawaran / SPH',
            icon: FileText,
          },
          {
            id: 'contractor_project' as ActiveTab,
            label: 'Proyek & Progress',
            icon: HardHat,
          },
          {
            id: 'contractor_finance' as ActiveTab,
            label: 'Keuangan & Termin',
            icon: Wallet,
          },
        ] : []),
        {
          id: 'add_lead_action' as ActiveTab,
          label: isContractor ? 'Tambah Proyek' : isUmkm ? 'Tambah Pelanggan' : 'Tambah Lead',
          icon: PlusCircle,
          isAction: true,
        },
        {
          id: 'followup' as ActiveTab,
          label: isContractor ? 'Survey & Follow-up' : isUmkm ? 'Follow-up Pelanggan' : 'Follow Up',
          icon: CalendarClock,
          badge: followUpCount > 0 ? followUpCount : undefined,
        },
        {
          id: 'reports' as ActiveTab,
          label: isContractor ? 'Laporan Pipeline Proyek' : isUmkm ? 'Laporan Penjualan' : 'Laporan Performa',
          icon: BarChart3,
        },
        {
          id: 'profile' as ActiveTab,
          label: 'Pengaturan & Profil',
          icon: UserCircle2,
        },
      ];

    case 'supervisor':
      return [
        {
          id: 'dashboard' as ActiveTab,
          label: isContractor ? 'Dashboard Tim Proyek' : isUmkm ? 'Dashboard Tim Sales' : 'Dashboard Tim',
          icon: LayoutDashboard,
        },
        {
          id: 'leads' as ActiveTab,
          label: isContractor ? 'Prospek Proyek Tim' : isUmkm ? 'Pelanggan Tim Sales' : 'Lead Anggota Tim',
          icon: isContractor ? Hammer : isUmkm ? Store : Users,
        },
        ...(isContractor ? [
          {
            id: 'contractor_rab' as ActiveTab,
            label: 'Rencana Anggaran (RAB)',
            icon: FileSpreadsheet,
          },
          {
            id: 'contractor_quotation' as ActiveTab,
            label: 'Penawaran / SPH',
            icon: FileText,
          },
          {
            id: 'contractor_project' as ActiveTab,
            label: 'Proyek & Progress',
            icon: HardHat,
          },
          {
            id: 'contractor_finance' as ActiveTab,
            label: 'Keuangan & Termin',
            icon: Wallet,
          },
        ] : []),
        {
          id: 'add_lead_action' as ActiveTab,
          label: isContractor ? 'Tambah Proyek Tim' : isUmkm ? 'Tambah Pelanggan' : 'Tambah Lead Tim',
          icon: PlusCircle,
          isAction: true,
        },
        {
          id: 'followup' as ActiveTab,
          label: isContractor ? 'Monitoring Survey Tim' : isUmkm ? 'Monitoring Follow-up' : 'Follow Up Tim',
          icon: CalendarClock,
          badge: followUpCount > 0 ? followUpCount : undefined,
        },
        {
          id: 'team_performance' as ActiveTab,
          label: isContractor ? 'Kinerja Estimator & Sales' : isUmkm ? 'Kinerja Tim Penjualan' : 'Kinerja Sales Tim',
          icon: Award,
        },
        {
          id: 'reports' as ActiveTab,
          label: isContractor ? 'Laporan Pipeline Tim' : isUmkm ? 'Laporan Penjualan Tim' : 'Laporan Tim',
          icon: BarChart3,
        },
        {
          id: 'profile' as ActiveTab,
          label: isContractor ? 'Profil SPV Proyek' : isUmkm ? 'Profil SPV Toko' : 'Profil Supervisor',
          icon: UserCircle2,
        },
      ];

    case 'manager':
      return [
        {
          id: 'dashboard' as ActiveTab,
          label: isContractor ? 'Dashboard Direksi Proyek' : isUmkm ? 'Dashboard Owner Bisnis' : 'Dashboard Eksekutif',
          icon: LayoutDashboard,
        },
        {
          id: 'branches' as ActiveTab,
          label: isContractor ? 'Proyek Multi-Cabang' : isUmkm ? 'Kinerja Multi-Outlet' : 'Kinerja Cabang',
          icon: Building2,
        },
        {
          id: 'teams' as ActiveTab,
          label: isContractor ? 'Divisi & Tim Konstruksi' : isUmkm ? 'Kinerja Tim & Toko' : 'Kinerja Tim Unit',
          icon: Users,
        },
        {
          id: 'leads' as ActiveTab,
          label: isContractor ? 'Pipeline Proyek Nasional' : isUmkm ? 'Semua Pipeline Pelanggan' : 'Semua Pipeline Lead',
          icon: Layers,
        },
        ...(isContractor ? [
          {
            id: 'contractor_rab' as ActiveTab,
            label: 'RAB & Estimasi Biaya',
            icon: FileSpreadsheet,
          },
          {
            id: 'contractor_quotation' as ActiveTab,
            label: 'Penawaran & SPH Proyek',
            icon: FileText,
          },
          {
            id: 'contractor_project' as ActiveTab,
            label: 'Monitoring Proyek',
            icon: HardHat,
          },
          {
            id: 'contractor_finance' as ActiveTab,
            label: 'Keuangan Proyek',
            icon: Wallet,
          },
        ] : []),
        {
          id: 'reports' as ActiveTab,
          label: isContractor ? 'Laporan Direksi Proyek' : isUmkm ? 'Laporan Owner Bisnis' : 'Laporan Manajemen',
          icon: BarChart3,
        },
        {
          id: 'profile' as ActiveTab,
          label: isContractor ? 'Profil Project Director' : isUmkm ? 'Profil Owner / Manager' : 'Profil Manager',
          icon: UserCircle2,
        },
      ];

    case 'admin':
      return [
        {
          id: 'dashboard' as ActiveTab,
          label: isContractor ? 'Dashboard Admin Kontrak' : isUmkm ? 'Dashboard Admin Toko' : 'Dashboard Sistem',
          icon: LayoutDashboard,
        },
        {
          id: 'users' as ActiveTab,
          label: isContractor ? 'Manajemen Estimator & Staff' : isUmkm ? 'Manajemen Staff & Kasir' : 'Manajemen Pengguna',
          icon: Users,
        },
        {
          id: 'branches' as ActiveTab,
          label: isContractor ? 'Master Cabang & Wilayah' : isUmkm ? 'Master Outlet & Toko' : 'Master Cabang & Tim',
          icon: Building2,
        },
        ...(isContractor ? [
          {
            id: 'contractor_rab' as ActiveTab,
            label: 'Master RAB Proyek',
            icon: FileSpreadsheet,
          },
          {
            id: 'contractor_quotation' as ActiveTab,
            label: 'Master SPH Penawaran',
            icon: FileText,
          },
          {
            id: 'contractor_project' as ActiveTab,
            label: 'Master Proyek Konstruksi',
            icon: HardHat,
          },
          {
            id: 'contractor_finance' as ActiveTab,
            label: 'Master Keuangan Proyek',
            icon: Wallet,
          },
        ] : []),
        {
          id: 'admin_licenses' as ActiveTab,
          label: 'Manajemen Lisensi',
          icon: KeyRound,
        },
        {
          id: 'audit_log' as ActiveTab,
          label: 'Audit & Activity Log',
          icon: Activity,
        },
        {
          id: 'settings' as ActiveTab,
          label: 'Pengaturan Sistem',
          icon: Settings,
        },
        {
          id: 'profile' as ActiveTab,
          label: 'Profil Admin',
          icon: UserCircle2,
        },
      ];
  }
}

/**
 * Single Source of Truth for locked feature teasers.
 * Shared directly by Sidebar (desktop) and MobileNavDrawer (mobile).
 */
export function getLockedTeasers({
  currentPackage,
  currentIndustry = 'general',
}: {
  currentPackage: DemoPackage;
  currentIndustry?: DemoIndustry;
}): LockedTeaserItem[] {
  const isContractor = currentIndustry === 'contractor';
  const isUmkm = currentIndustry === 'umkm';

  if (currentPackage === 'basic') {
    return [
      {
        id: 'team_performance',
        label: isContractor ? 'Kinerja Estimator' : isUmkm ? 'Kinerja Tim Sales' : 'Kinerja Tim',
        icon: Award,
        featureTitle: isContractor
          ? 'Kinerja Estimator & Tim Proyek'
          : isUmkm
          ? 'Kinerja Tim Penjualan Toko'
          : 'Kinerja & Leaderboard Tim',
        featureDesc: isContractor
          ? 'Pantau target kontrak dan SLA survey seluruh tim estimator pada Paket Business & Enterprise.'
          : isUmkm
          ? 'Pantau pencapaian target penjualan tim kasir/sales toko pada Paket Business & Enterprise.'
          : 'Pantau capaian target seluruh anggota tim sales dan SLA tindak lanjut pada Paket Business & Enterprise.',
        reqPackage: 'business',
      },
      {
        id: 'branches',
        label: isContractor ? 'Proyek Cabang' : isUmkm ? 'Multi-Outlet' : 'Kinerja Cabang',
        icon: Building2,
        featureTitle: isContractor
          ? 'Manajemen Proyek Multi-Cabang'
          : isUmkm
          ? 'Manajemen Multi-Outlet & Toko'
          : 'Manajemen Multi-Cabang & Organisasi',
        featureDesc: isContractor
          ? 'Konsolidasi seluruh proyek cabang regional dan dashboard direksi pada Paket Enterprise.'
          : isUmkm
          ? 'Konsolidasi performa multi-outlet dan cabang toko UMKM pada Paket Enterprise.'
          : 'Konsolidasi analitik seluruh kantor cabang dan dashboard eksekutif pada Paket Enterprise.',
        reqPackage: 'enterprise',
      },
    ];
  }

  if (currentPackage === 'business') {
    return [
      {
        id: 'branches',
        label: isContractor ? 'Proyek Cabang' : isUmkm ? 'Multi-Outlet' : 'Kinerja Cabang',
        icon: Building2,
        featureTitle: isContractor
          ? 'Manajemen Proyek Multi-Cabang'
          : isUmkm
          ? 'Manajemen Multi-Outlet'
          : 'Manajemen Multi-Cabang',
        featureDesc: isContractor
          ? 'Konsolidasi analitik proyek cabang regional dan dashboard direksi pada Paket Enterprise.'
          : isUmkm
          ? 'Konsolidasi performa multi-outlet dan jaringan toko pada Paket Enterprise.'
          : 'Konsolidasi analitik performa cabang regional dan dashboard direksi pada Paket Enterprise.',
        reqPackage: 'enterprise',
      },
      {
        id: 'audit_log',
        label: 'Audit & Log',
        icon: Activity,
        featureTitle: 'Audit & Activity Trail',
        featureDesc: 'Rekam jejak keamanan dan log perubahan data seluruh organisasi pada Paket Enterprise.',
        reqPackage: 'enterprise',
      },
    ];
  }

  return [];
}
