import React, { useState, useEffect } from 'react';
import { 
  Lead, 
  LeadStatus, 
  ActiveTab, 
  UserProfile, 
  FollowUpLog 
} from './types';
import { 
  getStoredLeads, 
  saveStoredLeads, 
  resetStoredLeads, 
  getStoredProfile, 
  saveStoredProfile 
} from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { TopHeader } from './components/layout/TopHeader';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadListView } from './components/leads/LeadListView';
import { LeadDetailView } from './components/leads/LeadDetailView';
import { AddLeadModal } from './components/leads/AddLeadModal';
import { LogFollowUpModal } from './components/followup/LogFollowUpModal';
import { FollowUpListView } from './components/followup/FollowUpListView';
import { ReportsView } from './components/reports/ReportsView';
import { ProfileView } from './components/profile/ProfileView';
import { HelpGuideModal } from './components/common/HelpGuideModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
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

  // Initialize leads on mount
  useEffect(() => {
    const data = getStoredLeads();
    setLeads(data);
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

  // Find currently selected lead
  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  // Active follow up badge calculation
  const followUpCount = leads.filter(
    (l) => l.nextFollowUpDate && l.status !== 'Closing' && l.status !== 'Tidak Berhasil'
  ).length;

  // Handler: Add new lead
  const handleSaveNewLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadData.name || 'Calon Pelanggan',
      phone: leadData.phone || '081200000000',
      city: leadData.city || 'Jakarta',
      source: leadData.source || 'WhatsApp',
      product: leadData.product || 'Produk A',
      status: leadData.status || 'Cold',
      initialNotes: leadData.initialNotes,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      nextFollowUpDate: leadData.nextFollowUpDate || new Date().toISOString().split('T')[0],
      nextFollowUpTime: leadData.nextFollowUpTime || '10:00',
      followUps: [],
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    saveStoredLeads(updated);
    setIsAddModalOpen(false);

    // Navigate to newly created lead detail
    setSelectedLeadId(newLead.id);
    setActiveTab('leads');

    addToast('success', 'Lead berhasil ditambahkan!', `${newLead.name} telah masuk ke daftar lead.`);
  };

  // Handler: Save follow-up log
  const handleSaveFollowUp = (
    leadId: string,
    logData: Omit<FollowUpLog, 'id' | 'createdAt'>
  ) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id !== leadId) return lead;

      const newLog: FollowUpLog = {
        ...logData,
        id: `fu-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const isClosingNow = logData.newStatus === 'Closing' && lead.status !== 'Closing';

      if (isClosingNow) {
        setProfile((prev) => {
          const updated = { ...prev, closingCount: prev.closingCount + 1 };
          saveStoredProfile(updated);
          return updated;
        });
      }

      return {
        ...lead,
        status: logData.newStatus,
        updatedAt: new Date().toISOString().split('T')[0],
        lastFollowUpDate: logData.date,
        nextFollowUpDate: logData.nextFollowUpDate,
        nextFollowUpTime: logData.nextFollowUpTime,
        followUps: [...lead.followUps, newLog],
      };
    });

    setLeads(updatedLeads);
    saveStoredLeads(updatedLeads);

    if (logData.newStatus === 'Closing') {
      addToast('success', '🎉 Selamat! Lead Berhasil Closing', 'Status diperbarui dan progress target bertambah.');
    } else {
      addToast('success', 'Follow up berhasil dicatat', `Status lead sekarang: ${logData.newStatus}`);
    }
  };

  // Handler: Quick Status Change
  const handleQuickStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const updated = leads.map((lead) => {
      if (lead.id !== leadId) return lead;

      // Also log automatic status change in timeline
      const statusLog: FollowUpLog = {
        id: `fu-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
        method: 'WhatsApp',
        result: newStatus === 'Closing' ? 'Siap Membeli' : newStatus === 'Tidak Berhasil' ? 'Tidak Tertarik' : 'Tertarik',
        notes: `Status diubah menjadi ${newStatus}`,
        oldStatus: lead.status,
        newStatus,
        createdAt: new Date().toISOString().split('T')[0],
      };

      return {
        ...lead,
        status: newStatus,
        updatedAt: new Date().toISOString().split('T')[0],
        followUps: [...lead.followUps, statusLog],
      };
    });

    setLeads(updated);
    saveStoredLeads(updated);
    addToast('info', 'Status diperbarui', `Lead diubah menjadi ${newStatus}`);
  };

  // Handler: Reset mock data
  const handleResetData = () => {
    const fresh = resetStoredLeads();
    setLeads(fresh);
    setSelectedLeadId(null);
    setActiveTab('dashboard');
    addToast('success', 'Data Di-reset', 'Seluruh data lead kembali ke kondisi awal.');
  };

  // Handler: Update profile
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
    addToast('success', 'Profil Diperbarui', 'Data profil sales berhasil disimpan.');
  };

  // Header title & subtitle based on active tab
  const getHeaderInfo = () => {
    if (selectedLead && activeTab === 'leads') {
      return {
        title: selectedLead.name,
        subtitle: `${selectedLead.product.split('—')[0].trim()} · ${selectedLead.city}`,
      };
    }
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Ringkasan aktivitas lead Anda',
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
          title: 'Profil Sales',
          subtitle: 'Informasi akun dan target closing bulanan',
        };
      default:
        return { title: 'Kelola Lead', subtitle: 'CRM Sales' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#06111F] text-[#F8FAFC] flex font-sans antialiased">
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
              onUpdateProfile={handleUpdateProfile}
              onResetData={handleResetData}
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
