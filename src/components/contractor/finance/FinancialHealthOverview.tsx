'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Building2,
  ChevronRight,
  Wallet,
  DollarSign,
  ArrowDownRight,
  Clock,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { ProjectFinance, FinancialHealthStatus } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import {
  analyzeProjectFinancialHealth,
  getPortfolioFinancialHealthSummary
} from '../../../data/contractorFinanceIntelligence';

interface FinancialHealthOverviewProps {
  finances: ProjectFinance[];
  onSelectProjectFinance: (finance: ProjectFinance) => void;
}

export const FinancialHealthOverview: React.FC<FinancialHealthOverviewProps> = ({
  finances,
  onSelectProjectFinance,
}) => {
  const [filterHealth, setFilterHealth] = useState<'ALL' | FinancialHealthStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const summary = useMemo(() => {
    return getPortfolioFinancialHealthSummary(finances);
  }, [finances]);

  const analyzedProjects = useMemo(() => {
    return finances.map((f) => ({
      finance: f,
      analysis: analyzeProjectFinancialHealth(f),
    }));
  }, [finances]);

  const filteredProjects = useMemo(() => {
    return analyzedProjects.filter(({ finance, analysis }) => {
      const matchHealth = filterHealth === 'ALL' || analysis.healthStatus === filterHealth;
      const matchSearch =
        finance.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finance.projectNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finance.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchHealth && matchSearch;
    });
  }, [analyzedProjects, filterHealth, searchQuery]);

  const getHealthBadge = (status: FinancialHealthStatus) => {
    switch (status) {
      case 'HEALTHY':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
          label: 'SEHAT (HEALTHY)',
        };
      case 'ATTENTION':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
          label: 'PERLU PERHATIAN',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
          label: 'KRITIS (CRITICAL)',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Portfolio KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Nilai Kontrak</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="font-mono text-xl font-extrabold text-slate-900">
            {formatRupiah(summary.totalContractValue)}
          </p>
          <span className="text-[10px] text-slate-500 block">
            {summary.totalProjects} Proyek aktif berjalan
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Tertagih (Invoiced)</span>
            <Wallet className="w-4 h-4 text-blue-500" />
          </div>
          <p className="font-mono text-xl font-extrabold text-blue-700">
            {formatRupiah(summary.totalInvoiced)}
          </p>
          <span className="text-[10px] text-slate-500 block">
            {summary.totalContractValue > 0
              ? Math.round((summary.totalInvoiced / summary.totalContractValue) * 100)
              : 0}% dari total kontrak SPK
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Penerimaan Kas (Collected)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-mono text-xl font-extrabold text-emerald-700">
            {formatRupiah(summary.totalCollected)}
          </p>
          <span className="text-[10px] text-slate-500 block">
            {summary.totalInvoiced > 0
              ? Math.round((summary.totalCollected / summary.totalInvoiced) * 100)
              : 0}% dari total tagihan
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sisa Piutang (Receivables)</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-mono text-xl font-extrabold text-amber-700">
            {formatRupiah(summary.totalOutstanding)}
          </p>
          <span className="text-[10px] text-rose-600 font-semibold block">
            {summary.totalOverdueReceivable > 0
              ? `${formatRupiah(summary.totalOverdueReceivable)} jatuh tempo`
              : 'Semua tagihan on-schedule'}
          </span>
        </div>
      </div>

      {/* 2. Portfolio Health Radar Summary */}
      <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Radar Kesehatan Finansial Proyek (Financial Health Radar)
            </h3>
            <p className="text-xs text-slate-500">
              Klasifikasi kesehatan portofolio berdasarkan realisasi laba kotor, arus kas bersih, jatuh tempo piutang, dan pagu RAB
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-slate-600">Rata-rata Margin Portofolio:</span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {summary.portfolioMarginPercent}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Healthy Card */}
          <button
            onClick={() => setFilterHealth(filterHealth === 'HEALTHY' ? 'ALL' : 'HEALTHY')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              filterHealth === 'HEALTHY'
                ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20'
                : 'bg-slate-50 hover:bg-emerald-50/40 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Proyek Sehat
              </span>
              <span className="font-mono text-lg font-black text-emerald-800">
                {summary.healthyProjectsCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Margin laba $\ge 10\%$, kas aman/surplus, tidak ada piutang macet, dan biaya dalam pagu RAB.
            </p>
          </button>

          {/* Attention Card */}
          <button
            onClick={() => setFilterHealth(filterHealth === 'ATTENTION' ? 'ALL' : 'ATTENTION')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              filterHealth === 'ATTENTION'
                ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20'
                : 'bg-slate-50 hover:bg-amber-50/40 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Perlu Perhatian
              </span>
              <span className="font-mono text-lg font-black text-amber-800">
                {summary.attentionProjectsCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Terdapat tagihan jatuh tempo (1-30 hari), margin tipis (&lt;10%), kas defisit, atau biaya mendekati pagu.
            </p>
          </button>

          {/* Critical Card */}
          <button
            onClick={() => setFilterHealth(filterHealth === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              filterHealth === 'CRITICAL'
                ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-400/20'
                : 'bg-slate-50 hover:bg-rose-50/40 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                Risiko Kritis
              </span>
              <span className="font-mono text-lg font-black text-rose-800">
                {summary.criticalProjectsCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Laba kotor negatif (rugi), piutang macet &gt;30 hari, atau pengeluaran melebihi 105% pagu RAB.
            </p>
          </button>
        </div>
      </div>

      {/* 3. Project Health Evaluation Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              Evaluasi Finansial Proyek ({filteredProjects.length})
            </h3>
            <p className="text-xs text-slate-500">
              Daftar status kesehatan tiap proyek kontraktor beserta rincian diagnosis dan tindakan prioritas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proyek / klien..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-600 w-48 sm:w-64"
              />
            </div>

            {filterHealth !== 'ALL' && (
              <button
                onClick={() => setFilterHealth('ALL')}
                className="text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
            Tidak ada proyek yang sesuai dengan kriteria filter kesehatan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Status Kesehatan</th>
                  <th className="py-2.5 px-3">Proyek & Klien</th>
                  <th className="py-2.5 px-3 text-right">Nilai Kontrak</th>
                  <th className="py-2.5 px-3 text-right">Laba Realisasi</th>
                  <th className="py-2.5 px-3 text-right">Piutang Macet</th>
                  <th className="py-2.5 px-3 text-right">Arus Kas (Net)</th>
                  <th className="py-2.5 px-3">Diagnosis & Risiko</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.map(({ finance, analysis }) => {
                  const badge = getHealthBadge(analysis.healthStatus);

                  return (
                    <tr
                      key={finance.id}
                      onClick={() => onSelectProjectFinance(finance)}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block mb-0.5">
                          {finance.projectNumber}
                        </span>
                        <div className="font-bold text-slate-900 text-xs">
                          {finance.projectName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Klien: {finance.clientName}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(finance.contractValueSnapshot)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        <span className={`font-bold block ${analysis.realizedGrossProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {formatRupiah(analysis.realizedGrossProfit)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Margin: {analysis.realizedGrossMarginPercent}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        {analysis.overdueReceivable > 0 ? (
                          <>
                            <span className="font-bold text-rose-600 block">
                              {formatRupiah(analysis.overdueReceivable)}
                            </span>
                            <span className="text-[10px] text-rose-500 font-semibold">
                              {analysis.oldestOverdueDays} hari telat
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-medium">Rp 0 (Lancar)</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        <span className={`font-bold ${analysis.netCashFlow >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>
                          {formatRupiah(analysis.netCashFlow)}
                        </span>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        {analysis.healthReasons.length === 0 ? (
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Kondisi finansial optimal
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            {analysis.healthReasons.map((r, idx) => (
                              <div key={idx} className="text-[10px] text-slate-600 flex items-start gap-1">
                                <span className="text-amber-500 leading-tight">•</span>
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          className="p-1 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
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
  );
};
