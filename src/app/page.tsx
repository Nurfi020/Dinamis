'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lead, 
  LeadStatus, 
  ActiveTab, 
  UserProfile, 
  FollowUpLog 
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
import { leadService, followUpService, profileService } from '../services/api';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { TopHeader } from '../components/layout/TopHeader';
import { DashboardView } from '../components/dashboard/DashboardView';
import { LeadListView } from '../components/leads/LeadListView';
import { LeadDetailView } from '../components/leads/LeadDetailView';
import { AddLeadModal } from '../components/leads/AddLeadModal';
import { LogFollowUpModal } from '../components/followup/LogFollowUpModal';
import { FollowUpListView } from '../components/followup/FollowUpListView';
import { ReportsView } from '../components/reports/ReportsView';
import { ProfileView } from '../components/profile/ProfileView';
import { HelpGuideModal } from '../components/common/HelpGuideModal';
import { ToastContainer, ToastMessage } from '../components/common/Toast';
import { ActivateView } from '../components/license/ActivateView';
import { LicenseClient } from '../services/licenseClient';
import { LicenseInfo } from '../types';

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // License state
  const [isLicenseChecking, setIsLicenseChecking] = useState(true);
  const [isActivated, setIsActivated] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogFollowUpOpen, setIsLogFollowUpOpen] = useState(false);
  const [leadForFollowUp, setLeadForFollowUp] = useState<Lead | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Filters state from dashboard quick click
  const [initialFilterStatus, setInitialFilterStatus] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('this_week');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  // Check license on initial mount
  useEffect(() => {
    setIsClient(true);
    const checkLicense = async () => {
      setIsLicenseChecking(true);
      try {
        const verifyResult = await LicenseClient.verify();
        if (verifyResult.valid && verifyResult.license) {
          setIsActivated(true);
          setLicenseInfo(verifyResult.license);
          loadData();
        } else {
          setIsActivated(false);
          setLicenseInfo(null);
        }
      } catch (e) {
        setIsActivated(false);
        setLicenseInfo(null);
      } finally {
        setIsLicenseChecking(false);
      }
    };
    checkLicense();
  }, []);

  const handleDeactivateLicense = async () => {
    await LicenseClient.deactivate();
    setIsActivated(false);
    setLicenseInfo(null);
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

    // Optimistic UI
    setLeads((prev) => [newLead, ...prev]);
    saveStoredLeads([newLead, ...leads]);
    addToast('success', 'Lead berhasil ditambahkan ✓', `${newLead.name} telah masuk ke daftar calon pelanggan.`);

    try {
      const savedLead = await leadService.createLead({
        name: newLeadData.name,
        phone: newLeadData.phone,
        city: newLeadData.city,
        source: newLeadData.source,
        productId: newLeadData.product,
        status: newLeadData.status,
        initialNotes: newLeadData.initialNotes,
        nextFollowUpDate: newLeadData.nextFollowUpDate,
        nextFollowUpTime: newLeadData.nextFollowUpTime,
      });
      setLeads((prev) => prev.map((l) => (l.id === tempId ? savedLead : l)));
    } catch (e) {
      console.warn('Saved locally (API fallback):', e);
    }
  };

  // Handler: Save Follow Up Log
  const handleSaveFollowUp = async (leadId: string, logData: Omit<FollowUpLog, 'id' | 'createdAt'>) => {
    const newLog: FollowUpLog = {
      ...logData,
      id: `fu-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const isClosing = logData.newStatus === 'Closing';
          const isFailed = logData.newStatus === 'Tidak Berhasil';
          
          return {
            ...l,
            status: logData.newStatus,
            updatedAt: new Date().toISOString(),
            lastFollowUpDate: logData.date,
            nextFollowUpDate: logData.nextFollowUpDate || (isClosing || isFailed ? undefined : l.nextFollowUpDate),
            nextFollowUpTime: logData.nextFollowUpTime || (isClosing || isFailed ? undefined : l.nextFollowUpTime),
            closedAt: isClosing ? new Date().toISOString() : l.closedAt,
            lostAt: isFailed ? new Date().toISOString() : l.lostAt,
            lostReason: isFailed ? logData.lostReason : l.lostReason,
            followUps: [newLog, ...l.followUps],
          };
        }
        return l;
      })
    );

    if (logData.newStatus === 'Closing') {
      setProfile((prev) => {
        const updated = { ...prev, closingCount: prev.closingCount + 1 };
        saveStoredProfile(updated);
        return updated;
      });
      addToast('success', 'Selamat! Lead Berhasil Closing ✓', 'Status diperbarui dan progress target bertambah.');
    } else {
      addToast('success', 'Follow Up berhasil dicatat ✓', `Status lead sekarang: ${logData.newStatus}`);
    }

    try {
      const result = await followUpService.saveFollowUp(leadId, logData);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? result.lead : l)));
    } catch (e) {
      console.warn('Saved follow-up locally:', e);
    }
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
    addToast('success', `Status lead diubah menjadi ${newStatus} ✓`);
  };

  // Handler: Reset data
  const handleResetData = async () => {
    try {
      await profileService.resetData();
      await loadData();
      setSelectedLeadId(null);
      setActiveTab('dashboard');
      addToast('success', 'Data Berhasil Di-reset ✓', 'Database telah dikembalikan ke kondisi awal.');
    } catch {
      const fresh = resetStoredLeads();
      setLeads(fresh);
      setSelectedLeadId(null);
      setActiveTab('dashboard');
      addToast('success', 'Data Di-reset Lokal ✓', 'Seluruh data lead kembali ke kondisi awal.');
    }
  };

  // Handler: Update profile
  const handleUpdateProfile = async (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);

    try {
      const saved = await profileService.updateProfile(updated);
      setProfile(saved);
      addToast('success', 'Profil Diperbarui ✓', 'Data profil sales berhasil disimpan ke database.');
    } catch {
      addToast('success', 'Profil Diperbarui ✓', 'Data profil sales berhasil disimpan lokal.');
    }
  };

  // Header title & subtitle based on active tab
  const getHeaderInfo = () => {
    if (selectedLead && activeTab === 'leads') {
      return {
        title: selectedLead.name,
        subtitle: `${selectedLead.product.split('—')[0].trim()} • ${selectedLead.city}`,
      };
    }
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Ringkasan aktivitas lead Anda hari ini',
        };
      case 'leads':
        return {
          title: 'Daftar Calon Pelanggan',
          subtitle: 'Kelola semua calon pelanggan dan status prospek',
        };
      case 'followup':
        return {
          title: 'Jadwal Follow Up',
          subtitle: 'Pantau lead yang terlambat, hari ini, dan mendatang',
        };
      case 'reports':
        return {
          title: 'Laporan Performa',
          subtitle: 'Lihat perkembangan, efektivitas sumber, dan tingkat closing',
        };
      case 'profile':
        return {
          title: 'Pengaturan & Profil Sales',
          subtitle: 'Informasi akun dan target closing bulanan',
        };
      default:
        return { title: 'Kelola Lead', subtitle: 'CRM Sales' };
    }
  };

  const headerInfo = getHeaderInfo();

  if (!isClient || isLicenseChecking) {
    return (
      <div className="min-h-screen bg-[#06111F] text-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#168BFF] to-[#22D3EE] flex items-center justify-center text-white mb-4 shadow-[0_0_25px_rgba(22,139,255,0.5)] animate-pulse">
          <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm font-bold text-white tracking-wide">Kelola Lead Sales CRM</p>
        <p className="text-xs text-[#22D3EE] mt-1 font-mono">Memeriksa lisensi perangkat...</p>
      </div>
    );
  }

  if (!isActivated) {
    return (
      <div className="min-h-screen bg-[#06111F]">
        <ActivateView
          onActivationSuccess={(lic) => {
            setIsActivated(true);
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
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          profile={profile}
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
          {activeTab === 'dashboard' && (
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
              profile={profile}
              license={licenseInfo}
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
      />

      {/* 4. Modals */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewLead}
      />

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

      {/* 5. Toasts Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}