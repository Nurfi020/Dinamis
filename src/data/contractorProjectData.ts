import {
  ContractorProject,
  ProjectMilestone,
  ProgressLogEntry,
  ProjectStatus,
  ProjectStage,
  Quotation,
  RAB
} from '../types';
import { WORK_CATEGORIES } from './contractorRABData';

export const PROJECT_STORAGE_KEY = 'kelola_lead_sales_project_v1';

/**
 * Empty initial baseline state by default (No fake seed records).
 */
export const INITIAL_PROJECTS: ContractorProject[] = [];

/**
 * Helper to calculate difference in calendar days between two YYYY-MM-DD date strings.
 */
export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 30;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  } catch {
    return 30;
  }
}

/**
 * Calculates date string in YYYY-MM-DD format after adding N days.
 */
export function addDays(dateStr: string, days: number): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const today = new Date();
      today.setDate(today.getDate() + days);
      return today.toISOString().split('T')[0];
    }
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  }
}

/**
 * Generates an auto-incremented unique Project Number (PRJ-YYYY-XXXX).
 */
export function generateNextProjectNumber(existingProjects: ContractorProject[]): string {
  const year = new Date().getFullYear();
  let maxSeq = 0;

  for (const p of existingProjects) {
    if (p.projectNumber && p.projectNumber.startsWith(`PRJ-${year}-`)) {
      const parts = p.projectNumber.split('-');
      if (parts.length >= 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `PRJ-${year}-${nextSeq}`;
}

/**
 * Validates that all milestone weights sum exactly to 100%.
 */
export function validateMilestoneWeights(milestones: ProjectMilestone[]): {
  isValid: boolean;
  totalWeight: number;
  error?: string
} {
  if (!milestones || milestones.length === 0) {
    return { isValid: false, totalWeight: 0, error: 'Minimal harus ada 1 milestone tahapan pekerjaan.' };
  }

  let total = 0;
  for (const m of milestones) {
    if (m.weightPercent < 0 || m.weightPercent > 100) {
      return {
        isValid: false,
        totalWeight: total,
        error: `Bobot milestone "${m.name}" harus antara 0% dan 100%.`
      };
    }
    total += m.weightPercent;
  }

  const roundedTotal = Math.round(total * 100) / 100;
  if (roundedTotal !== 100) {
    return {
      isValid: false,
      totalWeight: roundedTotal,
      error: `Total bobot milestone saat ini ${roundedTotal}%. Total bobot seluruh milestone harus tepat 100%.`
    };
  }

  return { isValid: true, totalWeight: roundedTotal };
}

/**
 * Generates initial default milestones with weights summing exactly to 100%.
 * If RAB items are present, weights are estimated from category subtotals.
 */
export function generateDefaultMilestones(
  startDateStr: string,
  endDateStr: string,
  rabItems?: RAB['items']
): ProjectMilestone[] {
  const totalDays = calculateDaysBetween(startDateStr, endDateStr);

  if (rabItems && rabItems.length > 0) {
    // Group by categories present
    const categoryTotals: Record<string, number> = {};
    let totalAll = 0;

    for (const it of rabItems) {
      const cat = it.category || 'Pekerjaan Struktur';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (it.subtotal || 0);
      totalAll += (it.subtotal || 0);
    }

    const categories = Object.keys(categoryTotals);
    if (categories.length > 0 && totalAll > 0) {
      let accumulatedWeight = 0;
      const count = categories.length;
      const daysPerCat = Math.max(1, Math.floor(totalDays / count));

      const generated: ProjectMilestone[] = categories.map((cat, idx) => {
        const rawWeight = Math.round((categoryTotals[cat] / totalAll) * 100);
        const weight = idx === count - 1 ? 100 - accumulatedWeight : rawWeight;
        accumulatedWeight += weight;

        const startDayOffset = idx * daysPerCat;
        const endDayOffset = idx === count - 1 ? totalDays : (idx + 1) * daysPerCat;

        return {
          id: `m-${Date.now()}-${idx + 1}`,
          name: cat,
          category: cat,
          weightPercent: Math.max(1, weight),
          targetStartDate: addDays(startDateStr, startDayOffset),
          targetEndDate: addDays(startDateStr, endDayOffset),
          actualProgressPercent: 0,
          status: 'Pending',
        };
      });

      // Normalize if rounding caused minor delta
      const totalGenerated = generated.reduce((sum, m) => sum + m.weightPercent, 0);
      if (totalGenerated !== 100 && generated.length > 0) {
        generated[generated.length - 1].weightPercent += (100 - totalGenerated);
      }

      return generated;
    }
  }

  // Standard 5-phase fallback milestone template (Total = 100%)
  const standardPhases = [
    { name: 'Pekerjaan Persiapan, Pengukuran & Pondasi', cat: 'Pekerjaan Pondasi & Tanah', weight: 15, startRatio: 0, endRatio: 0.2 },
    { name: 'Pekerjaan Struktur Utama & Pembesian', cat: 'Pekerjaan Struktur', weight: 30, startRatio: 0.15, endRatio: 0.55 },
    { name: 'Pekerjaan Pasangan Dinding & Arsitektur', cat: 'Pekerjaan Arsitektur', weight: 25, startRatio: 0.45, endRatio: 0.8 },
    { name: 'Pekerjaan Mekanikal, Elektrikal & Sanitasi (MEP)', cat: 'Pekerjaan MEP & Instalasi', weight: 15, startRatio: 0.6, endRatio: 0.9 },
    { name: 'Pekerjaan Finishing, Pengecatan & Pembersihan (PHO)', cat: 'Pekerjaan Finishing', weight: 15, startRatio: 0.8, endRatio: 1.0 },
  ];

  return standardPhases.map((p, idx) => ({
    id: `m-std-${Date.now()}-${idx + 1}`,
    name: p.name,
    category: p.cat,
    weightPercent: p.weight,
    targetStartDate: addDays(startDateStr, Math.floor(totalDays * p.startRatio)),
    targetEndDate: addDays(startDateStr, Math.floor(totalDays * p.endRatio)),
    actualProgressPercent: 0,
    status: 'Pending',
  }));
}

/**
 * Calculates current weighted project progress from milestones.
 * projectProgress = SUM(milestone.actualProgressPercent * milestone.weightPercent / 100)
 * Result is clamped between 0 and 100.
 */
export function calculateProjectProgress(milestones: ProjectMilestone[]): number {
  if (!milestones || milestones.length === 0) return 0;

  let totalProgress = 0;
  for (const m of milestones) {
    const p = Math.min(100, Math.max(0, m.actualProgressPercent || 0));
    const w = Math.min(100, Math.max(0, m.weightPercent || 0));
    totalProgress += (p * w) / 100;
  }

  const clamped = Math.min(100, Math.max(0, totalProgress));
  return Number(clamped.toFixed(2));
}

/**
 * Computes milestone status based on actual progress percentage.
 * 0% -> Pending, >0% and <100% -> In_Progress, 100% -> Completed
 */
export function getMilestoneStatus(progress: number): ProjectMilestone['status'] {
  if (progress <= 0) return 'Pending';
  if (progress >= 100) return 'Completed';
  return 'In_Progress';
}

/**
 * Calculates cumulative planned progress % for a specific date (Kurva S baseline).
 * Progress is linearly distributed within each milestone's target timeframe.
 */
export function calculatePlannedProgressForDate(
  project: {
    contractStartDate: string;
    contractEndDate: string;
    milestones: ProjectMilestone[];
  },
  queryDateStr: string
): number {
  if (!project.milestones || project.milestones.length === 0) return 0;

  const queryTime = new Date(queryDateStr).getTime();
  if (isNaN(queryTime)) return 0;

  let cumulativePlanned = 0;

  for (const m of project.milestones) {
    const startTime = new Date(m.targetStartDate).getTime();
    const endTime = new Date(m.targetEndDate).getTime();

    if (isNaN(startTime) || isNaN(endTime) || endTime <= startTime) {
      if (queryTime >= startTime) {
        cumulativePlanned += m.weightPercent;
      }
      continue;
    }

    if (queryTime < startTime) {
      // Milestone not yet started
      continue;
    } else if (queryTime >= endTime) {
      // Milestone should be fully complete
      cumulativePlanned += m.weightPercent;
    } else {
      // Linear progression inside active milestone window
      const milestoneDuration = endTime - startTime;
      const elapsed = queryTime - startTime;
      const fraction = elapsed / milestoneDuration;
      cumulativePlanned += m.weightPercent * fraction;
    }
  }

  const clamped = Math.min(100, Math.max(0, cumulativePlanned));
  return Number(clamped.toFixed(2));
}

/**
 * Calculates progress deviation:
 * deviationPercent = currentProgressPercent - targetProgressPercent
 * Positive = Ahead of schedule (+), Zero = On track, Negative = Behind schedule (-)
 */
export function calculateDeviation(currentProgress: number, targetProgress: number): number {
  return Number((currentProgress - targetProgress).toFixed(2));
}

/**
 * Checks if project is experiencing critical deviation (< -5%).
 */
export function isCriticalDeviation(deviationPercent: number): boolean {
  return deviationPercent < -5;
}

/**
 * Creates a ContractorProject from an Accepted Quotation (Primary Flow).
 * contractValue is snapshotted strictly from quotation.grandTotal.
 */
export function createProjectFromQuotation(
  quotation: Quotation,
  options: {
    contractNumber?: string;
    contractStartDate: string;
    contractEndDate: string;
    siteManagerName?: string;
    siteManagerPhone?: string;
    customMilestones?: ProjectMilestone[];
    sourceRAB?: RAB;
  },
  existingProjects: ContractorProject[]
): ContractorProject {
  if (quotation.status !== 'Accepted') {
    throw new Error('Proyek baru hanya dapat diterbitkan dari Surat Penawaran Harga (SPH) yang telah DISETUJUI (Accepted/Deal SPK).');
  }

  const durationDays = calculateDaysBetween(options.contractStartDate, options.contractEndDate);
  const milestones = options.customMilestones && options.customMilestones.length > 0
    ? options.customMilestones
    : generateDefaultMilestones(options.contractStartDate, options.contractEndDate, options.sourceRAB?.items);

  const weightValidation = validateMilestoneWeights(milestones);
  if (!weightValidation.isValid) {
    throw new Error(weightValidation.error || 'Total bobot milestone harus tepat 100%.');
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const targetProgressPercent = calculatePlannedProgressForDate(
    { contractStartDate: options.contractStartDate, contractEndDate: options.contractEndDate, milestones },
    todayStr
  );
  const currentProgressPercent = calculateProjectProgress(milestones);
  const deviationPercent = calculateDeviation(currentProgressPercent, targetProgressPercent);

  const now = new Date().toISOString();
  const projectNumber = generateNextProjectNumber(existingProjects);

  return {
    id: `prj-${Date.now()}`,
    projectNumber,
    quotationId: quotation.id,
    quotationNumber: quotation.quotationNumber,
    rabId: quotation.rabId,
    rabNumber: quotation.rabNumber,
    leadId: quotation.leadId,
    projectName: quotation.projectName,
    clientName: quotation.clientName,
    clientPhone: quotation.clientPhone,
    clientEmail: quotation.clientEmail || '',
    projectLocation: quotation.projectLocation,
    buildingAreaM2: quotation.buildingAreaM2,
    contractValue: quotation.grandTotal, // Commercial snapshot
    contractNumber: options.contractNumber || `SPK-${new Date().getFullYear()}/${projectNumber.replace('PRJ-', '')}`,
    contractStartDate: options.contractStartDate,
    contractEndDate: options.contractEndDate,
    durationDays,
    status: 'In_Progress',
    stage: 'Persiapan',
    targetProgressPercent,
    currentProgressPercent,
    deviationPercent,
    milestones,
    progressLogs: [],
    siteManagerName: options.siteManagerName || 'Ir. Hendra Gunawan, S.T. (Site Lead)',
    siteManagerPhone: options.siteManagerPhone || '+62 812-9988-7711',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a ContractorProject from a Finalized RAB (Fallback Flow).
 * contractValue is snapshotted from rab.grandTotal.
 */
export function createProjectFromRAB(
  rab: RAB,
  options: {
    contractNumber?: string;
    contractStartDate: string;
    contractEndDate: string;
    siteManagerName?: string;
    siteManagerPhone?: string;
    customMilestones?: ProjectMilestone[];
  },
  existingProjects: ContractorProject[]
): ContractorProject {
  if (rab.status !== 'Final') {
    throw new Error('Pembuatan proyek fallback hanya dapat dilakukan dari dokumen RAB dengan status FINAL.');
  }

  const durationDays = calculateDaysBetween(options.contractStartDate, options.contractEndDate);
  const milestones = options.customMilestones && options.customMilestones.length > 0
    ? options.customMilestones
    : generateDefaultMilestones(options.contractStartDate, options.contractEndDate, rab.items);

  const weightValidation = validateMilestoneWeights(milestones);
  if (!weightValidation.isValid) {
    throw new Error(weightValidation.error || 'Total bobot milestone harus tepat 100%.');
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const targetProgressPercent = calculatePlannedProgressForDate(
    { contractStartDate: options.contractStartDate, contractEndDate: options.contractEndDate, milestones },
    todayStr
  );
  const currentProgressPercent = calculateProjectProgress(milestones);
  const deviationPercent = calculateDeviation(currentProgressPercent, targetProgressPercent);

  const now = new Date().toISOString();
  const projectNumber = generateNextProjectNumber(existingProjects);

  return {
    id: `prj-${Date.now()}`,
    projectNumber,
    rabId: rab.id,
    rabNumber: rab.rabNumber,
    leadId: rab.leadId,
    projectName: rab.projectName,
    clientName: rab.clientName,
    clientPhone: rab.clientPhone,
    clientEmail: '',
    projectLocation: rab.projectLocation,
    buildingAreaM2: rab.buildingAreaM2,
    contractValue: rab.grandTotal, // Financial snapshot
    contractNumber: options.contractNumber || `SPK-${new Date().getFullYear()}/${projectNumber.replace('PRJ-', '')}`,
    contractStartDate: options.contractStartDate,
    contractEndDate: options.contractEndDate,
    durationDays,
    status: 'In_Progress',
    stage: 'Persiapan',
    targetProgressPercent,
    currentProgressPercent,
    deviationPercent,
    milestones,
    progressLogs: [],
    siteManagerName: options.siteManagerName || 'Ir. Hendra Gunawan, S.T. (Site Lead)',
    siteManagerPhone: options.siteManagerPhone || '+62 812-9988-7711',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Loads projects from isolated localStorage key.
 */
export function getStoredProjects(): ContractorProject[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!raw) return INITIAL_PROJECTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

/**
 * Saves projects to isolated localStorage key.
 */
export function saveStoredProjects(projects: ContractorProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage', err);
  }
}
