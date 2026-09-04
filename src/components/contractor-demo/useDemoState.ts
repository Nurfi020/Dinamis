'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DemoLead,
  DemoSurvey,
  DemoRABItem,
  DemoProject,
  DemoSPK,
  DemoMaterial,
  DemoTeamMember,
  DemoActivity,
  LeadStatus,
  ProjectStage,
  MaterialStatus,
} from './types';
import {
  SEED_LEADS,
  SEED_PROJECTS,
  SEED_SURVEYS,
  SEED_RAB_ITEMS,
  SEED_SPK,
  SEED_MATERIALS,
  SEED_TEAM,
  SEED_ACTIVITIES,
} from './seedData';

const STORAGE_KEY = 'dinamis_contractor_crm_demo_v1';

interface DemoStoragePayload {
  leads: DemoLead[];
  projects: DemoProject[];
  surveys: DemoSurvey[];
  rabItems: DemoRABItem[];
  spkList: DemoSPK[];
  materials: DemoMaterial[];
  team: DemoTeamMember[];
  activities: DemoActivity[];
}

export function useDemoState() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [leads, setLeads] = useState<DemoLead[]>(SEED_LEADS);
  const [projects, setProjects] = useState<DemoProject[]>(SEED_PROJECTS);
  const [surveys, setSurveys] = useState<DemoSurvey[]>(SEED_SURVEYS);
  const [rabItems, setRabItems] = useState<DemoRABItem[]>(SEED_RAB_ITEMS);
  const [spkList, setSpkList] = useState<DemoSPK[]>(SEED_SPK);
  const [materials, setMaterials] = useState<DemoMaterial[]>(SEED_MATERIALS);
  const [team, setTeam] = useState<DemoTeamMember[]>(SEED_TEAM);
  const [activities, setActivities] = useState<DemoActivity[]>(SEED_ACTIVITIES);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: DemoStoragePayload = JSON.parse(raw);
        if (parsed.leads && parsed.projects) {
          setLeads(parsed.leads);
          setProjects(parsed.projects);
          setSurveys(parsed.surveys || SEED_SURVEYS);
          setRabItems(parsed.rabItems || SEED_RAB_ITEMS);
          setSpkList(parsed.spkList || SEED_SPK);
          setMaterials(parsed.materials || SEED_MATERIALS);
          setTeam(parsed.team || SEED_TEAM);
          setActivities(parsed.activities || SEED_ACTIVITIES);
        }
      }
    } catch {
      // Fallback to seed
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload: DemoStoragePayload = {
        leads,
        projects,
        surveys,
        rabItems,
        spkList,
        materials,
        team,
        activities,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors in private browsing
    }
  }, [isLoaded, leads, projects, surveys, rabItems, spkList, materials, team, activities]);

  // Log activity helper
  const logActivity = useCallback((title: string, description: string, category: DemoActivity['category']) => {
    const newAct: DemoActivity = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      title,
      description,
      category,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  }, []);

  // Lead CRUD
  const addLead = useCallback(
    (lead: Omit<DemoLead, 'id' | 'createdAt' | 'lastFollowUp'>) => {
      const newLead: DemoLead = {
        ...lead,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastFollowUp: 'Hari ini, baru saja',
      };
      setLeads((prev) => [newLead, ...prev]);
      logActivity('Lead Baru Ditambahkan', `Prospek "${newLead.name}" berhasil dibuat (${newLead.projectType})`, 'lead');
    },
    [logActivity]
  );

  const updateLeadStatus = useCallback(
    (id: string, status: LeadStatus, note?: string) => {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                status,
                lastFollowUp: 'Hari ini, baru saja',
                notes: note ? `${note} (Update: ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})` : l.notes,
              }
            : l
        )
      );
      const lead = leads.find((l) => l.id === id);
      logActivity('Status Lead Diperbarui', `Status ${lead?.name || 'Lead'} diubah menjadi "${status}"`, 'lead');
    },
    [leads, logActivity]
  );

  const deleteLead = useCallback(
    (id: string) => {
      const lead = leads.find((l) => l.id === id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      logActivity('Lead Dihapus', `Data prospek "${lead?.name || id}" telah dihapus`, 'lead');
    },
    [leads, logActivity]
  );

  // Survey Actions
  const addSurvey = useCallback(
    (survey: Omit<DemoSurvey, 'id'>) => {
      const newSurvey: DemoSurvey = {
        ...survey,
        id: `srv-${Date.now()}`,
      };
      setSurveys((prev) => [newSurvey, ...prev]);
      logActivity('Survei Lokasi Dijadwalkan', `Survei "${newSurvey.projectTitle}" dijadwalkan pada ${newSurvey.date}`, 'survey');
    },
    [logActivity]
  );

  const updateSurveyStatus = useCallback(
    (id: string, status: DemoSurvey['status']) => {
      setSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      const survey = surveys.find((s) => s.id === id);
      logActivity('Status Survei Berubah', `Survei "${survey?.projectTitle}" berstatus "${status}"`, 'survey');
    },
    [surveys, logActivity]
  );

  // RAB Actions
  const addRABItem = useCallback(
    (item: Omit<DemoRABItem, 'id' | 'subtotal'>) => {
      const subtotal = item.quantity * item.unitPrice;
      const newItem: DemoRABItem = {
        ...item,
        id: `rab-${Date.now()}`,
        subtotal,
      };
      setRabItems((prev) => [newItem, ...prev]);
      logActivity('Item RAB Ditambahkan', `Item "${newItem.taskName}" ditambahkan (Rp ${subtotal.toLocaleString('id-ID')})`, 'rab');
    },
    [logActivity]
  );

  const updateRABQuantity = useCallback(
    (id: string, quantity: number) => {
      setRabItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const validQty = Math.max(1, quantity);
            return {
              ...item,
              quantity: validQty,
              subtotal: validQty * item.unitPrice,
            };
          }
          return item;
        })
      );
    },
    []
  );

  const deleteRABItem = useCallback(
    (id: string) => {
      const item = rabItems.find((r) => r.id === id);
      setRabItems((prev) => prev.filter((r) => r.id !== id));
      logActivity('Item RAB Dihapus', `Item "${item?.taskName || id}" dihapus dari kalkulasi`, 'rab');
    },
    [rabItems, logActivity]
  );

  // Project Stage
  const updateProjectStage = useCallback(
    (id: string, stage: ProjectStage) => {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, stage } : p)));
      const prj = projects.find((p) => p.id === id);
      logActivity('Tahap Proyek Berpindah', `Proyek "${prj?.title}" berpindah ke tahap "${stage}"`, 'project');
    },
    [projects, logActivity]
  );

  // Material Actions
  const addMaterial = useCallback(
    (mat: Omit<DemoMaterial, 'id'>) => {
      const newMat: DemoMaterial = {
        ...mat,
        id: `mat-${Date.now()}`,
      };
      setMaterials((prev) => [newMat, ...prev]);
      logActivity('Item Material Baru', `Material "${newMat.name}" ditambahkan ke proyek`, 'material');
    },
    [logActivity]
  );

  const updateMaterialStatus = useCallback(
    (id: string, status: MaterialStatus, actualCost?: number) => {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status,
                actualCost: actualCost !== undefined ? actualCost : m.actualCost,
                purchaseDate: status === 'Dibeli' ? new Date().toISOString().split('T')[0] : m.purchaseDate,
              }
            : m
        )
      );
      const mat = materials.find((m) => m.id === id);
      logActivity('Status Belanja Material', `Material "${mat?.name}" diubah menjadi "${status}"`, 'material');
    },
    [materials, logActivity]
  );

  // Team Actions
  const addTeamMember = useCallback(
    (member: Omit<DemoTeamMember, 'id'>) => {
      const newMember: DemoTeamMember = {
        ...member,
        id: `tm-${Date.now()}`,
      };
      setTeam((prev) => [newMember, ...prev]);
      logActivity('Anggota Tim Ditambahkan', `${newMember.name} (${newMember.role}) didaftarkan`, 'team');
    },
    [logActivity]
  );

  const deleteTeamMember = useCallback(
    (id: string) => {
      const member = team.find((t) => t.id === id);
      setTeam((prev) => prev.filter((t) => t.id !== id));
      logActivity('Anggota Tim Dihapus', `${member?.name || id} dihapus dari daftar tim`, 'team');
    },
    [team, logActivity]
  );

  const assignTeamProject = useCallback(
    (id: string, projectTitle: string) => {
      setTeam((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                assignedProjectTitle: projectTitle,
                status: projectTitle ? 'Aktif di Proyek' : 'Standby',
              }
            : t
        )
      );
    },
    []
  );

  // Reset Demo to initial seed
  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setLeads(SEED_LEADS);
    setProjects(SEED_PROJECTS);
    setSurveys(SEED_SURVEYS);
    setRabItems(SEED_RAB_ITEMS);
    setSpkList(SEED_SPK);
    setMaterials(SEED_MATERIALS);
    setTeam(SEED_TEAM);
    setActivities(SEED_ACTIVITIES);
  }, []);

  return {
    isLoaded,
    leads,
    projects,
    surveys,
    rabItems,
    spkList,
    materials,
    team,
    activities,
    // Methods
    addLead,
    updateLeadStatus,
    deleteLead,
    addSurvey,
    updateSurveyStatus,
    addRABItem,
    updateRABQuantity,
    deleteRABItem,
    updateProjectStage,
    addMaterial,
    updateMaterialStatus,
    addTeamMember,
    deleteTeamMember,
    assignTeamProject,
    resetDemo,
  };
}
