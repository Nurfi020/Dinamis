import {
  ProjectFinance,
  ProjectInvoice,
  AgingBucket,
  CollectionStatus,
  BudgetOverrunStatus,
  ProfitabilityStatus,
  FinancialHealthStatus,
  ReceivablesInvoiceItem,
  ProjectFinancialHealthAnalysis,
  PortfolioFinancialHealthSummary,
  ExpenseCategory
} from '../types';
import { getCategoryCostBudgets } from './contractorFinanceData';

/**
 * Named configuration constant: Warning window before invoice due date (in days)
 */
export const COLLECTION_WARNING_DAYS = 7;

/**
 * Validates whether a given string is a valid ISO date YYYY-MM-DD
 */
export function isValidDateString(dateStr?: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const match = /^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim());
  if (!match) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

/**
 * Calculates Days Overdue strictly against dueDate: max(0, today - dueDate)
 * If dueDate is missing or invalid, hasValidDueDate is false and daysOverdue is 0.
 */
export function calculateDaysOverdue(dueDate: string | undefined, todayStr: string): {
  hasValidDueDate: boolean;
  daysOverdue: number;
} {
  if (!isValidDateString(dueDate)) {
    return { hasValidDueDate: false, daysOverdue: 0 };
  }
  const todayMs = Date.parse(todayStr);
  const dueMs = Date.parse(dueDate!);
  const diffDays = Math.floor((todayMs - dueMs) / (86400 * 1000));
  return {
    hasValidDueDate: true,
    daysOverdue: Math.max(0, diffDays),
  };
}

/**
 * Calculates Invoice Age strictly against invoiceDate: max(0, today - invoiceDate)
 */
export function calculateInvoiceAge(invoiceDate: string | undefined, todayStr: string): number {
  if (!isValidDateString(invoiceDate)) return 0;
  const todayMs = Date.parse(todayStr);
  const invMs = Date.parse(invoiceDate!);
  const diffDays = Math.floor((todayMs - invMs) / (86400 * 1000));
  return Math.max(0, diffDays);
}

/**
 * Classifies an invoice into one of 6 deterministic Aging Buckets based on Days Overdue.
 */
export function classifyAgingBucket(
  outstanding: number,
  hasValidDueDate: boolean,
  daysOverdue: number
): AgingBucket {
  if (outstanding <= 0) return 'CURRENT';
  if (!hasValidDueDate) return 'DUE_DATE_UNKNOWN';
  if (daysOverdue === 0) return 'CURRENT';
  if (daysOverdue >= 1 && daysOverdue <= 30) return '1_30_DAYS';
  if (daysOverdue >= 31 && daysOverdue <= 60) return '31_60_DAYS';
  if (daysOverdue >= 61 && daysOverdue <= 90) return '61_90_DAYS';
  return 'OVER_90_DAYS';
}

/**
 * Classifies collection status with deterministic priority.
 */
export function classifyCollectionStatus(
  outstanding: number,
  hasValidDueDate: boolean,
  dueDate: string | undefined,
  todayStr: string
): CollectionStatus {
  if (outstanding <= 0) return 'PAID';
  if (!hasValidDueDate) return 'DUE_DATE_UNKNOWN';

  const cleanDue = dueDate!.trim();
  if (todayStr > cleanDue) return 'OVERDUE';
  if (todayStr === cleanDue) return 'DUE_TODAY';

  const todayMs = Date.parse(todayStr);
  const dueMs = Date.parse(cleanDue);
  const daysUntilDue = Math.floor((dueMs - todayMs) / (86400 * 1000));

  if (daysUntilDue <= COLLECTION_WARNING_DAYS) {
    return 'DUE_SOON';
  }

  return 'NOT_DUE';
}

/**
 * Deterministic collection priority scoring (1 = Highest, 8 = Lowest)
 */
export function getCollectionPriorityScore(
  collectionStatus: CollectionStatus,
  agingBucket: AgingBucket
): number {
  if (collectionStatus === 'OVERDUE') {
    if (agingBucket === 'OVER_90_DAYS') return 1;
    if (agingBucket === '61_90_DAYS') return 2;
    if (agingBucket === '31_60_DAYS') return 3;
    if (agingBucket === '1_30_DAYS') return 4;
    return 4;
  }
  if (collectionStatus === 'DUE_TODAY') return 5;
  if (collectionStatus === 'DUE_SOON') return 6;
  if (collectionStatus === 'DUE_DATE_UNKNOWN') return 7;
  return 8; // NOT_DUE or PAID
}

