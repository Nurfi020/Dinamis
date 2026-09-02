import {
  ContractorProject,
  RAB,
  ProjectFinance,
  BillingTerm,
  ProjectInvoice,
  InvoicePayment,
  ProjectExpense,
  CategoryCostBudget,
  ExpenseCategory,
  InvoiceStatus,
  BillingType
} from '../types';

export const FINANCE_STORAGE_KEY = 'kelola_lead_sales_project_finance_v1';

export const INITIAL_FINANCES: ProjectFinance[] = [];

/**
 * Generate sequential invoice number: INV/{YEAR}/{PRJ-SEQ}/{INV-SEQ}
 */
export function generateNextInvoiceNumber(existingInvoices: ProjectInvoice[], projectNumber: string): string {
  const year = new Date().getFullYear();
  const prjShort = projectNumber.replace('PRJ-', '');
  const matching = existingInvoices.filter((inv) => inv.projectNumber === projectNumber || inv.invoiceNumber.includes(prjShort));
  const seq = matching.length + 1;
  return `INV/${year}/${prjShort}/${String(seq).padStart(2, '0')}`;
}

/**
 * Generate sequential BAP (Berita Acara Pembayaran) number
 */
export function generateNextBAPNumber(existingInvoices: ProjectInvoice[], projectNumber: string): string {
  const year = new Date().getFullYear();
  const prjShort = projectNumber.replace('PRJ-', '');
  const matching = existingInvoices.filter((inv) => inv.bapNumber);
  const seq = matching.length + 1;
  return `BAP/${year}/${prjShort}/${String(seq).padStart(2, '0')}`;
}

/**
 * Generate default standard construction billing terms (DP 20%, Termin 1 25%, Termin 2 25%, Termin 3 20%, Retensi 10%)
 */
export function generateDefaultBillingTerms(projectId: string, contractValue: number, startDate?: string): BillingTerm[] {
  const start = startDate ? new Date(startDate) : new Date();

  // Helper to add days
  const addDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res.toISOString().split('T')[0];
  };

  return [
    {
      id: `term-${projectId}-dp`,
      projectId,
      termNumber: 0,
      type: 'DP',
      label: 'Uang Muka (DP) 20%',
      percentage: 20,
      amount: Math.round(contractValue * 0.2),
      targetPhysicalProgressTrigger: 0,
      dueDate: addDays(start, 7),
      status: 'Unbilled',
    },
    {
      id: `term-${projectId}-t1`,
      projectId,
      termNumber: 1,
      type: 'Termin',
      label: 'Termin 1 (Target Fisik 30%)',
      percentage: 25,
      amount: Math.round(contractValue * 0.25),
      targetPhysicalProgressTrigger: 30,
      dueDate: addDays(start, 30),
      status: 'Unbilled',
    },
    {
      id: `term-${projectId}-t2`,
      projectId,
      termNumber: 2,
      type: 'Termin',
      label: 'Termin 2 (Target Fisik 60%)',
      percentage: 25,
      amount: Math.round(contractValue * 0.25),
      targetPhysicalProgressTrigger: 60,
      dueDate: addDays(start, 60),
      status: 'Unbilled',
    },
    {
      id: `term-${projectId}-t3`,
      projectId,
      termNumber: 3,
      type: 'Termin',
      label: 'Termin 3 (Target Fisik 90%)',
      percentage: 20,
      amount: Math.round(contractValue * 0.2),
      targetPhysicalProgressTrigger: 90,
      dueDate: addDays(start, 90),
      status: 'Unbilled',
    },
    {
      id: `term-${projectId}-retensi`,
      projectId,
      termNumber: 99,
      type: 'Retensi',
      label: 'Retensi Pemeliharaan 10% (PHO)',
      percentage: 10,
      amount: Math.round(contractValue * 0.1),
      targetPhysicalProgressTrigger: 100,
      dueDate: addDays(start, 120),
      status: 'Unbilled',
    },
  ];
}

/**
 * Validates that billing term percentages sum to 100% and amounts do not exceed contract value
 */
