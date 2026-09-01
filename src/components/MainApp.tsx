'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lead, 
  LeadStatus, 
  ActiveTab, 
  UserProfile, 
  FollowUpLog, 
  LicenseInfo, 
  DevModeInfo,
  DemoRole,
  DemoPersona,
  DemoPackage
} from '../types';
import { 
  getStoredLeads, 
  saveStoredLeads, 
  resetStoredLeads, 
  getStoredProfile, 
  saveStoredProfile, 
  INITIAL_USER_PROFILE, 
  INITIAL_LEADS 
} from '../data/mockData';
import { DEMO_PERSONAS } from '../data/enterpriseDemoData';
import { DEMO_PACKAGES } from '../data/packageDemoData';
import { leadService, followUpService, profileService } from '../services/api';
import { Sidebar } from './layout/Sidebar';
import { BottomNav } from './layout/BottomNav';
import { TopHeader } from './layout/TopHeader';
import { DashboardView } from './dashboard/DashboardView';
import { SupervisorDashboardView } from './supervisor/SupervisorDashboardView';
import { ManagerDashboardView } from './manager/ManagerDashboardView';
import { AdminDashboardView } from './admin/AdminDashboardView';
import { 
  AdminUsersView, 
  AdminBranchesView, 
  AdminAuditLogView, 
  AdminSettingsView 
} from './admin/AdminEnterpriseViews';
import { LeadListView } from './leads/LeadListView';
import { LeadDetailView } from './leads/LeadDetailView';
import { AddLeadModal } from './leads/AddLeadModal';
import { EditLeadModal } from './leads/EditLeadModal';
import { LogFollowUpModal } from './followup/LogFollowUpModal';
import { FollowUpListView } from './followup/FollowUpListView';
import { ReportsView } from './reports/ReportsView';
import { ProfileView } from './profile/ProfileView';
import { HelpGuideModal } from './common/HelpGuideModal';
import { ToastContainer, ToastMessage } from './common/Toast';
import { LockedFeatureModal } from './common/LockedFeatureModal';
import { ActivateView } from './license/ActivateView';
import { LicenseClient } from '../services/licenseClient';
import { DevModeClient } from '../services/devModeClient';

// TODO: Re-enable authentication before public production release.
const AUTH_BYPASS_ENABLED = true;

const MOCK_ACTIVE_LICENSE: LicenseInfo = {
  id: 'dev-mock-license',
  plan: 'lifetime',
  status: 'active',
  productCode: 'KEL0LA-LEAD',
  licenseKeyLast4: '8888',
  fullKeyMasked: 'KLDN-LIFE-****-****-8888',
  activatedAt: '2026-08-26T00:00:00.000Z',
  lastVerifiedAt: new Date().toISOString(),
  expiresAt: null,
  deviceName: 'Browser Device',
  browser: 'Web Browser',
  operatingSystem: 'Windows/MacOS',
};

const MOCK_DEV_MODE_INFO: DevModeInfo = {
  isDevMode: true,
  startDate: '2026-08-26T00:00:00.000Z',
  expiresAt: '2026-09-25T00:00:00.000Z',
  remainingDays: 30,
  environment: 'development',
  host: 'localhost',
};

export interface MainAppProps {
  initialTab?: ActiveTab;
  initialLeadId?: string | null;
  initialOpenAddModal?: boolean;
}