/**
 * Extracts and categorizes all active unpaid invoices across all project finances.
 * Sorted deterministically: priorityScore (asc) -> outstandingAmount (desc) -> invoiceNumber (asc).
 */
export function getReceivablesInvoices(
  finances: ProjectFinance[],
  todayOverride?: string
): ReceivablesInvoiceItem[] {
  const todayStr = todayOverride || new Date().toISOString().split('T')[0];
  const items: ReceivablesInvoiceItem[] = [];

  for (const finance of finances) {
    for (const inv of finance.invoices) {
      if (inv.status === 'Cancelled' || inv.status === 'Draft') continue;

      const totalAmount = Number(inv.totalAmount) || 0;
      const paidAmount = Number(inv.paidAmount) || 0;
      const outstandingAmount = Math.max(0, totalAmount - paidAmount);

      // Exclude fully paid invoices from outstanding receivables queue
      if (outstandingAmount <= 0) continue;

      const { hasValidDueDate, daysOverdue } = calculateDaysOverdue(inv.dueDate, todayStr);
      const invoiceAge = calculateInvoiceAge(inv.invoiceDate, todayStr);
      const agingBucket = classifyAgingBucket(outstandingAmount, hasValidDueDate, daysOverdue);
      const collectionStatus = classifyCollectionStatus(outstandingAmount, hasValidDueDate, inv.dueDate, todayStr);
      const priorityScore = getCollectionPriorityScore(collectionStatus, agingBucket);

      items.push({
        id: inv.id,
        projectId: finance.projectId,
        projectNumber: finance.projectNumber,
        projectName: finance.projectName,
        clientName: finance.clientName,
        clientPhone: inv.clientPhone,
        invoiceNumber: inv.invoiceNumber,
        title: inv.title,
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate,
        hasValidDueDate,
        totalAmount,
        paidAmount,
        outstandingAmount,
        daysOverdue,
        invoiceAge,
        agingBucket,
        collectionStatus,
        priorityScore,
      });
    }
  }

  return items.sort((a, b) => {
    if (a.priorityScore !== b.priorityScore) {
      return a.priorityScore - b.priorityScore;
    }
    if (b.outstandingAmount !== a.outstandingAmount) {
      return b.outstandingAmount - a.outstandingAmount;
    }
    return a.invoiceNumber.localeCompare(b.invoiceNumber);
  });
}

/**
 * Evaluates budget overrun status.
 * ZERO SYNTHETIC BUDGET RULE: If hasBudgetSnapshot is false, strictly returns NO_BUDGET and null utilization.
 */
export function classifyBudgetOverrun(
  actualExpense: number,
  hasBudgetSnapshot: boolean,
  budgetCostSnapshot: number
): {
  status: BudgetOverrunStatus;
  utilizationPercent: number | null;
} {
  if (!hasBudgetSnapshot || budgetCostSnapshot <= 0) {
    return { status: 'NO_BUDGET', utilizationPercent: null };
  }

  const utilization = Math.round((actualExpense / budgetCostSnapshot) * 1000) / 10;

  if (utilization <= 80) {
    return { status: 'NORMAL', utilizationPercent: utilization };
  }
  if (utilization <= 95) {
    return { status: 'WARNING', utilizationPercent: utilization };
  }
  if (utilization <= 100) {
    return { status: 'CRITICAL', utilizationPercent: utilization };
  }
  return { status: 'OVERRUN', utilizationPercent: utilization };
}

/**
 * Classifies profitability state deterministically.
 * Priority: LOSS -> AT_RISK -> LOW_MARGIN -> PROFITABLE.
 * Note: Budget availability is tracked separately so NO_BUDGET never masks a real LOSS.
 */