export function validateBillingSchedule(terms: BillingTerm[], contractValue: number): {
  isValid: boolean;
  totalPercentage: number;
  totalAmount: number;
  error?: string;
} {
  const totalPercentage = Math.round(terms.reduce((sum, t) => sum + (Number(t.percentage) || 0), 0) * 100) / 100;
  const totalAmount = terms.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  for (const t of terms) {
    if (t.percentage < 0 || t.percentage > 100) {
      return {
        isValid: false,
        totalPercentage,
        totalAmount,
        error: `Persentase termin "${t.label}" harus antara 0% dan 100%.`,
      };
    }
    if (t.amount < 0) {
      return {
        isValid: false,
        totalPercentage,
        totalAmount,
        error: `Nominal termin "${t.label}" tidak boleh bernilai negatif.`,
      };
    }
  }

  if (totalPercentage !== 100) {
    return {
      isValid: false,
      totalPercentage,
      totalAmount,
      error: `Total persentase seluruh termin saat ini ${totalPercentage}%. Wajib tepat 100%.`,
    };
  }

  return {
    isValid: true,
    totalPercentage,
    totalAmount,
  };
}

/**
 * Calculates remaining contractual billing capacity for a project.
 * Sums the billingBase (amount) of ALL non-cancelled invoices.
 * PPN (taxAmount) is strictly excluded from consuming the ceiling.
 */
export function getRemainingBillingCapacity(finance: ProjectFinance, excludeInvoiceId?: string): number {
  const contractValue = finance.contractValueSnapshot || 0;
  const existingBillingBase = finance.invoices
    .filter((inv) => inv.status !== 'Cancelled' && (!excludeInvoiceId || inv.id !== excludeInvoiceId))
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  return Math.max(0, contractValue - existingBillingBase);
}

/**
 * Validates that any new or updated invoice billingBase does not exceed the global contractual ceiling.
 * Formula: existingBillingBase + newBillingBase <= contractValueSnapshot
 */
export function validateInvoiceAgainstContractCeiling(
  finance: ProjectFinance,
  invoiceAmount: number,
  excludeInvoiceId?: string
): {
  isValid: boolean;
  contractValue: number;
  existingBillingBase: number;
  newBillingBase: number;
  totalBillingBase: number;
  remainingCapacity: number;
  error?: string;
} {
  const contractValue = finance.contractValueSnapshot || 0;
  const existingBillingBase = finance.invoices
    .filter((inv) => inv.status !== 'Cancelled' && (!excludeInvoiceId || inv.id !== excludeInvoiceId))
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const remainingCapacity = Math.max(0, contractValue - existingBillingBase);
  const totalBillingBase = existingBillingBase + invoiceAmount;

  if (invoiceAmount <= 0) {
    return {
      isValid: false,
      contractValue,
      existingBillingBase,
      newBillingBase: invoiceAmount,
      totalBillingBase,
      remainingCapacity,
      error: 'Nominal pokok tagihan (billing base) harus lebih besar dari Rp 0.',
    };
  }

  if (invoiceAmount > remainingCapacity) {
    return {
      isValid: false,
      contractValue,
      existingBillingBase,
      newBillingBase: invoiceAmount,
      totalBillingBase,
      remainingCapacity,
      error: `Nominal pokok tagihan (Rp ${invoiceAmount.toLocaleString('id-ID')}) melebihi sisa pagu kontrak (Rp ${remainingCapacity.toLocaleString('id-ID')}). Total tagihan pokok tidak boleh melebihi nilai kontrak (Rp ${contractValue.toLocaleString('id-ID')}).`,
    };
  }

  return {
    isValid: true,
    contractValue,
    existingBillingBase,
    newBillingBase: invoiceAmount,
    totalBillingBase,
    remainingCapacity,
  };
}

/**
 * Initialize Project Finance record from an existing Contractor Project and optional source RAB.
 * ZERO SYNTHETIC BUDGET RULE: If RAB is missing or uninitialized, budgetCostSnapshot is 0 and hasBudgetSnapshot is false.
 */
