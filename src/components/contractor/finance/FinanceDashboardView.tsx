'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Building2, 
  User, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileText,
  Layers,
  Sparkles,
  Wallet
} from 'lucide-react';
import { ProjectFinance, ContractorProject } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import { StatCard } from '../../common/StatCard';
import { EmptyState } from '../../common/EmptyState';

interface FinanceDashboardViewProps {
  finances: ProjectFinance[];
  projects: ContractorProject[];
  onSelectProjectFinance: (finance: ProjectFinance) => void;
  onNavigateToProjects: () => void;
}

export const FinanceDashboardView: React.FC<FinanceDashboardViewProps> = ({
  finances,
  projects,
  onSelectProjectFinance,
  onNavigateToProjects,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'profitable' | 'overdue' | 'cash_positive'>('all');

  // Filter logic
  const filteredFinances = finances.filter((f) => {
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchNum = f.projectNumber.toLowerCase().includes(term);
      const matchProj = f.projectName.toLowerCase().includes(term);
      const matchClient = f.clientName.toLowerCase().includes(term);
      if (!matchNum && !matchProj && !matchClient) return false;
    }

    if (statusFilter === 'overdue' && f.overdueReceivable <= 0) return false;
    if (statusFilter === 'cash_positive' && f.netCashFlow <= 0) return false;
    if (statusFilter === 'profitable' && f.realizedGrossProfit <= 0) return false;

    return true;
  });

  // Aggregated KPIs
  const totalContract = finances.reduce((sum, f) => sum + (f.contractValueSnapshot || 0), 0);
  const totalInvoiced = finances.reduce((sum, f) => sum + (f.totalInvoiced || 0), 0);
  const totalCollected = finances.reduce((sum, f) => sum + (f.totalCollected || 0), 0);
  const totalOutstanding = finances.reduce((sum, f) => sum + (f.outstandingReceivable || 0), 0);
  const totalOverdue = finances.reduce((sum, f) => sum + (f.overdueReceivable || 0), 0);
  const totalExpense = finances.reduce((sum, f) => sum + (f.totalActualExpense || 0), 0);
  const totalEstimatedProfit = finances.reduce((sum, f) => sum + (f.estimatedGrossProfit || 0), 0);
  const totalNetCashFlow = finances.reduce((sum, f) => sum + (f.netCashFlow || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Keuangan Proyek & Termin Penagihan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring arus kas, penagihan termin (BAP / Invoice), realisasi biaya lapangan vs RAB, dan margin laba kotor
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToProjects}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>Lihat Proyek Aktif ({projects.length})</span>
        </button>
      </div>

      {/* 2. Top 8 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Nilai Kontrak"
          value={formatRupiah(totalContract)}
          subtitle="Akumulasi seluruh SPK"
          icon={DollarSign}
          iconColor="text-slate-800"
          iconBg="bg-slate-100"
        />
        <StatCard
          title="Total Tertagih (Invoiced)"
          value={formatRupiah(totalInvoiced)}
          subtitle={`${totalContract > 0 ? Math.round((totalInvoiced / totalContract) * 100) : 0}% dari kontrak`}
          icon={FileText}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Total Diterima (Collected)"
          value={formatRupiah(totalCollected)}
          subtitle={`${totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0}% terbayar`}
          icon={CreditCard}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />
        <StatCard
          title="Sisa Piutang Berjalan"
          value={formatRupiah(totalOutstanding)}
          subtitle={totalOverdue > 0 ? `Overdue: ${formatRupiah(totalOverdue)}` : 'Semua piutang lancar'}
          icon={Clock}
          iconColor={totalOverdue > 0 ? 'text-rose-700' : 'text-amber-700'}
          iconBg={totalOverdue > 0 ? 'bg-rose-100' : 'bg-amber-100'}
        />

        <StatCard
          title="Realisasi Biaya (Actual Cost)"
          value={formatRupiah(totalExpense)}
          subtitle="Pengeluaran fisik lapangan"
          icon={Receipt}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Estimasi Laba RAB"
          value={formatRupiah(totalEstimatedProfit)}
          subtitle="Target gross profit"
          icon={TrendingUp}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />
        <StatCard
          title="Net Cash Flow Proyek"
          value={formatRupiah(totalNetCashFlow)}
          subtitle="Total Masuk - Total Keluar"
          icon={Wallet}
          iconColor={totalNetCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}
          iconBg={totalNetCashFlow >= 0 ? 'bg-emerald-100' : 'bg-rose-100'}
        />
        <StatCard
          title="Piutang Jatuh Tempo"
          value={formatRupiah(totalOverdue)}
          subtitle="Perlu penagihan segera"
          icon={AlertTriangle}
          iconColor="text-rose-700"
          iconBg="bg-rose-100"
        />
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor proyek, proyek, atau klien..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/60 shrink-0 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Proyek' },
              { id: 'profitable', label: 'Laba Positif' },
              { id: 'cash_positive', label: 'Cash Flow +' },
              { id: 'overdue', label: 'Ada Overdue' },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Projects Finance Table / Cards */}
      {filteredFinances.length === 0 ? (
        <EmptyState
          title={search ? 'Data keuangan tidak ditemukan' : 'Belum ada Data Keuangan Proyek'}
          description={
            search
              ? 'Tidak ada proyek yang sesuai dengan kriteria pencarian keuangan.'
              : 'Data keuangan otomatis terbuat ketika proyek konstruksi aktif diterbitkan dari SPH yang telah disetujui.'
          }
          actionText="Buka Modul Proyek"
          onAction={onNavigateToProjects}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Proyek & Klien</th>
                  <th className="py-3 px-4 text-right">Nilai Kontrak</th>
                  <th className="py-3 px-4">Progress Penagihan (Invoiced)</th>
                  <th className="py-3 px-4">Penerimaan (Collected)</th>
                  <th className="py-3 px-4 text-right">Pengeluaran Lapangan</th>
                  <th className="py-3 px-4 text-right">Net Cash Flow</th>
                  <th className="py-3 px-4 text-right">Gross Margin %</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFinances.map((f) => {
                  const invoicedPct = f.contractValueSnapshot > 0
                    ? Math.round((f.totalInvoiced / f.contractValueSnapshot) * 100)
                    : 0;
                  const collectedPct = f.totalInvoiced > 0
                    ? Math.round((f.totalCollected / f.totalInvoiced) * 100)
                    : 0;

                  return (
                    <tr
                      key={f.id}
                      onClick={() => onSelectProjectFinance(f)}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    >
                      {/* Project & Client */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                          {f.projectNumber}
                        </span>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{f.projectName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Klien: {f.clientName}
                        </div>
                      </td>

                      {/* Contract Value */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono font-bold text-slate-900 text-xs block">
                          {formatRupiah(f.contractValueSnapshot)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          RAB: {f.hasBudgetSnapshot ? formatRupiah(f.budgetCostSnapshot) : '—'}
                        </span>
                      </td>

                      {/* Invoicing Progress */}
                      <td className="py-3.5 px-4 min-w-[170px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-600 font-semibold">{formatRupiah(f.totalInvoiced)}</span>
                            <span className="font-bold text-blue-700">{invoicedPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, invoicedPct)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {f.invoices.length} Invoice diterbitkan
                          </span>
                        </div>
                      </td>

                      {/* Payment Collected */}
                      <td className="py-3.5 px-4 min-w-[170px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-600 font-semibold">{formatRupiah(f.totalCollected)}</span>
                            <span className="font-bold text-emerald-700">{collectedPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, collectedPct)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            Sisa Piutang: {formatRupiah(f.outstandingReceivable)}
                          </span>
                        </div>
                      </td>

                      {/* Actual Expense */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-slate-900 text-xs block">
                          {formatRupiah(f.totalActualExpense)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {f.expenses.length} Catatan Biaya
                        </span>
                      </td>

                      {/* Net Cash Flow */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <span
                          className={`text-xs block ${
                            f.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {formatRupiah(f.netCashFlow)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {f.netCashFlow >= 0 ? 'Surplus' : 'Defisit Kas'}
                        </span>
                      </td>

                      {/* Margin % */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] inline-block ${
                            f.realizedGrossMarginPercent >= 15
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : f.realizedGrossMarginPercent > 0
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {f.realizedGrossMarginPercent}%
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onSelectProjectFinance(f)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Buka</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