export function classifyProfitability(
  realizedGrossProfit: number,
  realizedMarginPercent: number,
  costVariance: number,
  hasBudgetSnapshot: boolean
): ProfitabilityStatus {
  // 1. Loss: Expenses exceed contract value
  if (realizedGrossProfit < 0) {
    return 'LOSS';
  }

  // 2. At Risk: Has budget snapshot and actual cost has exceeded budget
  if (hasBudgetSnapshot && costVariance < 0) {
    return 'AT_RISK';
  }

  // 3. Low Margin: Realized margin is compressed below 15%
  if (realizedMarginPercent < 15) {
    return 'LOW_MARGIN';
  }

  // 4. Profitable: Healthy margin >= 15% and within budget
  return 'PROFITABLE';
}

/**
 * Analyzes financial health for a single project finance record.
 */
export function analyzeProjectFinancialHealth(
  finance: ProjectFinance,
  todayOverride?: string
): ProjectFinancialHealthAnalysis {
  const todayStr = todayOverride || new Date().toISOString().split('T')[0];
  const reasons: string[] = [];

  const contractVal = finance.contractValueSnapshot || 0;
  const budgetCost = finance.hasBudgetSnapshot ? (finance.budgetCostSnapshot || 0) : 0;
  const actualExpense = finance.totalActualExpense || 0;
  const realizedGP = finance.realizedGrossProfit;
  const realizedMargin = finance.realizedGrossMarginPercent;
  const netCash = finance.netCashFlow;

  // 1. Receivables analysis
  let overdueReceivable = 0;
  let oldestOverdueDays = 0;

  for (const inv of finance.invoices) {
    if (inv.status === 'Cancelled' || inv.status === 'Draft') continue;
    const invTotal = Number(inv.totalAmount) || 0;
    const invPaid = Number(inv.paidAmount) || 0;
    const unpaid = Math.max(0, invTotal - invPaid);
    if (unpaid > 0) {
      const { hasValidDueDate, daysOverdue } = calculateDaysOverdue(inv.dueDate, todayStr);
      if (hasValidDueDate && daysOverdue > 0) {
        overdueReceivable += unpaid;
        if (daysOverdue > oldestOverdueDays) {
          oldestOverdueDays = daysOverdue;
        }
      }
    }
  }

  // 2. Budget Overrun analysis
  const { status: budgetStatus, utilizationPercent } = classifyBudgetOverrun(
    actualExpense,
    finance.hasBudgetSnapshot,
    budgetCost
  );

  // 3. Profitability analysis
  const costVariance = finance.hasBudgetSnapshot ? budgetCost - actualExpense : 0;
  const profitabilityStatus = classifyProfitability(
    realizedGP,
    realizedMargin,
    costVariance,
    finance.hasBudgetSnapshot
  );

  // 4. Deterministic Financial Health Classification (CRITICAL > ATTENTION > HEALTHY)
  let healthStatus: FinancialHealthStatus = 'HEALTHY';

  // Check Critical conditions
  const isLoss = realizedGP < 0;
  const isOldOverdue = overdueReceivable > 0 && oldestOverdueDays > 30;
  const isSevereOverrun = finance.hasBudgetSnapshot && budgetCost > 0 && actualExpense > 1.05 * budgetCost;

  if (isLoss || isOldOverdue || isSevereOverrun) {
    healthStatus = 'CRITICAL';
    if (isLoss) reasons.push('Laba kotor negatif (Biaya melebihi nilai kontrak SPK)');
    if (isOldOverdue) reasons.push(`Piutang macet >30 hari (${oldestOverdueDays} hari)`);
    if (isSevereOverrun) reasons.push('Pengeluaran melebihi 105% pagu anggaran RAB');
  } else {
    // Check Attention conditions
    const hasOverdue = overdueReceivable > 0;
    const isLowMargin = realizedMargin < 10;
    const isDeficitCash = netCash < 0;
    const isWarningBudget = finance.hasBudgetSnapshot && budgetCost > 0 && actualExpense > 0.90 * budgetCost && actualExpense <= 1.05 * budgetCost;

    if (hasOverdue || isLowMargin || isDeficitCash || isWarningBudget) {
      healthStatus = 'ATTENTION';
      if (hasOverdue) reasons.push(`Terdapat tagihan jatuh tempo (${oldestOverdueDays} hari)`);
      if (isLowMargin) reasons.push(`Margin laba kotor tipis (${realizedMargin}%)`);
      if (isDeficitCash) reasons.push('Arus kas defisit (Pengeluaran > Penerimaan termin)');
      if (isWarningBudget) reasons.push(`Pengeluaran mendekati pagu RAB (${utilizationPercent}%)`);
    }
  }

  return {
    projectId: finance.projectId,
    projectNumber: finance.projectNumber,
    projectName: finance.projectName,
    clientName: finance.clientName,
    healthStatus,
    healthReasons: reasons,
    profitabilityStatus,
    hasBudget: finance.hasBudgetSnapshot,
    budgetStatus,
    budgetUtilizationPercent: utilizationPercent,
    overdueReceivable,
    oldestOverdueDays,
    realizedGrossProfit: realizedGP,
    realizedGrossMarginPercent: realizedMargin,
    netCashFlow: netCash,
  };
}

