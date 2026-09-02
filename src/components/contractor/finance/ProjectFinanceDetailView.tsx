'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Plus, 
  Edit3, 
  Trash2, 
  DollarSign, 
  CreditCard, 
  FileText, 
  Receipt, 
  Building2, 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Send
} from 'lucide-react';
import { 
  ProjectFinance, 
  ContractorProject, 
  ProjectInvoice, 
  InvoicePayment, 
  ProjectExpense, 
  BillingTerm,
  ExpenseCategory 
} from '../../../types';
import { formatRupiah, formatIndonesianDate, formatFullIndonesianDate } from '../../../utils/helpers';
import { getCategoryCostBudgets } from '../../../data/contractorFinanceData';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { AddExpenseModal } from './AddExpenseModal';
import { ConfigureBillingModal } from './ConfigureBillingModal';
import { ConfirmModal } from '../../common/ConfirmModal';

interface ProjectFinanceDetailViewProps {
  finance: ProjectFinance;
  project: ContractorProject;
  onBack: () => void;
  onUpdateFinance: (updatedFinance: ProjectFinance) => void;
}

export const ProjectFinanceDetailView: React.FC<ProjectFinanceDetailViewProps> = ({
  finance,
  project,
  onBack,
  onUpdateFinance,
}) => {
  const [activeTab, setActiveTab] = useState<'billing' | 'expenses' | 'budget_vs_actual' | 'cashflow_pnl'>('billing');

  // Modals state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedTermForInvoice, setSelectedTermForInvoice] = useState<string | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState<ProjectInvoice | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<ProjectExpense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<ProjectExpense | null>(null);

  const [isConfigureBillingOpen, setIsConfigureBillingOpen] = useState(false);

  // Print mode state: 'invoice' | 'bap'
  const [printDocType, setPrintDocType] = useState<'invoice' | 'bap'>('invoice');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<ProjectInvoice | null>(
    finance.invoices[0] || null
  );

  const categoryBudgets = getCategoryCostBudgets(finance);

  // Print trigger
  const handlePrintDocument = (invoice: ProjectInvoice, type: 'invoice' | 'bap') => {
    setSelectedInvoiceForPrint(invoice);
    setPrintDocType(type);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.print();
      }
    }, 150);
  };

  // Handlers
  const handleSaveInvoice = (newInvoice: ProjectInvoice) => {
    const updatedInvoices = [newInvoice, ...finance.invoices];
    onUpdateFinance({
      ...finance,
      invoices: updatedInvoices,
    });
  };

  const handleRecordPayment = (
    paymentData: Omit<InvoicePayment, 'id' | 'projectId' | 'invoiceId' | 'invoiceNumber' | 'createdAt'>
  ) => {
    if (!invoiceToPay) return;

    const newPayment: InvoicePayment = {
      id: `pay-${Date.now()}`,
      projectId: finance.projectId,
      invoiceId: invoiceToPay.id,
      invoiceNumber: invoiceToPay.invoiceNumber,
      paymentDate: paymentData.paymentDate,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      referenceNumber: paymentData.referenceNumber,
      notes: paymentData.notes,
      createdAt: new Date().toISOString(),
    };

    const updatedPayments = [newPayment, ...finance.payments];
    onUpdateFinance({
      ...finance,
      payments: updatedPayments,
    });
    setInvoiceToPay(null);
  };

  const handleSaveExpense = (
    expenseData: Omit<ProjectExpense, 'id' | 'projectId' | 'createdAt'>,
    expenseId?: string
  ) => {
    let updatedExpenses = [...finance.expenses];

    if (expenseId) {
      const idx = updatedExpenses.findIndex((e) => e.id === expenseId);
      if (idx >= 0) {
        updatedExpenses[idx] = {
          ...updatedExpenses[idx],
          ...expenseData,
        };
      }
    } else {
      const newExp: ProjectExpense = {
        id: `exp-${Date.now()}`,
        projectId: finance.projectId,
        ...expenseData,
        createdAt: new Date().toISOString(),
      };
      updatedExpenses = [newExp, ...updatedExpenses];
    }

    onUpdateFinance({
      ...finance,
      expenses: updatedExpenses,
    });
    setExpenseToEdit(null);
  };

  const handleDeleteExpense = (expId: string) => {
    const updatedExpenses = finance.expenses.filter((e) => e.id !== expId);
    onUpdateFinance({
      ...finance,
      expenses: updatedExpenses,
    });
    setExpenseToDelete(null);
  };

  const handleSaveBillingTerms = (updatedTerms: BillingTerm[]) => {
    onUpdateFinance({
      ...finance,
      billingTerms: updatedTerms,
    });
  };

  const getInvoiceStatusBadge = (status: ProjectInvoice['status']) => {
    switch (status) {
      case 'Paid':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Lunas (Paid)' };
      case 'Partial':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Sebagian (Partial)' };
      case 'Overdue':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Jatuh Tempo (Overdue)' };
      case 'Issued':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Menunggu Bayar' };
      case 'Draft':
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Draft' };
      case 'Cancelled':
        return { bg: 'bg-slate-100 text-slate-500 border-slate-200', label: 'Dibatalkan' };
    }
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* 1. Top Navigation & Quick Actions Bar (Hidden when printing) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Keuangan</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Create Invoice Button */}
          <button
            onClick={() => {
              setSelectedTermForInvoice(null);
              setIsInvoiceModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>+ Terbitkan Invoice (BAP)</span>
          </button>

          {/* Add Expense Button */}
          <button
            onClick={() => {
              setExpenseToEdit(null);
              setIsExpenseModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            <span>+ Catat Pengeluaran</span>
          </button>

          {/* Configure Billing Terms */}
          <button
            onClick={() => setIsConfigureBillingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Atur Skema & Persentase Termin"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Atur Skema Termin</span>
          </button>
        </div>
      </div>

      {/* 2. Project Financial Overview Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {finance.projectNumber}
              </span>
              <span className="text-xs text-slate-500">
                Klien: <b className="text-slate-800">{finance.clientName}</b>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {finance.projectName}
            </h1>

            <p className="text-xs text-slate-500">
              Realisasi Fisik Lapangan: <b className="text-emerald-700">{project.currentProgressPercent}%</b> (Target Kurva S: {project.targetProgressPercent}%)
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1 shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Nilai Kontrak SPK (Gross)</span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900">
              {formatRupiah(finance.contractValueSnapshot)}
            </span>
            <span className="text-[11px] text-slate-400">
              Baseline Biaya RAB: {finance.hasBudgetSnapshot ? formatRupiah(finance.budgetCostSnapshot) : '— (Tanpa RAB)'}
            </span>
          </div>
        </div>

        {/* 4 Key Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Card 1: Invoicing */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tertagih (Invoiced)</span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-base sm:text-lg font-extrabold text-blue-700">
                {formatRupiah(finance.totalInvoiced)}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {finance.contractValueSnapshot > 0 ? Math.round((finance.totalInvoiced / finance.contractValueSnapshot) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{
                  width: `${finance.contractValueSnapshot > 0 ? Math.min(100, (finance.totalInvoiced / finance.contractValueSnapshot) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Card 2: Payments Collected */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Diterima (Collected)</span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-base sm:text-lg font-extrabold text-emerald-700">
                {formatRupiah(finance.totalCollected)}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {finance.totalInvoiced > 0 ? Math.round((finance.totalCollected / finance.totalInvoiced) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{
                  width: `${finance.totalInvoiced > 0 ? Math.min(100, (finance.totalCollected / finance.totalInvoiced) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Card 3: Actual Cost Incurred */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pengeluaran Lapangan</span>
            <span className="font-mono text-base sm:text-lg font-extrabold text-slate-900 block">
              {formatRupiah(finance.totalActualExpense)}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {finance.hasBudgetSnapshot ? `Sisa Budget RAB: ${formatRupiah(finance.costVariance)}` : 'Sisa Budget: — (Tanpa RAB)'}
            </span>
          </div>

          {/* Card 4: Net Cash Flow */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Cash Flow (Kas Proyek)</span>
            <div className="flex items-center gap-1.5">
              {finance.netCashFlow >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
              <span
                className={`font-mono text-base sm:text-lg font-extrabold ${
                  finance.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatRupiah(finance.netCashFlow)}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Margin Laba: <b>{finance.realizedGrossMarginPercent}%</b>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Sub-Tab Switcher Navigation (Hidden in print) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 print:hidden overflow-x-auto">
        {[
          { id: 'billing', label: `Termin & Invoice (${finance.invoices.length})`, icon: FileText },
          { id: 'expenses', label: `Pengeluaran Lapangan (${finance.expenses.length})`, icon: Receipt },
          { id: 'budget_vs_actual', label: 'Budget vs Realisasi (RAB)', icon: Layers },
          { id: 'cashflow_pnl', label: 'Arus Kas & Laba Rugi', icon: Wallet },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Contents */}

      {/* SUB-TAB 1: Billing Terms & Invoices */}
      {activeTab === 'billing' && (
        <div className="space-y-6 print:hidden">
          {/* A. Billing Schedule Cards */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Jadwal & Skema Termin Penagihan
                </h3>
                <p className="text-xs text-slate-500">
                  Tahapan penagihan kontraktual kepada klien berdasarkan capaian progres fisik
                </p>
              </div>

              <button
                onClick={() => setIsConfigureBillingOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
              >
                Ubah Skema
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {finance.billingTerms.map((term, idx) => {
                const isEligible = (project.currentProgressPercent || 0) >= (term.targetPhysicalProgressTrigger || 0);

                return (
                  <div
                    key={term.id}
                    className={`p-3.5 rounded-xl border space-y-2 text-xs transition-all ${
                      term.status === 'Paid'
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : term.status === 'Invoiced'
                        ? 'bg-blue-50/60 border-blue-300'
                        : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-[11px] text-slate-700">
                        #{idx + 1} {term.type}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                          term.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : term.status === 'Invoiced'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        {term.status === 'Paid' ? 'Lunas' : term.status === 'Invoiced' ? 'Tertagih' : 'Belum'}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 text-xs line-clamp-1">{term.label}</p>
                      <p className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                        {formatRupiah(term.amount)} ({term.percentage}%)
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 space-y-0.5">
                      <p>Syarat Fisik: <b>{term.targetPhysicalProgressTrigger}%</b></p>
                      {term.status === 'Unbilled' && (
                        <button
                          onClick={() => {
                            setSelectedTermForInvoice(term.id);
                            setIsInvoiceModalOpen(true);
                          }}
                          className={`w-full mt-1 px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                            isEligible
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          }`}
                        >
                          + Terbitkan Tagihan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Invoices List Table */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Daftar Surat Tagihan (Invoice & BAP)
                </h3>
                <p className="text-xs text-slate-500">
                  Dokumen invoice resmi penagihan termin beserta nomor Berita Acara Pembayaran (BAP)
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTermForInvoice(null);
                  setIsInvoiceModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tagihan Baru</span>
              </button>
            </div>

            {finance.invoices.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Belum ada invoice yang diterbitkan. Klik tombol di atas untuk menerbitkan tagihan termin.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">No. Invoice & BAP</th>
                      <th className="py-2.5 px-3">Uraian Tagihan</th>
                      <th className="py-2.5 px-3">Jatuh Tempo</th>
                      <th className="py-2.5 px-3 text-right">Total Tagihan</th>
                      <th className="py-2.5 px-3 text-right">Sudah Dibayar</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {finance.invoices.map((inv) => {
                      const badge = getInvoiceStatusBadge(inv.status);
                      const isUnpaid = inv.status !== 'Paid' && inv.status !== 'Cancelled';

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-slate-900 block">
                              {inv.invoiceNumber}
                            </span>
                            {inv.bapNumber && (
                              <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                                Ref: {inv.bapNumber} (Fisik {inv.physicalProgressClaimPercent}%)
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-900 block">{inv.title}</span>
                            <span className="text-[10px] text-slate-400">
                              Terbit: {formatIndonesianDate(inv.invoiceDate)}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-mono text-[11px]">
                            {formatIndonesianDate(inv.dueDate)}
                          </td>

                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                            {formatRupiah(inv.totalAmount)}
                          </td>

                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                            {formatRupiah(inv.paidAmount)}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.bg}`}>
                              {badge.label}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {isUnpaid && (
                                <button
                                  onClick={() => {
                                    setInvoiceToPay(inv);
                                    setIsPaymentModalOpen(true);
                                  }}
                                  className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors cursor-pointer"
                                  title="Catat Pembayaran Masuk"
                                >
                                  Bayar
                                </button>
                              )}

                              <button
                                onClick={() => handlePrintDocument(inv, 'invoice')}
                                className="p-1 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer"
                                title="Cetak Surat Invoice"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handlePrintDocument(inv, 'bap')}
                                className="px-1.5 py-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer"
                                title="Cetak Berita Acara Pembayaran (BAP)"
                              >
                                BAP
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Realized Field Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4 print:hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Catatan Pengeluaran Lapangan (Cash Out Realisasi)
              </h3>
              <p className="text-xs text-slate-500">
                Log riwayat nota material, upah tukang mingguan, sewa alat, dan operasional lapangan
              </p>
            </div>

            <button
              onClick={() => {
                setExpenseToEdit(null);
                setIsExpenseModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Catat Pengeluaran</span>
            </button>
          </div>

          {finance.expenses.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Belum ada pengeluaran yang dicatat. Klik tombol di atas untuk mencatat pengeluaran lapangan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Uraian Pengeluaran</th>
                    <th className="py-2.5 px-3">Vendor / Penerima</th>
                    <th className="py-2.5 px-3">Ref. Nota</th>
                    <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {finance.expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {formatIndonesianDate(exp.expenseDate)}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            exp.category === 'Material'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : exp.category === 'Labor'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : exp.category === 'Equipment'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {exp.category}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{exp.description}</span>
                        {exp.workCategory && (
                          <span className="text-[10px] text-slate-400">RAB: {exp.workCategory}</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-600">{exp.vendorOrPayee}</td>

                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {exp.referenceNumber || '—'}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(exp.amount)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setExpenseToEdit(exp);
                              setIsExpenseModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-900 rounded transition-colors"
                            title="Edit Pengeluaran"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setExpenseToDelete(exp)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Hapus Pengeluaran"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: Budget vs Actual Cost Breakdown */}
      {activeTab === 'budget_vs_actual' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4 print:hidden">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Kontrol Biaya: Anggaran RAB vs Realisasi Pengeluaran Lapangan
            </h3>
            <p className="text-xs text-slate-500">
              Perbandingan pagu anggaran RAB baseline terhadap total biaya yang telah dikeluarkan
            </p>
          </div>

          {!finance.hasBudgetSnapshot && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <b>Pagu Anggaran RAB Belum Tersedia:</b> Proyek ini diterbitkan tanpa rujukan dokumen RAB. Perbandingan budget vs realisasi dan status over-budget dinonaktifkan untuk mencegah estimasi fiktif.
              </span>
            </div>
          )}

          <div className="space-y-3">
            {categoryBudgets.map((cat) => {
              const isOver = cat.status === 'Over_Budget';
              const pctUsed = cat.hasBudget && cat.budgetAmount > 0
                ? Math.round((cat.actualAmount / cat.budgetAmount) * 100)
                : 0;

              return (
                <div
                  key={cat.category}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {cat.category === 'Material'
                            ? 'Material & Bahan Bangunan'
                            : cat.category === 'Labor'
                            ? 'Upah Mandor & Tenaga Kerja (Labor)'
                            : cat.category === 'Equipment'
                            ? 'Sewa Alat Berat & Mesin (Equipment)'
                            : 'Operasional Lapangan & Perizinan'}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            !cat.hasBudget
                              ? 'bg-slate-100 text-slate-600 border-slate-300'
                              : isOver
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {!cat.hasBudget
                            ? 'PAGU BELUM DIATUR'
                            : isOver
                            ? '⚠️ OVER BUDGET'
                            : '✓ ON TRACK'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Pagu Anggaran RAB: {cat.hasBudget ? formatRupiah(cat.budgetAmount) : '— (Tidak Ada RAB)'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Realisasi Terpakai
                        </span>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {formatRupiah(cat.actualAmount)} {cat.hasBudget ? `(${pctUsed}%)` : ''}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Sisa Anggaran
                        </span>
                        <span
                          className={`font-mono font-bold text-xs ${
                            !cat.hasBudget
                              ? 'text-slate-400 font-normal'
                              : cat.variance >= 0
                              ? 'text-emerald-700'
                              : 'text-rose-600'
                          }`}
                        >
                          {cat.hasBudget ? formatRupiah(cat.variance) : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {cat.hasBudget ? (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOver ? 'bg-rose-500' : pctUsed >= 80 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, pctUsed)}%` }}
                      />
                    </div>
                  ) : (
                    <div className="w-full bg-slate-100 rounded-full h-1.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Cash Flow & P&L Analysis */}
      {activeTab === 'cashflow_pnl' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-6 print:hidden">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              Laporan Arus Kas & Profitabilitas Proyek (P&L)
            </h3>
            <p className="text-xs text-slate-500">
              Analisis perbandingan penerimaan uang termin (Cash In) terhadap seluruh pengeluaran lapangan (Cash Out)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Laba Rugi Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Ringkasan Laba Kotor (Gross Profit)
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Nilai Kontrak SPK:</span>
                  <span className="font-mono font-bold text-slate-900">{formatRupiah(finance.contractValueSnapshot)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estimasi Biaya RAB:</span>
                  <span className="font-mono text-slate-700">
                    {finance.hasBudgetSnapshot ? formatRupiah(finance.budgetCostSnapshot) : '— (Tanpa RAB)'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="font-semibold text-slate-800">Estimasi Laba RAB:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {finance.hasBudgetSnapshot
                      ? `${formatRupiah(finance.estimatedGrossProfit)} (${finance.estimatedGrossMarginPercent}%)`
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="font-semibold text-slate-800">Realisasi Pengeluaran Aktual:</span>
                  <span className="font-mono font-bold text-rose-600">
                    -{formatRupiah(finance.totalActualExpense)}
                  </span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-900 pt-2 font-bold">
                  <span className="text-slate-900">Laba Kotor Realisasi Saat Ini:</span>
                  <span className="font-mono text-sm text-emerald-800">
                    {formatRupiah(finance.realizedGrossProfit)} ({finance.realizedGrossMarginPercent}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Arus Kas (Cash Flow) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Arus Kas Bersih Proyek (Net Cash Flow)
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Uang Masuk (Cash In):</span>
                  <span className="font-mono font-bold text-emerald-700">{formatRupiah(finance.totalCollected)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Uang Keluar (Cash Out):</span>
                  <span className="font-mono font-bold text-rose-600">-{formatRupiah(finance.totalActualExpense)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-900 pt-2 font-bold">
                  <span className="text-slate-900">Net Cash Flow:</span>
                  <span
                    className={`font-mono text-sm ${
                      finance.netCashFlow >= 0 ? 'text-emerald-800' : 'text-rose-600'
                    }`}
                  >
                    {formatRupiah(finance.netCashFlow)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-2">
                  {finance.netCashFlow >= 0
                    ? '✓ Kondisi kas proyek aman / surplus. Penerimaan termin mampu menutupi seluruh pengeluaran operasional.'
                    : '⚠️ Kondisi kas proyek defisit. Diperlukan penagihan termin segera kepada klien untuk menutupi pengeluaran material & upah.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Printable A4 Document View (Invoice or BAP) */}
      {selectedInvoiceForPrint && (
        <div className="hidden print:block bg-white p-8 max-w-4xl mx-auto space-y-6 text-slate-900 text-xs">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-base font-extrabold tracking-tight">PT DINAMIS KONSTRUKSI NUSANTARA</h1>
              <p className="text-[11px] text-slate-600">Jl. H.R. Rasuna Said Kav. 62, Setiabudi, Jakarta Selatan 12920</p>
              <p className="text-[10px] text-slate-500">Telp: +62 21 5299-8800 • Email: finance@dinamiskonstruksi.com</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold border border-slate-800 px-2 py-0.5 rounded">
                {printDocType === 'invoice' ? selectedInvoiceForPrint.invoiceNumber : selectedInvoiceForPrint.bapNumber}
              </span>
              <p className="text-[11px] pt-1">Ref. Proyek: {finance.projectNumber}</p>
              <p className="text-[10px] text-slate-500">
                {formatFullIndonesianDate(selectedInvoiceForPrint.invoiceDate)}
              </p>
            </div>
          </div>

          {printDocType === 'invoice' ? (
            /* --- INVOICE LAYOUT --- */
            <div className="space-y-5">
              <div className="text-center py-1">
                <h2 className="text-base font-extrabold uppercase underline">
                  SURAT TAGIHAN PEMBAYARAN (INVOICE)
                </h2>
                <p className="text-xs text-slate-600 font-mono">Nomor: {selectedInvoiceForPrint.invoiceNumber}</p>
              </div>

              {/* Client & Project Info */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ditujukan Kepada:</p>
                  <p className="font-bold text-sm">{selectedInvoiceForPrint.clientName}</p>
                  <p>{selectedInvoiceForPrint.clientPhone}</p>
                  <p>{selectedInvoiceForPrint.clientAddress}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Rincian Kontrak:</p>
                  <p>Nama Proyek: <b>{finance.projectName}</b></p>
                  <p>No. Kontrak/SPK: <b>{project.contractNumber}</b></p>
                  <p>Jatuh Tempo: <b>{formatIndonesianDate(selectedInvoiceForPrint.dueDate)}</b></p>
                </div>
              </div>

              {/* Invoice Item Table */}
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-semibold border-b border-slate-300">
                  <tr>
                    <th className="p-2.5 w-10 text-center">No</th>
                    <th className="p-2.5">Uraian Tagihan</th>
                    <th className="p-2.5 text-center">Progres Fisik</th>
                    <th className="p-2.5 text-right">Jumlah (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 text-center font-mono">1</td>
                    <td className="p-2.5">
                      <b>{selectedInvoiceForPrint.title}</b>
                      {selectedInvoiceForPrint.notes && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{selectedInvoiceForPrint.notes}</p>
                      )}
                    </td>
                    <td className="p-2.5 text-center font-mono">
                      {selectedInvoiceForPrint.physicalProgressClaimPercent}%
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold">
                      {formatRupiah(selectedInvoiceForPrint.amount)}
                    </td>
                  </tr>
                  {selectedInvoiceForPrint.taxAmount ? (
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right font-semibold">
                        PPN ({selectedInvoiceForPrint.taxRatePercent}%):
                      </td>
                      <td className="p-2.5 text-right font-mono">
                        {formatRupiah(selectedInvoiceForPrint.taxAmount)}
                      </td>
                    </tr>
                  ) : null}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="p-2.5 text-right text-xs uppercase">
                      Total Tagihan Pembayaran:
                    </td>
                    <td className="p-2.5 text-right font-mono text-sm">
                      {formatRupiah(selectedInvoiceForPrint.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Payment Details & Bank Transfer */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1">
                <p className="font-bold">Instruksi Pembayaran Bank Transfer:</p>
                <p className="font-mono text-xs">{selectedInvoiceForPrint.bankAccountInfo}</p>
                <p className="text-[10px] text-slate-500 pt-0.5">
                  Mohon sertakan nomor invoice pada berita transfer dan kirimkan bukti pembayaran kepada tim finance kami.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs">
                <div className="space-y-16">
                  <p>Diterima Oleh,<br /><b>Pemberi Tugas / Klien</b></p>
                  <p className="font-bold underline">{selectedInvoiceForPrint.clientName}</p>
                </div>
                <div className="space-y-16">
                  <p>Hormat Kami,<br /><b>PT Dinamis Konstruksi Nusantara</b></p>
                  <p className="font-bold underline">Finance & Project Director</p>
                </div>
              </div>
            </div>
          ) : (
            /* --- BAP (BERITA ACARA PEMBAYARAN) LAYOUT --- */
            <div className="space-y-5">
              <div className="text-center py-1">
                <h2 className="text-base font-extrabold uppercase underline">
                  BERITA ACARA PEMBAYARAN (BAP)
                </h2>
                <p className="text-xs text-slate-600 font-mono">Nomor: {selectedInvoiceForPrint.bapNumber}</p>
              </div>

              <p className="leading-relaxed">
                Pada hari ini, <b>{formatFullIndonesianDate(selectedInvoiceForPrint.invoiceDate)}</b>, kami yang bertanda tangan di bawah ini menyatakan bahwa pelaksanaan fisik proyek <b>{finance.projectName}</b> telah mencapai progres sebesar <b>{selectedInvoiceForPrint.physicalProgressClaimPercent}%</b> sesuai hasil opname bersama di lapangan.
              </p>

              {/* BAP Details Table */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <p>Pemberi Tugas (Klien): <b>{selectedInvoiceForPrint.clientName}</b></p>
                  <p>No. Kontrak / SPK: <b>{project.contractNumber}</b></p>
                  <p>Kontraktor Pelaksana: <b>PT Dinamis Konstruksi Nusantara</b></p>
                  <p>Nilai Kontrak: <b>{formatRupiah(finance.contractValueSnapshot)}</b></p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p>Uraian Pembayaran: <b>{selectedInvoiceForPrint.title}</b></p>
                  <p>Nominal Pembayaran Disetujui: <b className="font-mono text-sm">{formatRupiah(selectedInvoiceForPrint.totalAmount)}</b></p>
                </div>
              </div>

              <p className="leading-relaxed text-[11px] text-slate-600">
                Demikian Berita Acara Pembayaran ini dibuat dan disepakati bersama oleh kedua belah pihak dalam keadaan sadar untuk dipergunakan sebagai dasar penerbitan Surat Tagihan (Invoice).
              </p>

              {/* 2-Party Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs">
                <div className="space-y-16">
                  <p>Pihak Pertama (Pemberi Tugas),<br /><b>Klien / Owner Proyek</b></p>
                  <p className="font-bold underline">{selectedInvoiceForPrint.clientName}</p>
                </div>
                <div className="space-y-16">
                  <p>Pihak Kedua (Kontraktor),<br /><b>Site Manager / Lead Proyek</b></p>
                  <p className="font-bold underline">{project.siteManagerName || 'Pelaksana Proyek'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {isInvoiceModalOpen && (
        <CreateInvoiceModal
          isOpen={true}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedTermForInvoice(null);
          }}
          finance={finance}
          project={project}
          preSelectedTermId={selectedTermForInvoice}
          onSave={handleSaveInvoice}
        />
      )}

      {isPaymentModalOpen && invoiceToPay && (
        <RecordPaymentModal
          isOpen={true}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setInvoiceToPay(null);
          }}
          invoice={invoiceToPay}
          onSave={handleRecordPayment}
        />
      )}

      {isExpenseModalOpen && (
        <AddExpenseModal
          isOpen={true}
          onClose={() => {
            setIsExpenseModalOpen(false);
            setExpenseToEdit(null);
          }}
          projectId={finance.projectId}
          existingExpenseToEdit={expenseToEdit}
          onSave={handleSaveExpense}
        />
      )}

      {isConfigureBillingOpen && (
        <ConfigureBillingModal
          isOpen={true}
          onClose={() => setIsConfigureBillingOpen(false)}
          contractValue={finance.contractValueSnapshot}
          existingTerms={finance.billingTerms}
          onSave={handleSaveBillingTerms}
        />
      )}

      {expenseToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setExpenseToDelete(null)}
          title="Hapus Pengeluaran Lapangan?"
          message={`Apakah Anda yakin ingin menghapus catatan pengeluaran "${expenseToDelete.description}" senilai ${formatRupiah(expenseToDelete.amount)}?`}
          confirmText="Ya, Hapus Pengeluaran"
          onConfirm={() => handleDeleteExpense(expenseToDelete.id)}
        />
      )}
    </div>
  );
};