export function initializeProjectFinance(
  project: ContractorProject,
  sourceRAB?: RAB | null,
  customTerms?: BillingTerm[]
): ProjectFinance {
  const contractValue = project.contractValue || 0;

  // Derive budget cost baseline strictly from source RAB if available
  let hasBudgetSnapshot = false;
  let budgetCost = 0;
  let materialBudget = 0;
  let laborBudget = 0;
  let equipmentBudget = 0;
  let operationalBudget = 0;

  if (sourceRAB && (sourceRAB.subtotalCost > 0 || sourceRAB.materialTotal + sourceRAB.laborTotal > 0)) {
    hasBudgetSnapshot = true;
    budgetCost = sourceRAB.subtotalCost || sourceRAB.materialTotal + sourceRAB.laborTotal;
    materialBudget = sourceRAB.materialTotal || 0;
    laborBudget = sourceRAB.laborTotal || 0;
    equipmentBudget = 0;
    operationalBudget = sourceRAB.overheadAmount || 0;
  }

  const terms = customTerms && customTerms.length > 0
    ? customTerms
    : generateDefaultBillingTerms(project.id, contractValue, project.contractStartDate);

  const rawFinance: ProjectFinance = {
    id: `fin-${project.id}`,
    projectId: project.id,
    projectNumber: project.projectNumber,
    projectName: project.projectName,
    clientName: project.clientName,

    hasBudgetSnapshot,
    contractValueSnapshot: contractValue,
    budgetCostSnapshot: budgetCost,
    categoryBudgetsSnapshot: {
      material: materialBudget,
      labor: laborBudget,
      equipment: equipmentBudget,
      operational: operationalBudget,
    },

    billingTerms: terms,
    invoices: [],
    payments: [],
    expenses: [],

    totalInvoiced: 0,
    totalCollected: 0,
    outstandingReceivable: 0,
    overdueReceivable: 0,
    totalActualExpense: 0,

    estimatedGrossProfit: hasBudgetSnapshot ? contractValue - budgetCost : 0,
    estimatedGrossMarginPercent: hasBudgetSnapshot && contractValue > 0 ? ((contractValue - budgetCost) / contractValue) * 100 : 0,
    realizedGrossProfit: contractValue,
    realizedGrossMarginPercent: 100,

    netCashFlow: 0,
    costVariance: hasBudgetSnapshot ? budgetCost : 0,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return recalculateProjectFinance(rawFinance);
}

/**
 * Recalculates all financial KPIs, invoice statuses, cost category variances, and cash flow
 */
export function recalculateProjectFinance(finance: ProjectFinance): ProjectFinance {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Update Invoices status based on payments
  const updatedInvoices = finance.invoices.map((inv) => {
    // Sum payments for this invoice
    const invoicePayments = finance.payments.filter((p) => p.invoiceId === inv.id);
    const paidSum = invoicePayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    let status: InvoiceStatus = inv.status;

    if (inv.status !== 'Cancelled' && inv.status !== 'Draft') {
      if (paidSum >= inv.totalAmount && inv.totalAmount > 0) {
        status = 'Paid';
      } else if (paidSum > 0 && paidSum < inv.totalAmount) {
        status = 'Partial';
      } else if (inv.dueDate && inv.dueDate < todayStr && paidSum < inv.totalAmount) {
        status = 'Overdue';
      } else {
        status = 'Issued';
      }
    }

    return {
      ...inv,
      paidAmount: paidSum,
      status,
    };
  });

  // 2. Update Billing Terms status
  const updatedTerms = finance.billingTerms.map((term) => {
    const linkedInvoice = updatedInvoices.find((inv) => inv.billingTermId === term.id || inv.id === term.invoiceId);
    let termStatus: 'Unbilled' | 'Invoiced' | 'Paid' = 'Unbilled';

    if (linkedInvoice) {
      if (linkedInvoice.status === 'Paid') {
        termStatus = 'Paid';
      } else if (linkedInvoice.status !== 'Cancelled') {
        termStatus = 'Invoiced';
      }
    }

    return {
      ...term,
      invoiceId: linkedInvoice?.id,
      status: termStatus,
    };
  });

  // 3. Compute Invoice Aggregates (Gross invoice amounts for receivables and cash tracking)
  const activeInvoices = updatedInvoices.filter((inv) => inv.status !== 'Cancelled' && inv.status !== 'Draft');
  const totalInvoiced = activeInvoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
  const totalCollected = finance.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const outstandingReceivable = Math.max(0, totalInvoiced - totalCollected);

  const overdueReceivable = updatedInvoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + Math.max(0, inv.totalAmount - inv.paidAmount), 0);

  // 4. Compute Expense Aggregates
  const totalActualExpense = finance.expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  // 5. Profitability & Cash Flow
  const contractValue = finance.contractValueSnapshot || 0;
  const budgetCost = finance.hasBudgetSnapshot ? (finance.budgetCostSnapshot || 0) : 0;

  const estimatedGrossProfit = finance.hasBudgetSnapshot ? contractValue - budgetCost : 0;
  const estimatedGrossMarginPercent = finance.hasBudgetSnapshot && contractValue > 0
    ? Math.round(((estimatedGrossProfit / contractValue) * 100) * 100) / 100
    : 0;

  const realizedGrossProfit = contractValue - totalActualExpense;
  const realizedGrossMarginPercent = contractValue > 0
    ? Math.round(((realizedGrossProfit / contractValue) * 100) * 100) / 100
    : 0;

  const netCashFlow = totalCollected - totalActualExpense;
  const costVariance = finance.hasBudgetSnapshot ? budgetCost - totalActualExpense : 0;

  return {
    ...finance,
    billingTerms: updatedTerms,
    invoices: updatedInvoices,
    totalInvoiced,
    totalCollected,
    outstandingReceivable,
    overdueReceivable,
    totalActualExpense,
    estimatedGrossProfit,
    estimatedGrossMarginPercent,
    realizedGrossProfit,
    realizedGrossMarginPercent,
    netCashFlow,
    costVariance,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Compute Budget vs Actual Cost breakdown by Category.
 * If hasBudgetSnapshot is false, sets hasBudget to false and status to 'No_Budget' without false over-budget triggers.
 */
export function getCategoryCostBudgets(finance: ProjectFinance): CategoryCostBudget[] {
  const categories: ExpenseCategory[] = ['Material', 'Labor', 'Equipment', 'Operational'];

  return categories.map((cat) => {
    let budgetAmount = 0;
    if (finance.hasBudgetSnapshot) {
      switch (cat) {
        case 'Material':
          budgetAmount = finance.categoryBudgetsSnapshot?.material || 0;
          break;
        case 'Labor':
          budgetAmount = finance.categoryBudgetsSnapshot?.labor || 0;
          break;
        case 'Equipment':
          budgetAmount = finance.categoryBudgetsSnapshot?.equipment || 0;
          break;
        case 'Operational':
          budgetAmount = finance.categoryBudgetsSnapshot?.operational || 0;
          break;
      }
    }

    const actualAmount = finance.expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const hasBudget = finance.hasBudgetSnapshot && budgetAmount > 0;
    const variance = hasBudget ? budgetAmount - actualAmount : 0;
    const variancePercent = hasBudget
      ? Math.round(((actualAmount / budgetAmount) * 100) * 10) / 10
      : 0;

    let status: 'Under_Budget' | 'On_Track' | 'Over_Budget' | 'No_Budget' = 'No_Budget';
    if (hasBudget) {
      if (actualAmount > budgetAmount) {
        status = 'Over_Budget';
      } else if (variancePercent <= 85) {
        status = 'Under_Budget';
      } else {
        status = 'On_Track';
      }
    }

    return {
      category: cat,
      budgetAmount,
      actualAmount,
      variance,
      variancePercent,
      status,
      hasBudget,
    };
  });
}

/**
 * Storage Engine Helpers
 */
export function getStoredProjectFinances(): ProjectFinance[] {
  if (typeof window === 'undefined') return INITIAL_FINANCES;
  try {
    const item = localStorage.getItem(FINANCE_STORAGE_KEY);
    if (!item) return INITIAL_FINANCES;
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? parsed : INITIAL_FINANCES;
  } catch (err) {
    console.error('Failed to load project finances from storage:', err);
    return INITIAL_FINANCES;
  }
}

export function saveStoredProjectFinances(finances: ProjectFinance[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(finances));
  } catch (err) {
    console.error('Failed to save project finances to storage:', err);
  }
}