/**
 * Computes portfolio-wide financial health summary.
 */
export function getPortfolioFinancialHealthSummary(
  finances: ProjectFinance[],
  todayOverride?: string
): PortfolioFinancialHealthSummary {
  const todayStr = todayOverride || new Date().toISOString().split('T')[0];

  let healthyCount = 0;
  let attentionCount = 0;
  let criticalCount = 0;

  let totalContractValue = 0;
  let totalInvoiced = 0;
  let totalCollected = 0;
  let totalOutstanding = 0;
  let totalActualExpenses = 0;
  let totalRealizedProfit = 0;
  let totalOverdueReceivable = 0;

  const agingSummary: Record<AgingBucket, { count: number; totalOutstanding: number }> = {
    CURRENT: { count: 0, totalOutstanding: 0 },
    '1_30_DAYS': { count: 0, totalOutstanding: 0 },
    '31_60_DAYS': { count: 0, totalOutstanding: 0 },
    '61_90_DAYS': { count: 0, totalOutstanding: 0 },
    OVER_90_DAYS: { count: 0, totalOutstanding: 0 },
    DUE_DATE_UNKNOWN: { count: 0, totalOutstanding: 0 },
  };

  for (const f of finances) {
    const health = analyzeProjectFinancialHealth(f, todayStr);
    if (health.healthStatus === 'HEALTHY') healthyCount++;
    else if (health.healthStatus === 'ATTENTION') attentionCount++;
    else if (health.healthStatus === 'CRITICAL') criticalCount++;

    totalContractValue += Number(f.contractValueSnapshot) || 0;
    totalInvoiced += Number(f.totalInvoiced) || 0;
    totalCollected += Number(f.totalCollected) || 0;
    totalOutstanding += Number(f.outstandingReceivable) || 0;
    totalActualExpenses += Number(f.totalActualExpense) || 0;
    totalRealizedProfit += Number(f.realizedGrossProfit) || 0;
    totalOverdueReceivable += health.overdueReceivable;
  }

  // Populate Aging Summary from active receivables
  const receivables = getReceivablesInvoices(finances, todayStr);
  for (const r of receivables) {
    if (agingSummary[r.agingBucket]) {
      agingSummary[r.agingBucket].count++;
      agingSummary[r.agingBucket].totalOutstanding += r.outstandingAmount;
    }
  }

  const portfolioMarginPercent = totalContractValue > 0
    ? Math.round(((totalRealizedProfit / totalContractValue) * 100) * 10) / 10
    : 0;

  return {
    totalProjects: finances.length,
    healthyProjectsCount: healthyCount,
    attentionProjectsCount: attentionCount,
    criticalProjectsCount: criticalCount,
    totalContractValue,
    totalInvoiced,
    totalCollected,
    totalOutstanding,
    totalActualExpenses,
    totalRealizedProfit,
    portfolioMarginPercent,
    totalOverdueReceivable,
    agingSummary,
  };
}

/**
 * Helper to safely escape CSV fields (encapsulates quotes, commas, newlines; escapes quotes).
 */
