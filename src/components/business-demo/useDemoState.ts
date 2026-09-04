'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DemoLead,
  DemoFollowUp,
  DemoProduct,
  DemoDeal,
  DemoActivity,
  PipelineStage,
  DealStatus,
} from './types';
import {
  SEED_LEADS,
  SEED_FOLLOWUPS,
  SEED_PRODUCTS,
  SEED_DEALS,
  SEED_ACTIVITIES,
} from './seedData';

const STORAGE_KEY = 'dinamis_business_crm_demo_v1';

interface BusinessStoragePayload {
  leads: DemoLead[];
  followups: DemoFollowUp[];
  products: DemoProduct[];
  deals: DemoDeal[];
  activities: DemoActivity[];
}

export function useDemoState() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [leads, setLeads] = useState<DemoLead[]>(SEED_LEADS);
  const [followups, setFollowups] = useState<DemoFollowUp[]>(SEED_FOLLOWUPS);
  const [products, setProducts] = useState<DemoProduct[]>(SEED_PRODUCTS);
  const [deals, setDeals] = useState<DemoDeal[]>(SEED_DEALS);
  const [activities, setActivities] = useState<DemoActivity[]>(SEED_ACTIVITIES);

  // Load from localStorage on mount (Hydration-safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: BusinessStoragePayload = JSON.parse(raw);
        if (parsed.leads && Array.isArray(parsed.leads)) {
          setLeads(parsed.leads);
          setFollowups(parsed.followups || SEED_FOLLOWUPS);
          setProducts(parsed.products || SEED_PRODUCTS);
          setDeals(parsed.deals || SEED_DEALS);
          setActivities(parsed.activities || SEED_ACTIVITIES);
        }
      }
    } catch {
      // Fallback to seed on parsing error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage on state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload: BusinessStoragePayload = {
        leads,
        followups,
        products,
        deals,
        activities,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore in private browsing / restricted storage
    }
  }, [isLoaded, leads, followups, products, deals, activities]);

  // Log activity helper
  const logActivity = useCallback(
    (title: string, description: string, category: DemoActivity['category'], leadId?: string) => {
      const newAct: DemoActivity = {
        id: `act-${Date.now()}`,
        timestamp: 'Hari ini, baru saja',
        title,
        description,
        category,
        leadId,
      };
      setActivities((prev) => [newAct, ...prev.slice(0, 24)]);
    },
    []
  );

  // 1. Lead Actions
  const addLead = useCallback(
    (data: Omit<DemoLead, 'id' | 'createdAt' | 'lastContact'>) => {
      const newLead: DemoLead = {
        ...data,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastContact: 'Hari ini, baru saja',
      };
      setLeads((prev) => [newLead, ...prev]);
      logActivity(
        'Lead Baru Ditambahkan',
        `Prospek "${newLead.name}" (${newLead.company || 'Perorangan'}) dari sumber ${newLead.source} berhasil dibuat.`,
        'lead',
        newLead.id
      );
      return newLead;
    },
    [logActivity]
  );

  const updateLead = useCallback(
    (id: string, updatedFields: Partial<Omit<DemoLead, 'id' | 'createdAt'>>) => {
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id === id) {
            return {
              ...lead,
              ...updatedFields,
              lastContact: 'Hari ini, baru saja',
            };
          }
          return lead;
        })
      );
      const lead = leads.find((l) => l.id === id);
      logActivity(
        'Data Lead Diperbarui',
        `Informasi kontak "${lead?.name || id}" telah diperbarui.`,
        'lead',
        id
      );
    },
    [leads, logActivity]
  );

  const updateLeadStage = useCallback(
    (id: string, stage: PipelineStage, note?: string) => {
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id === id) {
            return {
              ...lead,
              stage,
              lastContact: 'Hari ini, baru saja',
              notes: note ? `${note} (Update: ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})` : lead.notes,
            };
          }
          return lead;
        })
      );
      const lead = leads.find((l) => l.id === id);
      logActivity(
        'Tahap Pipeline Berubah',
        `Status prospek "${lead?.name || 'Lead'}" dipindahkan ke tahap "${stage}".`,
        'pipeline',
        id
      );
    },
    [leads, logActivity]
  );

  const deleteLead = useCallback(
    (id: string) => {
      const lead = leads.find((l) => l.id === id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      // Clean up orphaned followups
      setFollowups((prev) => prev.filter((f) => f.leadId !== id));
      logActivity(
        'Lead Dihapus',
        `Data prospek "${lead?.name || id}" telah dihapus dari sistem.`,
        'lead'
      );
    },
    [leads, logActivity]
  );

  // 2. Follow-up Actions
  const addFollowUp = useCallback(
    (data: Omit<DemoFollowUp, 'id' | 'status'>) => {
      const newFollowUp: DemoFollowUp = {
        ...data,
        id: `fu-${Date.now()}`,
        status: 'Pending',
      };
      setFollowups((prev) => [newFollowUp, ...prev]);

      // Update next follow-up date on lead
      setLeads((prev) =>
        prev.map((l) =>
          l.id === data.leadId ? { ...l, nextFollowUpDate: data.dueDate } : l
        )
      );

      logActivity(
        'Follow-up Dijadwalkan',
        `Jadwal ${data.type} untuk "${data.leadName}" pada tanggal ${data.dueDate}${data.dueTime ? ` (${data.dueTime})` : ''}.`,
        'followup',
        data.leadId
      );
    },
    [logActivity]
  );

  const completeFollowUp = useCallback(
    (id: string, completionNote?: string) => {
      const nowFormatted = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      setFollowups((prev) =>
        prev.map((fu) => {
          if (fu.id === id) {
            return {
              ...fu,
              status: 'Selesai',
              completedAt: nowFormatted,
              notes: completionNote ? `${fu.notes} [Hasil: ${completionNote}]` : fu.notes,
            };
          }
          return fu;
        })
      );

      const target = followups.find((f) => f.id === id);
      logActivity(
        'Follow-up Selesai',
        `Follow-up ${target?.type || ''} untuk "${target?.leadName || 'Customer'}" telah diselesaikan.`,
        'followup',
        target?.leadId
      );
    },
    [followups, logActivity]
  );

  const deleteFollowUp = useCallback(
    (id: string) => {
      setFollowups((prev) => prev.filter((f) => f.id !== id));
    },
    []
  );

  // 3. Deal Actions
  const addDeal = useCallback(
    (data: Omit<DemoDeal, 'id'>) => {
      const newDeal: DemoDeal = {
        ...data,
        id: `deal-${Date.now()}`,
      };
      setDeals((prev) => [newDeal, ...prev]);

      // Automatically advance lead stage to Deal if not already
      setLeads((prev) =>
        prev.map((l) =>
          l.id === data.leadId && l.stage !== 'Deal'
            ? { ...l, stage: 'Deal', potentialValue: data.dealValue }
            : l
        )
      );

      logActivity(
        'Deal Penjualan Dibuat',
        `Deal "${data.productName}" senilai Rp ${data.dealValue.toLocaleString('id-ID')} dibuat untuk ${data.customerName} (${data.status}).`,
        'deal',
        data.leadId
      );
    },
    [logActivity]
  );

  const updateDealStatus = useCallback(
    (id: string, status: DealStatus) => {
      setDeals((prev) =>
        prev.map((deal) => (deal.id === id ? { ...deal, status } : deal))
      );
      const deal = deals.find((d) => d.id === id);
      logActivity(
        'Status Deal Diperbarui',
        `Status deal "${deal?.productName}" (${deal?.customerName}) diubah menjadi "${status}".`,
        'deal',
        deal?.leadId
      );
    },
    [deals, logActivity]
  );

  const deleteDeal = useCallback(
    (id: string) => {
      const deal = deals.find((d) => d.id === id);
      setDeals((prev) => prev.filter((d) => d.id !== id));
      logActivity(
        'Deal Dihapus',
        `Transaksi deal "${deal?.productName}" untuk ${deal?.customerName} telah dihapus.`,
        'deal',
        deal?.leadId
      );
    },
    [deals, logActivity]
  );

  // 4. Reset Demo Action
  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setLeads(SEED_LEADS);
    setFollowups(SEED_FOLLOWUPS);
    setProducts(SEED_PRODUCTS);
    setDeals(SEED_DEALS);
    setActivities(SEED_ACTIVITIES);
  }, []);

  return {
    isLoaded,
    leads,
    followups,
    products,
    deals,
    activities,
    // Actions
    addLead,
    updateLead,
    updateLeadStage,
    deleteLead,
    addFollowUp,
    completeFollowUp,
    deleteFollowUp,
    addDeal,
    updateDealStatus,
    deleteDeal,
    resetDemo,
  };
}
