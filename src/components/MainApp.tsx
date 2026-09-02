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
  DemoPackage,
  DemoIndustry,
  RAB,
  RABItem,
  Quotation,
  QuotationStatus
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
import { DEMO_INDUSTRIES, CONTRACTOR_DEMO_LEADS, UMKM_DEMO_LEADS } from '../data/contractorDemoData';
import {
  INITIAL_RABS,
  getStoredRABs,
  saveStoredRABs,
  calculateRABSummary
} from '../data/contractorRABData';
import {
  INITIAL_QUOTATIONS,
  getStoredQuotations,
  saveStoredQuotations
} from '../data/contractorQuotationData';
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
import { RABListView } from './contractor/RABListView';
import { RABDetailView } from './contractor/RABDetailView';
import { QuotationListView } from './contractor/quotation/QuotationListView';
import { QuotationDetailView } from './contractor/quotation/QuotationDetailView';
import { CreateQuotationModal } from './contractor/quotation/CreateQuotationModal';
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

  // CONTRACTOR RAB STATE (Isolated Storage Engine)
  const [rabs, setRabs] = useState<RAB[]>(INITIAL_RABS);
  const [selectedRabId, setSelectedRabId] = useState<string | null>(null);

  // CONTRACTOR QUOTATION STATE (Isolated Storage Engine)
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [isCreateQuotationModalOpen, setIsCreateQuotationModalOpen] = useState<boolean>(false);
  const [preSelectedRabForQuotation, setPreSelectedRabForQuotation] = useState<string | null>(null);

  // DEMO PACKAGE STATE (Basic / Business / Enterprise)
  const [currentPackage, setCurrentPackage] = useState<DemoPackage>('enterprise');

  // DEMO INDUSTRY STATE (General / UMKM / Contractor)
  const [currentIndustry, setCurrentIndustry] = useState<DemoIndustry>('general');

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

  // Load stored demo package, industry, and RAB preferences from isolated keys on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPkg = localStorage.getItem('kelola_lead_demo_package_v1') as DemoPackage;
      if (storedPkg && (storedPkg === 'basic' || storedPkg === 'business' || storedPkg === 'enterprise')) {
        setCurrentPackage(storedPkg);
      }

      const storedInd = localStorage.getItem('kelola_lead_demo_industry_v1') as DemoIndustry;
      if (storedInd && (storedInd === 'general' || storedInd === 'umkm' || storedInd === 'contractor')) {
        setCurrentIndustry(storedInd);
        if (storedInd === 'contractor') {
          setLeads(CONTRACTOR_DEMO_LEADS);
        } else if (storedInd === 'umkm') {
          setLeads(UMKM_DEMO_LEADS);
        }
      }

      const loadedRabs = getStoredRABs();
      setRabs(loadedRabs);

      const loadedQuotations = getStoredQuotations();
      setQuotations(loadedQuotations);
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
    setSelectedRabId(null);
    setSelectedQuotationId(null);
    setActiveTab('dashboard');
    addToast(
      'info',
      `Paket Demo: ${DEMO_PACKAGES[newPkg].name}`,
      DEMO_PACKAGES[newPkg].tagline
    );
  };

  // Industry Switcher Handler (Instant Simulated State)
  const handleSwitchIndustry = (newInd: DemoIndustry) => {
    setCurrentIndustry(newInd);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kelola_lead_demo_industry_v1', newInd);
    }

    if (newInd === 'contractor') {
      setLeads(CONTRACTOR_DEMO_LEADS);
    } else if (newInd === 'umkm') {
      setLeads(UMKM_DEMO_LEADS);
    } else {
      loadData();
    }

    setSelectedLeadId(null);
    setSelectedRabId(null);
    setSelectedQuotationId(null);
    setActiveTab('dashboard');
    addToast(
      'info',
      `Industri: ${DEMO_INDUSTRIES[newInd].name}`,
      `Beralih ke konfigurasi dan terminology ${DEMO_INDUSTRIES[newInd].name}.`
    );
  };

  // Role Switcher Handler (Instant Simulated State)
  const handleSwitchRole = (role: DemoRole) => {
    const targetPersona = DEMO_PERSONAS[role];
    setCurrentRole(role);
    setCurrentPersona(targetPersona);
    setSelectedLeadId(null);
    setSelectedRabId(null);
    setSelectedQuotationId(null);
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

  // Find currently selected lead, RAB & Quotation
  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;
  const selectedRab = rabs.find((r) => r.id === selectedRabId) || null;
  const selectedQuotation = quotations.find((q) => q.id === selectedQuotationId) || null;

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
      addToast(
        'success',
        currentIndustry === 'contractor'
          ? 'Prospek Proyek Berhasil Ditambahkan'
          : currentIndustry === 'umkm'
          ? 'Calon Pelanggan Berhasil Ditambahkan'
          : 'Lead Baru Berhasil Ditambahkan',
        `${newLead.name} telah masuk ke daftar prospek.`
      );
    } catch {
      addToast('success', 'Disimpan Lokal', `${newLead.name} berhasil ditambahkan (Mode Offline).`);
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
      addToast('success', 'Data Diperbarui', 'Perubahan data prospek berhasil disimpan.');
    } catch {
      addToast('success', 'Data Diperbarui Lokal', 'Perubahan disimpan (Mode Offline).');
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
      addToast('success', 'Berhasil Dihapus', `${targetLead?.name || 'Prospek'} telah dihapus.`);
    } catch {
      addToast('success', 'Dihapus Lokal', `${targetLead?.name || 'Prospek'} dihapus (Mode Offline).`);
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
      addToast(
        'success',
        currentIndustry === 'contractor'
          ? '🎉 DEAL SPK DITANDATANGANI!'
          : currentIndustry === 'umkm'
          ? '🎉 PENJUALAN BERHASIL (CLOSING)!'
          : '🎉 DEAL CLOSING BERHASIL!',
        'Selamat! Target omset penjualan bertambah.'
      );
    } else {
      addToast('success', 'Aktivitas Dicatat', 'Riwayat tindak lanjut prospek berhasil diperbarui.');
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
    addToast('success', `Status prospek diubah menjadi ${newStatus}`);
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
      addToast('success', 'Data Di-reset Lokal', 'Seluruh data prospek kembali ke kondisi awal.');
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

  // ====================================================
  // CONTRACTOR RAB HANDLERS (Isolated Storage Engine)
  // ====================================================

  const handleCreateRAB = (
    newRabData: Omit<
      RAB,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'items'
      | 'materialTotal'
      | 'laborTotal'
      | 'subtotalCost'
      | 'overheadAmount'
      | 'marginAmount'
      | 'grandTotal'
    >
  ) => {
    const id = `rab-${Date.now()}`;
    const now = new Date().toISOString();
    const newRAB: RAB = {
      ...newRabData,
      id,
      items: [],
      materialTotal: 0,
      laborTotal: 0,
      subtotalCost: 0,
      overheadAmount: 0,
      marginAmount: 0,
      grandTotal: 0,
      createdAt: now,
      updatedAt: now,
    };

    setRabs((prev) => {
      const updated = [newRAB, ...prev];
      saveStoredRABs(updated);
      return updated;
    });

    setSelectedRabId(id);
    addToast('success', 'RAB Berhasil Dibuat', `${newRAB.rabNumber} — ${newRAB.projectName}`);
  };

  const handleUpdateRAB = (rabId: string, updatedData: Partial<RAB>) => {
    setRabs((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== rabId) return r;
        const merged: RAB = {
          ...r,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
        const summary = calculateRABSummary(
          merged.items || [],
          merged.overheadType,
          merged.overheadValue,
          merged.marginType,
          merged.marginValue,
          merged.discountAmount
        );
        return {
          ...merged,
          ...summary,
        };
      });
      saveStoredRABs(updated);
      return updated;
    });
    addToast('success', 'RAB Diperbarui', 'Data proyek & kalkulasi biaya berhasil diperbarui.');
  };

  const handleDeleteRAB = (rabId: string) => {
    setRabs((prev) => {
      const updated = prev.filter((r) => r.id !== rabId);
      saveStoredRABs(updated);
      return updated;
    });
    if (selectedRabId === rabId) {
      setSelectedRabId(null);
    }
    addToast('info', 'RAB Dihapus', 'Dokumen RAB telah berhasil dihapus.');
  };

  const handleAddRABItem = (newItemData: Omit<RABItem, 'id'>) => {
    const itemId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: RABItem = {
      ...newItemData,
      id: itemId,
    };

    setRabs((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== newItemData.rabId) return r;
        const updatedItems = [...r.items, newItem];
        const summary = calculateRABSummary(
          updatedItems,
          r.overheadType,
          r.overheadValue,
          r.marginType,
          r.marginValue,
          r.discountAmount
        );
        return {
          ...r,
          items: updatedItems,
          ...summary,
          updatedAt: new Date().toISOString(),
        };
      });
      saveStoredRABs(updated);
      return updated;
    });
    addToast('success', 'Item Ditambahkan', `${newItem.itemName} (${newItem.volume} ${newItem.unit})`);
  };

  const handleUpdateRABItem = (itemId: string, updatedItemData: Partial<RABItem>) => {
    setRabs((prev) => {
      const updated = prev.map((r) => {
        const hasItem = r.items.some((it) => it.id === itemId);
        if (!hasItem) return r;
        const updatedItems = r.items.map((it) =>
          it.id === itemId ? { ...it, ...updatedItemData } : it
        );
        const summary = calculateRABSummary(
          updatedItems,
          r.overheadType,
          r.overheadValue,
          r.marginType,
          r.marginValue,
          r.discountAmount
        );
        return {
          ...r,
          items: updatedItems,
          ...summary,
          updatedAt: new Date().toISOString(),
        };
      });
      saveStoredRABs(updated);
      return updated;
    });
    addToast('success', 'Item Diperbarui', 'Data item pekerjaan dan kalkulasi subtotal telah diperbarui.');
  };

  const handleDeleteRABItem = (itemId: string) => {
    setRabs((prev) => {
      const updated = prev.map((r) => {
        const hasItem = r.items.some((it) => it.id === itemId);
        if (!hasItem) return r;
        const updatedItems = r.items.filter((it) => it.id !== itemId);
        const summary = calculateRABSummary(
          updatedItems,
          r.overheadType,
          r.overheadValue,
          r.marginType,
          r.marginValue,
          r.discountAmount
        );
        return {
          ...r,
          items: updatedItems,
          ...summary,
          updatedAt: new Date().toISOString(),
        };
      });
      saveStoredRABs(updated);
      return updated;
    });
    addToast('info', 'Item Dihapus', 'Item pekerjaan berhasil dihapus dari RAB.');
  };

  // ====================================================
  // CONTRACTOR QUOTATION HANDLERS (Isolated Storage Engine)
  // ====================================================

  const handleCreateQuotation = (newQuotation: Quotation) => {
    setQuotations((prev) => {
      const updated = [newQuotation, ...prev];
      saveStoredQuotations(updated);
      return updated;
    });

    setSelectedQuotationId(newQuotation.id);
    setActiveTab('contractor_quotation');
    addToast('success', 'SPH Berhasil Diterbitkan', `${newQuotation.quotationNumber} — ${newQuotation.projectName}`);
  };

  const handleGenerateQuotationFromRAB = (rab: RAB) => {
    if (rab.status !== 'Final') {
      addToast('error', 'Gagal Membuat SPH', 'SPH hanya dapat dibuat dari RAB dengan status FINAL.');
      return;
    }

    setPreSelectedRabForQuotation(rab.id);
    setIsCreateQuotationModalOpen(true);
  };

  const handleUpdateQuotation = (quotationId: string, updatedData: Partial<Quotation>) => {
    setQuotations((prev) => {
      const updated = prev.map((q) =>
        q.id === quotationId
          ? {
              ...q,
              ...updatedData,
              updatedAt: new Date().toISOString(),
            }
          : q
      );
      saveStoredQuotations(updated);
      return updated;
    });
    addToast('success', 'Dokumen SPH Diperbarui', 'Perubahan penawaran harga berhasil disimpan.');
  };

  const handleDeleteQuotation = (quotationId: string) => {
    setQuotations((prev) => {
      const updated = prev.filter((q) => q.id !== quotationId);
      saveStoredQuotations(updated);
      return updated;
    });
    if (selectedQuotationId === quotationId) {
      setSelectedQuotationId(null);
    }
    addToast('info', 'SPH Dihapus', 'Dokumen Surat Penawaran Harga telah dihapus.');
  };

  // Header title & subtitle dynamically tailored to active tab, active role, active package, and active industry
  const getHeaderInfo = () => {
    const isContractor = currentIndustry === 'contractor';
    const isUmkm = currentIndustry === 'umkm';

    if (selectedLead && activeTab === 'leads') {
      return {
        title: selectedLead.name,
        subtitle: `${selectedLead.product.split('-')[0].trim()} • ${selectedLead.city}`,
      };
    }

    if (selectedRab && activeTab === 'contractor_rab') {
      return {
        title: selectedRab.projectName,
        subtitle: `Dokumen ${selectedRab.rabNumber} • Klien: ${selectedRab.clientName} (${selectedRab.projectLocation})`,
      };
    }

    if (selectedQuotation && activeTab === 'contractor_quotation') {
      return {
        title: selectedQuotation.projectName,
        subtitle: `Dokumen ${selectedQuotation.quotationNumber} • Klien: ${selectedQuotation.clientName} (${selectedQuotation.projectLocation})`,
      };
    }
    switch (activeTab) {
      case 'dashboard':
        if (currentPackage === 'basic') {
          return {
            title: isContractor
              ? 'Dashboard Proyek Kontraktor'
              : isUmkm
              ? 'Dashboard Usaha & Penjualan'
              : 'Dashboard Sales',
            subtitle: isContractor
              ? 'Ringkasan prospek proyek, estimasi RAB, dan jadwal survey hari ini'
              : isUmkm
              ? 'Ringkasan prospek pelanggan, estimasi omset, dan jadwal follow-up hari ini'
              : 'Ringkasan aktivitas lead dan follow-up bisnis Anda hari ini',
          };
        }
        if (currentPackage === 'business') {
          return {
            title: currentRole === 'supervisor'
              ? (isContractor ? 'Dashboard Tim Kontraktor' : isUmkm ? 'Dashboard Tim Penjualan UMKM' : 'Dashboard Tim Penjualan')
              : (isContractor ? 'Dashboard Project Sales Pro' : isUmkm ? 'Dashboard Sales UMKM Pro' : 'Dashboard Sales Pro'),
            subtitle: isContractor
              ? 'Monitoring target kontrak proyek, performa estimator, dan survey prioritas'
              : isUmkm
              ? 'Monitoring target omset toko, performa tim sales, dan follow-up pelanggan'
              : 'Monitoring target closing, performa tim, dan prospek prioritas',
          };
        }
        // Enterprise
        if (currentRole === 'supervisor') {
          return {
            title: isContractor
              ? 'Dashboard Tim Proyek'
              : isUmkm
              ? 'Dashboard Tim Sales & Outlet'
              : 'Dashboard Tim',
            subtitle: isContractor
              ? `Monitoring progres tender, survey & pipeline ${currentPersona.team || 'Estimator'}`
              : isUmkm
              ? `Monitoring kinerja tim & target outlet ${currentPersona.team || 'Sales'}`
              : `Monitoring kinerja tim & pipeline ${currentPersona.team || 'Sales'}`,
          };
        }
        if (currentRole === 'manager') {
          return {
            title: isContractor
              ? 'Dashboard Direksi Proyek'
              : isUmkm
              ? 'Dashboard Owner & Eksekutif Usaha'
              : 'Dashboard Eksekutif',
            subtitle: isContractor
              ? `Konsolidasi nilai kontrak proyek seluruh cabang regional ${currentPersona.branch}`
              : isUmkm
              ? `Konsolidasi kinerja penjualan seluruh outlet jaringan usaha ${currentPersona.branch}`
              : `Konsolidasi kinerja cabang & target korporasi ${currentPersona.branch}`,
          };
        }
        if (currentRole === 'admin') {
          return {
            title: isContractor
              ? 'Dashboard Admin Kontrak & Sistem'
              : isUmkm
              ? 'Dashboard Administrator Usaha'
              : 'Dashboard Administrator',
            subtitle: 'Status operasional sistem, manajemen lisensi, dan log keamanan',
          };
        }
        return {
          title: isContractor
            ? 'Dashboard Proyek Enterprise'
            : isUmkm
            ? 'Dashboard Usaha Enterprise'
            : 'Dashboard Sales Enterprise',
          subtitle: isContractor
            ? 'Ringkasan pipeline proyek strategis dan pencapaian target kontrak korporasi'
            : isUmkm
            ? 'Ringkasan pipeline penjualan dan pencapaian target omset korporasi'
            : 'Ringkasan aktivitas lead dan pencapaian target closing korporasi',
        };

      case 'leads':
        return {
          title: isContractor
            ? 'Daftar Prospek Proyek'
            : isUmkm
            ? 'Daftar Calon Pelanggan'
            : (currentRole === 'supervisor' ? 'Daftar Lead Tim' : currentRole === 'manager' ? 'Semua Pipeline Organisasi' : 'Daftar Calon Pelanggan'),
          subtitle: isContractor
            ? 'Kelola calon klien, lokasi pekerjaan, dan estimasi nilai RAB proyek'
            : isUmkm
            ? 'Kelola calon pelanggan, kebutuhan produk, dan estimasi nilai transaksi'
            : 'Kelola semua calon pelanggan dan status prospek penjualan',
        };

      case 'followup':
        return {
          title: isContractor
            ? 'Jadwal Survey & Follow Up'
            : isUmkm
            ? 'Follow-up Calon Pelanggan'
            : (currentRole === 'supervisor' ? 'Monitoring Follow Up Tim' : 'Jadwal Follow Up'),
          subtitle: isContractor
            ? 'Pantau jadwal survey site lokasi, pengiriman RAB, dan negosiasi SPK'
            : isUmkm
            ? 'Pantau calon pelanggan yang terlambat, jadwal hari ini, dan follow-up WhatsApp'
            : 'Pantau lead yang terlambat, hari ini, dan jadwal mendatang',
        };

      case 'team_performance':
        return {
          title: isContractor
            ? 'Kinerja & Leaderboard Estimator'
            : isUmkm
            ? 'Kinerja & Leaderboard Tim Sales'
            : 'Kinerja & Leaderboard Tim',
          subtitle: isContractor
            ? 'Evaluasi pencapaian target deal SPK dan rasio konversi per sales estimator'
            : isUmkm
            ? 'Evaluasi pencapaian target omset dan rasio closing per sales staff'
            : 'Evaluasi pencapaian target dan rasio konversi per sales representative',
        };

      case 'branches':
        return {
          title: isContractor
            ? 'Kinerja Proyek Kantor Cabang'
            : isUmkm
            ? 'Kinerja Multi-Outlet & Toko'
            : 'Kinerja Kantor Cabang',
          subtitle: isContractor
            ? 'Komparasi nilai kontrak proyek Divisi Jakarta, Bandung, dan Surabaya'
            : isUmkm
            ? 'Komparasi omset penjualan Outlet Jakarta, Bandung, dan Surabaya'
            : 'Komparasi performa KC Jakarta, KC Bandung, dan KC Surabaya',
        };

      case 'teams':
        return {
          title: isContractor
            ? 'Kinerja Divisi Proyek Konstruksi'
            : isUmkm
            ? 'Kinerja Tim & Toko Penjualan'
            : 'Kinerja Unit Tim Sales',
          subtitle: isContractor
            ? 'Produktivitas Tim Estimator, Tim Survey, dan Regional Commercial'
            : isUmkm
            ? 'Produktivitas Tim Toko Retail, Tim Grosir, dan Reseller Network'
            : 'Produktivitas Sales Team Alpha, Team Beta, dan Regional Commercial',
        };

      case 'users':
        return {
          title: isContractor
            ? 'Manajemen Estimator & Staff'
            : isUmkm
            ? 'Manajemen Staff & Kasir Toko'
            : 'Manajemen Pengguna & Role',
          subtitle: isContractor
            ? 'Daftar estimator proyek, project supervisor, branch director, dan admin'
            : isUmkm
            ? 'Daftar staff penjualan, supervisor toko, owner bisnis, dan admin'
            : 'Daftar staf sales, supervisor tim, branch manager, dan administrator',
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
          title: isContractor
            ? 'Laporan Analisis Proyek'
            : isUmkm
            ? 'Laporan Penjualan & Produk Terlaris'
            : (currentRole === 'supervisor' ? 'Laporan Performa Tim Sales' : 'Laporan Performa Sales'),
          subtitle: isContractor
            ? 'Statistik konversi prospek proyek konstruksi, realisasi SPK, dan histori follow-up'
            : isUmkm
            ? 'Statistik konversi calon pelanggan, omset produk terlaris, dan histori transaksi'
            : 'Statistik performa penjualan, konversi lead, dan riwayat aktivitas follow-up',
        };

      case 'contractor_rab':
        return {
          title: 'Rencana Anggaran Biaya (RAB)',
          subtitle: 'Penyusunan estimasi biaya proyek, analisa harga satuan material & upah, serta margin profit kontraktor',
        };

      case 'contractor_quotation':
        return {
          title: 'Surat Penawaran Harga (SPH)',
          subtitle: 'Penerbitan dokumen penawaran harga komersial resmi berbasis snapshot RAB yang telah disetujui',
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
        currentIndustry={currentIndustry}
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
          currentIndustry={currentIndustry}
          onSwitchRole={handleSwitchRole}
          onSwitchPackage={handleSwitchPackage}
          onSwitchIndustry={handleSwitchIndustry}
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
                  currentIndustry={currentIndustry}
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

          {/* D. Contractor Dedicated Tab: RAB */}
          {activeTab === 'contractor_rab' && (
            <>
              {selectedRab ? (
                <RABDetailView
                  rab={selectedRab}
                  onBack={() => setSelectedRabId(null)}
                  onUpdateRAB={handleUpdateRAB}
                  onDeleteRAB={handleDeleteRAB}
                  onAddItem={handleAddRABItem}
                  onUpdateItem={handleUpdateRABItem}
                  onDeleteItem={handleDeleteRABItem}
                  onCreateQuotation={handleGenerateQuotationFromRAB}
                />
              ) : (
                <RABListView
                  rabs={rabs}
                  leads={leads}
                  onSelectRAB={(r) => setSelectedRabId(r.id)}
                  onCreateRAB={handleCreateRAB}
                  onUpdateRAB={handleUpdateRAB}
                  onDeleteRAB={handleDeleteRAB}
                />
              )}
            </>
          )}

          {/* E. Contractor Dedicated Tab: Quotation / SPH */}
          {activeTab === 'contractor_quotation' && (
            <>
              {selectedQuotation ? (
                <QuotationDetailView
                  quotation={selectedQuotation}
                  onBack={() => setSelectedQuotationId(null)}
                  onUpdateQuotation={handleUpdateQuotation}
                  onDeleteQuotation={handleDeleteQuotation}
                />
              ) : (
                <QuotationListView
                  quotations={quotations}
                  rabs={rabs}
                  onSelectQuotation={(q) => setSelectedQuotationId(q.id)}
                  onCreateQuotation={handleCreateQuotation}
                  onUpdateQuotation={handleUpdateQuotation}
                  onDeleteQuotation={handleDeleteQuotation}
                />
              )}
            </>
          )}

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

      {/* Direct Create Quotation Modal from RAB */}
      <CreateQuotationModal
        isOpen={isCreateQuotationModalOpen}
        onClose={() => {
          setIsCreateQuotationModalOpen(false);
          setPreSelectedRabForQuotation(null);
        }}
        rabs={rabs}
        existingQuotations={quotations}
        preSelectedRabId={preSelectedRabForQuotation}
        onSave={handleCreateQuotation}
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