export function escapeCSVValue(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates Executive Project Finance Summary CSV
 */
export function generateExecutiveFinanceCSV(finances: ProjectFinance[], todayOverride?: string): string {
  const todayStr = todayOverride || new Date().toISOString().split('T')[0];
  const headers = [
    'No. Proyek',
    'Nama Proyek',
    'Klien',
    'Nilai Kontrak (Rp)',
    'Total Tertagih (Rp)',
    'Total Diterima (Rp)',
    'Sisa Piutang (Rp)',
    'Pengeluaran Aktual (Rp)',
    'Laba Kotor Realisasi (Rp)',
    'Margin (%)',
    'Status Kesehatan',
    'Catatan Risiko'
  ];

  const rows: string[] = [headers.join(',')];

  for (const f of finances) {
    const health = analyzeProjectFinancialHealth(f, todayStr);
    const row = [
      escapeCSVValue(f.projectNumber),
      escapeCSVValue(f.projectName),
      escapeCSVValue(f.clientName),
      escapeCSVValue(f.contractValueSnapshot),
      escapeCSVValue(f.totalInvoiced),
      escapeCSVValue(f.totalCollected),
      escapeCSVValue(f.outstandingReceivable),
      escapeCSVValue(f.totalActualExpense),
      escapeCSVValue(f.realizedGrossProfit),
      escapeCSVValue(f.realizedGrossMarginPercent),
      escapeCSVValue(health.healthStatus),
      escapeCSVValue(health.healthReasons.join('; ') || 'Normal'),
    ];
    rows.push(row.join(','));
  }

  return '\uFEFF' + rows.join('\r\n');
}

/**
 * Generates Receivables Aging CSV Report
 */
export function generateReceivablesCSV(finances: ProjectFinance[], todayOverride?: string): string {
  const todayStr = todayOverride || new Date().toISOString().split('T')[0];
  const receivables = getReceivablesInvoices(finances, todayStr);

  const headers = [
    'No. Invoice',
    'No. Proyek',
    'Nama Proyek',
    'Klien',
    'No. Telepon',
    'Tanggal Terbit',
    'Jatuh Tempo',
    'Total Tagihan (Rp)',
    'Sudah Dibayar (Rp)',
    'Sisa Piutang (Rp)',
    'Hari Terlambat (Days Overdue)',
    'Usia Invoice (Invoice Age)',
    'Kategori Aging',
    'Status Penagihan',
    'Prioritas'
  ];

  const rows: string[] = [headers.join(',')];

  for (const r of receivables) {
    const row = [
      escapeCSVValue(r.invoiceNumber),
      escapeCSVValue(r.projectNumber),
      escapeCSVValue(r.projectName),
      escapeCSVValue(r.clientName),
      escapeCSVValue(r.clientPhone || '—'),
      escapeCSVValue(r.invoiceDate),
      escapeCSVValue(r.hasValidDueDate ? r.dueDate : 'Tidak Ada / Invalid'),
      escapeCSVValue(r.totalAmount),
      escapeCSVValue(r.paidAmount),
      escapeCSVValue(r.outstandingAmount),
      escapeCSVValue(r.hasValidDueDate ? r.daysOverdue : '—'),
      escapeCSVValue(r.invoiceAge),
      escapeCSVValue(r.agingBucket),
      escapeCSVValue(r.collectionStatus),
      escapeCSVValue(`Prioritas ${r.priorityScore}`),
    ];
    rows.push(row.join(','));
  }

  return '\uFEFF' + rows.join('\r\n');
}

/**
 * Generates Budget vs Actual Cost Control CSV
 */
export function generateBudgetVsActualCSV(finances: ProjectFinance[]): string {
  const headers = [
    'No. Proyek',
    'Nama Proyek',
    'Kategori Biaya',
    'Pagu Anggaran RAB (Rp)',
    'Realisasi Biaya (Rp)',
    'Selisih / Variance (Rp)',
    'Utilisasi (%)',
    'Status Anggaran'
  ];

  const rows: string[] = [headers.join(',')];

  for (const f of finances) {
    const categories = getCategoryCostBudgets(f);
    for (const c of categories) {
      const row = [
        escapeCSVValue(f.projectNumber),
        escapeCSVValue(f.projectName),
        escapeCSVValue(c.category),
        escapeCSVValue(c.hasBudget ? c.budgetAmount : '— (Tanpa RAB)'),
        escapeCSVValue(c.actualAmount),
        escapeCSVValue(c.hasBudget ? c.variance : '—'),
        escapeCSVValue(c.hasBudget ? c.variancePercent : '—'),
        escapeCSVValue(c.status),
      ];
      rows.push(row.join(','));
    }
  }

  return '\uFEFF' + rows.join('\r\n');
}