export function MainApp({
  initialTab = 'dashboard',
  initialLeadId = null,
  initialOpenAddModal = false,
}: MainAppProps) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(initialLeadId);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // DEMO PACKAGE STATE (Basic / Business / Enterprise)
  const [currentPackage, setCurrentPackage] = useState<DemoPackage>('enterprise');

  // ENTERPRISE DEMO ROLE & PERSONA STATE
  const [currentRole, setCurrentRole] = useState<DemoRole>('sales');
  const [currentPersona, setCurrentPersona] = useState<DemoPersona>(DEMO_PERSONAS.sales);

  // Locked Feature Modal State
  const [lockedModal, setLockedModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    requiredPackage: DemoPackage;
  }>({
    isOpen: false,
    title: '',
    description: '',
    requiredPackage: 'enterprise',
  });

  // License & Dev Mode state (bypassed if AUTH_BYPASS_ENABLED is true)
  const [isLicenseChecking, setIsLicenseChecking] = useState(!AUTH_BYPASS_ENABLED);
  const [isActivated, setIsActivated] = useState(AUTH_BYPASS_ENABLED);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(
    AUTH_BYPASS_ENABLED ? MOCK_ACTIVE_LICENSE : null
  );
  const [devModeInfo, setDevModeInfo] = useState<DevModeInfo | null>(
    AUTH_BYPASS_ENABLED ? MOCK_DEV_MODE_INFO : null
  );
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialOpenAddModal);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [isLogFollowUpOpen, setIsLogFollowUpOpen] = useState(false);
  const [leadForFollowUp, setLeadForFollowUp] = useState<Lead | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Filters state from dashboard quick click
  const [initialFilterStatus, setInitialFilterStatus] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('this_week');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync props if changed
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialLeadId !== undefined) {
      setSelectedLeadId(initialLeadId);
    }
  }, [initialLeadId]);

  useEffect(() => {
    if (initialOpenAddModal !== undefined) {
      setIsAddModalOpen(initialOpenAddModal);
    }
  }, [initialOpenAddModal]);

  // Load stored demo package preference from isolated key on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPkg = localStorage.getItem('kelola_lead_demo_package_v1') as DemoPackage;
      if (storedPkg && (storedPkg === 'basic' || storedPkg === 'business' || storedPkg === 'enterprise')) {
        setCurrentPackage(storedPkg);
      }
    }
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Package Switcher Handler
  const handleSwitchPackage = (newPkg: DemoPackage) => {
    setCurrentPackage(newPkg);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kelola_lead_demo_package_v1', newPkg);
    }

    // Role adaptation based on package tier
    if (newPkg === 'basic' && currentRole !== 'sales') {
      setCurrentRole('sales');
      setCurrentPersona(DEMO_PERSONAS.sales);
    } else if (newPkg === 'business' && (currentRole === 'manager' || currentRole === 'admin')) {
      setCurrentRole('supervisor');
      setCurrentPersona(DEMO_PERSONAS.supervisor);
    }

    setSelectedLeadId(null);
    setActiveTab('dashboard');
    addToast(
      'info',
      `Beralih ke Demo: ${DEMO_PACKAGES[newPkg].name}`,
      DEMO_PACKAGES[newPkg].tagline
    );
  };

  // Role Switcher Handler (Instant Simulated State)
  const handleSwitchRole = (role: DemoRole) => {
    const targetPersona = DEMO_PERSONAS[role];
    setCurrentRole(role);
    setCurrentPersona(targetPersona);
    setSelectedLeadId(null);
    setActiveTab('dashboard');
    addToast('info', `Beralih ke ${role.toUpperCase()} Portal`, `Akun aktif: ${targetPersona.name} (${targetPersona.title})`);
  };

  // Locked feature trigger handler
  const handleOpenLockedFeature = (title: string, description: string, reqPkg: DemoPackage = 'enterprise') => {
    setLockedModal({
      isOpen: true,
      title,
      description,
      requiredPackage: reqPkg,
    });
  };

  // Fetch from backend API with fallback to local storage
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [leadsData, profileData] = await Promise.all([
        leadService.getLeads().catch(() => getStoredLeads()),
        profileService.getProfile().catch(() => getStoredProfile()),
      ]);
      setLeads(leadsData);
      setProfile(profileData);
      saveStoredLeads(leadsData);
      saveStoredProfile(profileData);
    } catch {
      setLeads(getStoredLeads());
      setProfile(getStoredProfile());
    } finally {
      setIsLoading(false);
    }
  };

  // Check Development Mode & License on initial mount or bypass
  useEffect(() => {
    setIsClient(true);

    // TODO: Re-enable authentication before public production release.
    if (AUTH_BYPASS_ENABLED) {
      setIsActivated(true);
      setIsLicenseChecking(false);
      setDevModeInfo(MOCK_DEV_MODE_INFO);
      setLicenseInfo(MOCK_ACTIVE_LICENSE);
      loadData();
      return;
    }

    const checkAccess = async () => {
      setIsLicenseChecking(true);
      try {
        // 1. Check if official Development Mode is active
        const devCheck = await DevModeClient.checkStatus();
        if (devCheck.isDevMode) {
          setIsActivated(true);
          setDevModeInfo(devCheck);
          setLicenseInfo(null);
          loadData();
          setIsLicenseChecking(false);
          return;
        }

        // 2. Production or non-dev flow: Standard license verification
        const verifyResult = await LicenseClient.verify();
        if (verifyResult.valid && verifyResult.license) {
          setIsActivated(true);
          setDevModeInfo(null);
          setLicenseInfo(verifyResult.license);
          loadData();
        } else {
          setIsActivated(false);
          setDevModeInfo(null);
          setLicenseInfo(null);
        }
      } catch {
        setIsActivated(false);
        setDevModeInfo(null);
        setLicenseInfo(null);
      } finally {
        setIsLicenseChecking(false);
      }
    };
    checkAccess();
  }, []);

  const handleDeactivateLicense = async () => {
    // TODO: Re-enable authentication before public production release.
    if (!AUTH_BYPASS_ENABLED) {
      await LicenseClient.deactivate();
      setIsActivated(false);
      setLicenseInfo(null);
      setDevModeInfo(null);
    }
    addToast('info', 'Perangkat Dilepaskan', 'Lisensi berhasil dinonaktifkan dari perangkat ini.');
  };

  // Find currently selected lead
  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  // Active follow up badge calculation
  const followUpCount = leads.filter(
    (l) => l.nextFollowUpDate && l.status !== 'Closing' && l.status !== 'Tidak Berhasil'
  ).length;

  // Handler: Add Lead
  const handleSaveNewLead = async (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'followUps'>) => {
    const tempId = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...newLeadData,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followUps: [],
    };

    // Optimistic UI update
    const updated = [newLead, ...leads];
    setLeads(updated);
    saveStoredLeads(updated);

    try {
      const created = await leadService.createLead({
        name: newLeadData.name,
        phone: newLeadData.phone,
        city: newLeadData.city,
        source: newLeadData.source,
        productId: newLeadData.product,
        status: newLeadData.status,
        initialNotes: newLeadData.initialNotes,
      });
      // Replace with real database record
      setLeads((prev) => prev.map((l) => (l.id === tempId ? created : l)));
      addToast('success', 'Lead Baru Berhasil Ditambahkan', `${newLead.name} telah masuk ke daftar prospek.`);
    } catch {
      addToast('success', 'Lead Disimpan Lokal', `${newLead.name} berhasil ditambahkan (Mode Offline).`);
    }

    setIsAddModalOpen(false);
  };

  // Handler: Update Lead
  const handleUpdateLead = async (leadId: string, updatedData: Partial<Lead>) => {
    const updated = leads.map((lead) => {
      if (lead.id === leadId) {
        return {
          ...lead,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
      }
      return lead;
    });

    setLeads(updated);
    saveStoredLeads(updated);

    try {
      await leadService.updateLead(leadId, updatedData);
      addToast('success', 'Data Lead Diperbarui', 'Perubahan data prospek berhasil disimpan.');
    } catch {
      addToast('success', 'Data Lead Diperbarui Lokal', 'Perubahan disimpan (Mode Offline).');
    }

    setIsEditModalOpen(false);
    setLeadToEdit(null);
  };

  // Handler: Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    const targetLead = leads.find((l) => l.id === leadId);
    const updated = leads.filter((lead) => lead.id !== leadId);
    setLeads(updated);
    saveStoredLeads(updated);
    setSelectedLeadId(null);

    try {
      await leadService.deleteLead(leadId);
      addToast('success', 'Lead Berhasil Dihapus', `${targetLead?.name || 'Lead'} telah dihapus.`);
    } catch {
      addToast('success', 'Lead Dihapus Lokal', `${targetLead?.name || 'Lead'} dihapus (Mode Offline).`);
    }
  };

  // Handler: Log follow up
  const handleSaveFollowUp = async (leadId: string, logData: Omit<FollowUpLog, 'id' | 'createdAt'>) => {
    const now = new Date();
    const newLog: FollowUpLog = {
      ...logData,
      id: `log-${Date.now()}`,
      createdAt: now.toISOString(),
    };

    // Optimistic update
    const updated = leads.map((lead) => {
      if (lead.id === leadId) {
        const isClosing = logData.newStatus === 'Closing';
        const isLost = logData.newStatus === 'Tidak Berhasil';

        return {
          ...lead,
          status: logData.newStatus,
          lastFollowUpDate: logData.date,
          nextFollowUpDate: isClosing || isLost ? undefined : logData.nextFollowUpDate,
          nextFollowUpTime: isClosing || isLost ? undefined : logData.nextFollowUpTime,
          closedAt: isClosing ? now.toISOString() : lead.closedAt,
          lostAt: isLost ? now.toISOString() : lead.lostAt,
          lostReason: isLost ? logData.lostReason : undefined,
          updatedAt: now.toISOString(),
          followUps: [newLog, ...(lead.followUps || [])],
        };
      }
      return lead;
    });

    setLeads(updated);
    saveStoredLeads(updated);

    // If closing -> increment user profile target achievement
    if (logData.newStatus === 'Closing') {
      const updatedProfile = {
        ...profile,
        closingCount: profile.closingCount + 1,
      };
      setProfile(updatedProfile);
      saveStoredProfile(updatedProfile);
      addToast('success', '🎉 DEAL CLOSING BERHASIL!', 'Selamat! Target closing bertambah.');
    } else {
      addToast('success', 'Follow Up Dicatat', 'Riwayat aktivitas lead berhasil diperbarui.');
    }

    try {
      await followUpService.saveFollowUp(leadId, logData);
    } catch {
      // offline fallback
    }

    setIsLogFollowUpOpen(false);
    setLeadForFollowUp(null);
  };

  // Handler: Quick Status Change
  const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayStr = now.toISOString().split('T')[0];

    handleSaveFollowUp(leadId, {
      date: todayStr,
      time: currentTimeStr,
      method: 'WhatsApp',
      result: newStatus === 'Closing' ? 'Siap Membeli' : newStatus === 'Tidak Berhasil' ? 'Tidak Tertarik' : 'Tertarik',
      notes: `Status diubah menjadi ${newStatus}`,
      oldStatus: leads.find((l) => l.id === leadId)?.status,
      newStatus,
    });
    addToast('success', `Status lead diubah menjadi ${newStatus}`);
  };

  // Handler: Reset data
  const handleResetData = async () => {
    try {
      await profileService.resetData();
      await loadData();
      setSelectedLeadId(null);
      setActiveTab('dashboard');
      addToast('success', 'Data Berhasil Di-reset', 'Database telah dikembalikan ke kondisi awal.');
    } catch {
      const fresh = resetStoredLeads();
      setLeads(fresh);
      setSelectedLeadId(null);
      setActiveTab('dashboard');
      addToast('success', 'Data Di-reset Lokal', 'Seluruh data lead kembali ke kondisi awal.');
    }
  };

  // Handler: Update profile
  const handleUpdateProfile = async (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);

    try {
      const saved = await profileService.updateProfile(updated);
      setProfile(saved);
      addToast('success', 'Profil Diperbarui', 'Data profil berhasil disimpan ke database.');
    } catch {
      addToast('success', 'Profil Diperbarui', 'Data profil berhasil disimpan lokal.');
    }
  };

  // Header title & subtitle dynamically tailored to active tab, active role, and active package
  const getHeaderInfo = () => {
    if (selectedLead && activeTab === 'leads') {
      return {
        title: selectedLead.name,
        subtitle: `${selectedLead.product.split('-')[0].trim()} • ${selectedLead.city}`,
      };
    }
    switch (activeTab) {
      case 'dashboard':
        if (currentPackage === 'basic') {
          return {
            title: 'Dashboard Sales',
            subtitle: 'Ringkasan aktivitas lead dan follow-up bisnis Anda hari ini',
          };
        }
        if (currentPackage === 'business') {
          return {
            title: currentRole === 'supervisor' ? 'Dashboard Tim Penjualan' : 'Dashboard Sales Pro',
            subtitle: 'Monitoring target closing, performa tim, dan prospek prioritas',
          };
        }
        // Enterprise
        if (currentRole === 'supervisor') {
          return {
            title: 'Dashboard Tim',
            subtitle: `Monitoring kinerja tim & pipeline ${currentPersona.team || 'Sales'}`,
          };
        }
        if (currentRole === 'manager') {
          return {
            title: 'Dashboard Eksekutif',
            subtitle: `Konsolidasi kinerja cabang & target korporasi ${currentPersona.branch}`,
          };
        }
        if (currentRole === 'admin') {
          return {
            title: 'Dashboard Administrator',
            subtitle: 'Status operasional sistem, manajemen lisensi, dan log keamanan',
          };
        }
        return {
          title: 'Dashboard Sales Enterprise',
          subtitle: 'Ringkasan aktivitas lead dan pencapaian target closing korporasi',
        };

      case 'leads':
        return {
          title: currentRole === 'supervisor' ? 'Daftar Lead Tim' : currentRole === 'manager' ? 'Semua Pipeline Organisasi' : 'Daftar Calon Pelanggan',
          subtitle: 'Kelola semua calon pelanggan dan status prospek penjualan',
        };

      case 'followup':
        return {
          title: currentRole === 'supervisor' ? 'Monitoring Follow Up Tim' : 'Jadwal Follow Up',
          subtitle: 'Pantau lead yang terlambat, hari ini, dan jadwal mendatang',
        };

      case 'team_performance':
        return {
          title: 'Kinerja & Leaderboard Tim',
          subtitle: 'Evaluasi pencapaian target dan rasio konversi per sales representative',
        };

      case 'branches':
        return {
          title: 'Kinerja Kantor Cabang',
          subtitle: 'Komparasi performa KC Jakarta, KC Bandung, dan KC Surabaya',
        };

      case 'teams':
        return {
          title: 'Kinerja Unit Tim Sales',
          subtitle: 'Produktivitas Sales Team Alpha, Team Beta, dan Regional Commercial',
        };

      case 'users':
        return {
          title: 'Manajemen Pengguna & Role',
          subtitle: 'Daftar staf sales, supervisor tim, branch manager, dan administrator',
        };

      case 'audit_log':
        return {
          title: 'Audit & Activity Log',
          subtitle: 'Rekam jejak seluruh aktivitas perubahan data dan keamanan sistem',
        };

      case 'settings':
        return {
          title: 'Pengaturan Sistem CRM',
          subtitle: 'Konfigurasi lisensi enterprise dan parameter operasional',
        };

      case 'reports':
        return {
          title: currentRole === 'manager' ? 'Laporan Kinerja Manajemen' : currentRole === 'supervisor' ? 'Laporan Performa Tim' : 'Laporan Performa Penjualan',
          subtitle: 'Analisis konversi lead, efektivitas saluran, dan tingkat closing',
        };

      case 'profile':
        return {
          title: `Profil ${currentPersona.title}`,
          subtitle: `Informasi akun ${currentPersona.name} • ${currentPersona.organization}`,
        };

      default:
        return { title: 'Kelola Lead', subtitle: 'Enterprise Demo CRM' };
    }
  };

  const headerInfo = getHeaderInfo();

  if (!isClient || isLicenseChecking) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] text-[#17221C] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#00A651] flex items-center justify-center text-white mb-4 shadow-sm animate-pulse">
          <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm font-bold text-[#17221C] tracking-wide">Kelola Lead Sales CRM</p>
        <p className="text-xs text-[#006B3C] mt-1 font-mono font-semibold">Memuat dashboard enterprise...</p>
      </div>
    );
  }

  // If not bypassed and not activated, show activation screen
  if (!isActivated) {
    return (
      <div className="min-h-screen bg-[#F7F9F8]">
        <ActivateView
          onActivationSuccess={(lic) => {
            setIsActivated(true);
            setDevModeInfo(null);
            setLicenseInfo(lic);
            loadData();
            addToast('success', 'Lisensi Lifetime Aktif!', 'Selamat datang di Kelola Lead Sales CRM.');
          }}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
        <HelpGuideModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#17221C] flex font-sans antialiased">
      {/* 1. Desktop Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedLeadId(null);
          setInitialFilterStatus('all');
          setActiveTab(tab);
        }}
        onOpenAddLead={() => setIsAddModalOpen(true)}
        followUpCount={followUpCount}
        onOpenHelp={() => setIsHelpOpen(true)}
        currentRole={currentRole}
        currentPersona={currentPersona}
        currentPackage={currentPackage}
        onOpenLockedFeature={handleOpenLockedFeature}
        devModeInfo={devModeInfo}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          profile={profile}
          currentRole={currentRole}
          currentPersona={currentPersona}
          currentPackage={currentPackage}
          onSwitchRole={handleSwitchRole}
          onSwitchPackage={handleSwitchPackage}
          onOpenLockedFeature={handleOpenLockedFeature}
          devModeInfo={devModeInfo}
          onOpenProfile={() => {
            setSelectedLeadId(null);
            setActiveTab('profile');
          }}
          onOpenFollowUps={() => {
            setSelectedLeadId(null);
            setActiveTab('followup');
          }}
          followUpCount={followUpCount}
          selectedDateRange={selectedDateRange}
          onChangeDateRange={setSelectedDateRange}
        />

        {/* Dynamic Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* A. Dashboard Tab per Role */}
          {activeTab === 'dashboard' && (
            <>
              {currentRole === 'sales' && (
                <DashboardView
                  leads={leads}
                  onSelectLead={(lead) => {
                    setSelectedLeadId(lead.id);
                    setActiveTab('leads');
                  }}
                  onFilterByStatus={(status) => {
                    setInitialFilterStatus(status);
                    setSelectedLeadId(null);
                    setActiveTab('leads');
                  }}
                  onFilterFollowUp={() => {
                    setSelectedLeadId(null);
                    setActiveTab('followup');
                  }}
                  onNavigateToTab={(tab) => {
                    setSelectedLeadId(null);
                    setActiveTab(tab);
                  }}
                  onOpenAddLead={() => setIsAddModalOpen(true)}
                />
              )}

              {currentRole === 'supervisor' && (
                <SupervisorDashboardView
                  leads={leads}
                  onSelectLead={(lead) => {
                    setSelectedLeadId(lead.id);
                    setActiveTab('leads');
                  }}
                  onNavigateToTab={(tab) => {
                    setSelectedLeadId(null);
                    setActiveTab(tab);
                  }}
                  onOpenAddLead={() => setIsAddModalOpen(true)}
                />
              )}

              {currentRole === 'manager' && (
                <ManagerDashboardView
                  leads={leads}
                  onNavigateToTab={(tab) => {
                    setSelectedLeadId(null);
                    setActiveTab(tab);
                  }}
                />
              )}

              {currentRole === 'admin' && (
                <AdminDashboardView
                  onNavigateToTab={(tab) => {
                    setSelectedLeadId(null);
                    setActiveTab(tab);
                  }}
                />
              )}
            </>
          )}

          {/* B. Specific Role Tabs */}
          {activeTab === 'team_performance' && (
            <SupervisorDashboardView
              leads={leads}
              onSelectLead={(lead) => {
                setSelectedLeadId(lead.id);
                setActiveTab('leads');
              }}
              onNavigateToTab={(tab) => {
                setSelectedLeadId(null);
                setActiveTab(tab);
              }}
            />
          )}

          {activeTab === 'branches' && <AdminBranchesView />}
          {activeTab === 'teams' && <AdminBranchesView />}
          {activeTab === 'users' && <AdminUsersView />}
          {activeTab === 'audit_log' && <AdminAuditLogView />}
          {activeTab === 'settings' && <AdminSettingsView />}

          {/* C. Existing Core CRM Tabs (Preserved 100%) */}
          {activeTab === 'leads' && (
            <>
              {selectedLead ? (
                <LeadDetailView
                  lead={selectedLead}
                  onBack={() => setSelectedLeadId(null)}
                  onOpenLogFollowUp={() => {
                    setLeadForFollowUp(selectedLead);
                    setIsLogFollowUpOpen(true);
                  }}
                  onQuickStatusChange={handleQuickStatusChange}
                  onEditLead={(lead) => {
                    setLeadToEdit(lead);
                    setIsEditModalOpen(true);
                  }}
                  onDeleteLead={handleDeleteLead}
                />
              ) : (
                <LeadListView
                  leads={leads}
                  onSelectLead={(lead) => setSelectedLeadId(lead.id)}
                  onOpenAddLead={() => setIsAddModalOpen(true)}
                  onQuickStatusChange={handleQuickStatusChange}
                  initialFilterStatus={initialFilterStatus}
                />
              )}
            </>
          )}

          {activeTab === 'followup' && (
            <FollowUpListView
              leads={leads}
              onSelectLead={(lead) => {
                setSelectedLeadId(lead.id);
                setActiveTab('leads');
              }}
              onOpenLogFollowUp={(lead) => {
                setLeadForFollowUp(lead);
                setIsLogFollowUpOpen(true);
              }}
              onOpenAddLead={() => setIsAddModalOpen(true)}
            />
          )}

          {activeTab === 'reports' && <ReportsView leads={leads} />}

          {activeTab === 'profile' && (
            <ProfileView
              profile={{
                ...profile,
                name: currentPersona.name,
                role: currentPersona.title,
                email: currentPersona.email,
                phone: currentPersona.phone,
                monthlyTarget: currentPersona.monthlyTarget || profile.monthlyTarget,
                closingCount: currentPersona.closingCount !== undefined ? currentPersona.closingCount : profile.closingCount,
              }}
              license={licenseInfo}
              devModeInfo={devModeInfo}
              onUpdateProfile={handleUpdateProfile}
              onResetData={handleResetData}
              onDeactivateLicense={handleDeactivateLicense}
            />
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedLeadId(null);
          setActiveTab(tab);
        }}
        onOpenAddLead={() => setIsAddModalOpen(true)}
        followUpCount={followUpCount}
        currentRole={currentRole}
      />

      {/* 4. Modals */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewLead}
      />

      {leadToEdit && (
        <EditLeadModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setLeadToEdit(null);
          }}
          lead={leadToEdit}
          onSave={handleUpdateLead}
        />
      )}

      {leadForFollowUp && (
        <LogFollowUpModal
          isOpen={isLogFollowUpOpen}
          onClose={() => {
            setIsLogFollowUpOpen(false);
            setLeadForFollowUp(null);
          }}
          lead={leadForFollowUp}
          onSaveFollowUp={handleSaveFollowUp}
        />
      )}

      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Locked Feature Gate Modal */}
      <LockedFeatureModal
        isOpen={lockedModal.isOpen}
        onClose={() => setLockedModal((prev) => ({ ...prev, isOpen: false }))}
        featureTitle={lockedModal.title}
        featureDescription={lockedModal.description}
        requiredPackage={lockedModal.requiredPackage}
        onUpgradeToPackage={handleSwitchPackage}
      />

      {/* 5. Toasts Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
