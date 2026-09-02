'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  CreditCard,
  FileText
} from 'lucide-react';
import { ProjectFinance, AgingBucket, CollectionStatus, ReceivablesInvoiceItem } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import { getReceivablesInvoices, getPortfolioFinancialHealthSummary } from '../../../data/contractorFinanceIntelligence';

interface ReceivablesAgingViewProps {
  finances: ProjectFinance[];
  onSelectProjectFinance: (finance: ProjectFinance) => void;
  onOpenPaymentForInvoice?: (finance: ProjectFinance, invoiceId: string) => void;
}

export const ReceivablesAgingView: React.FC<ReceivablesAgingViewProps> = ({
  finances,
  onSelectProjectFinance,
  onOpenPaymentForInvoice,
}) => {
  const [filterBucket, setFilterBucket] = useState<'ALL' | AgingBucket>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | CollectionStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const allReceivables = useMemo(() => getReceivablesInvoices(finances, todayStr), [finances, todayStr]);
  const portfolioSummary = useMemo(() => getPortfolioFinancialHealthSummary(finances, todayStr), [finances, todayStr]);

  const filteredReceivables = useMemo(() => {
    return allReceivables.filter((item) => {
      const matchBucket = filterBucket === 'ALL' || item.agingBucket === filterBucket;
      const matchStatus = filterStatus === 'ALL' || item.collectionStatus === filterStatus;
      const matchSearch =
        item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.clientPhone && item.clientPhone.includes(searchQuery));

      return matchBucket && matchStatus && matchSearch;
    });
  }, [allReceivables, filterBucket, filterStatus, searchQuery]);

  const getStatusBadge = (status: CollectionStatus) => {
    switch (status) {
      case 'OVERDUE':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'JATUH TEMPO (OVERDUE)' };
      case 'DUE_TODAY':
        return { bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold', label: 'JATUH TEMPO HARI INI' };
      case 'DUE_SOON':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'JATUH TEMPO SEGERA (≤7 HARI)' };
      case 'NOT_DUE':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'BELUM JATUH TEMPO (CURRENT)' };
      case 'DUE_DATE_UNKNOWN':
        return { bg: 'bg-slate-100 text-slate-700 border-slate-300', label: 'TANGGAL BELUM DIATUR' };
      case 'PAID':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'LUNAS' };
    }
  };

  const getAgingBucketLabel = (bucket: AgingBucket) => {
    switch (bucket) {
      case 'CURRENT':
        return 'Lancar (Current)';
      case '1_30_DAYS':
        return '1–30 Hari';
      case '31_60_DAYS':
        return '31–60 Hari';
      case '61_90_DAYS':
        return '61–90 Hari';
      case 'OVER_90_DAYS':
        return '>90 Hari (Macet)';
      case 'DUE_DATE_UNKNOWN':
        return 'Tanggal Belum Diatur';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Aging Buckets Matrix Cards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Matriks Penuaan Piutang (Receivables Aging Matrix)
          </h3>
          <p className="text-xs text-slate-500">
            Klasifikasi sisa tagihan belum terbayar berdasarkan hari keterlambatan (Days Overdue)
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Current */}
          <button
            onClick={() => setFilterBucket(filterBucket === 'CURRENT' ? 'ALL' : 'CURRENT')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              filterBucket === 'CURRENT'
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
                : 'bg-slate-50 hover:bg-emerald-50/40 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Lancar (Current)</span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-slate-900 block mt-1">
              {formatRupiah(portfolioSummary.agingSummary.CURRENT.totalOutstanding)}
            </span>
            <span className="text-[10px] text-slate-500">
              {portfolioSummary.agingSummary.CURRENT.count} invoice
            </span>
          </button>

          {/* 1-30 Days */}
          <button
            onClick={() => setFilterBucket(filterBucket === '1_30_DAYS' ? 'ALL' : '1_30_DAYS')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              filterBucket === '1_30_DAYS'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20'
                : 'bg-slate-50 hover:bg-amber-50/40 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-800 uppercase block">1–30 Hari</span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-amber-700 block mt-1">
              {formatRupiah(portfolioSummary.agingSummary['1_30_DAYS'].totalOutstanding)}
            </span>
            <span className="text-[10px] text-slate-500">
              {portfolioSummary.agingSummary['1_30_DAYS'].count} invoice
            </span>
          </button>

          {/* 31-60 Days */}
          <button
            onClick={() => setFilterBucket(filterBucket === '31_60_DAYS' ? 'ALL' : '31_60_DAYS')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              filterBucket === '31_60_DAYS'
                ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-400/20'
                : 'bg-slate-50 hover:bg-orange-50/40 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-orange-800 uppercase block">31–60 Hari</span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-orange-700 block mt-1">
              {formatRupiah(portfolioSummary.agingSummary['31_60_DAYS'].totalOutstanding)}
            </span>
            <span className="text-[10px] text-slate-500">
              {portfolioSummary.agingSummary['31_60_DAYS'].count} invoice
            </span>
          </button>

          {/* 61-90 Days */}
          <button
            onClick={() => setFilterBucket(filterBucket === '61_90_DAYS' ? 'ALL' : '61_90_DAYS')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              filterBucket === '61_90_DAYS'
                ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20'
                : 'bg-slate-50 hover:bg-rose-50/40 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-rose-800 uppercase block">61–90 Hari</span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-rose-700 block mt-1">
              {formatRupiah(portfolioSummary.agingSummary['61_90_DAYS'].totalOutstanding)}
            </span>
            <span className="text-[10px] text-slate-500">
              {portfolioSummary.agingSummary['61_90_DAYS'].count} invoice
            </span>
          </button>

          {/* >90 Days */}
          <button
            onClick={() => setFilterBucket(filterBucket === 'OVER_90_DAYS' ? 'ALL' : 'OVER_90_DAYS')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              filterBucket === 'OVER_90_DAYS'
                ? 'bg-rose-100 border-rose-500 ring-2 ring-rose-500/20'
                : 'bg-slate-50 hover:bg-rose-100/50 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-rose-950 uppercase block">&gt;90 Hari (Macet)</span>
            <span className="font-mono text-sm sm:text-base font-black text-rose-800 block mt-1">
              {formatRupiah(portfolioSummary.agingSummary.OVER_90_DAYS.totalOutstanding)}
            </span>
            <span className="text-[10px] text-slate-500">
              {portfolioSummary.agingSummary.OVER_90_DAYS.count} invoice
            </span>
          </button>

          {/* Unknown */}
          <button
            onClick={() => setFilterBucket(filterBucket === 'DUE_DATE_UNKNOWN' ? 'ALL' : 'DUE_DATE_UNKNOWN')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              filterBucket === 'DUE_DATE_UNKNOWN'
                ? 'bg-slate-200 border-slate-400 ring-2 ring-slate-400/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-700 uppercase block">Tanpa Due Date</span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-slate-800 block mt-1">
              {formatRupiah(portfolioSummary.agingSummary.DUE_DATE_UNKNOWN.totalOutstanding)}
            </span>
            <span className="text-[10px] text-slate-500">
              {portfolioSummary.agingSummary.DUE_DATE_UNKNOWN.count} invoice
            </span>
          </button>
        </div>
      </div>

      {/* 2. Priority Collection Action Queue */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Antrean Aksi Penagihan (Priority Collection Action Queue)
            </h3>
            <p className="text-xs text-slate-500">
              Daftar seluruh invoice belum lunas diurutkan berdasarkan tingkat urgensi penagihan tertinggi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari invoice / proyek..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-600 w-44 sm:w-56"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-600 font-semibold"
            >
              <option value="ALL">Semua Status</option>
              <option value="OVERDUE">Jatuh Tempo (Overdue)</option>
              <option value="DUE_TODAY">Jatuh Tempo Hari Ini</option>
              <option value="DUE_SOON">Jatuh Tempo Segera (≤7 Hari)</option>
              <option value="NOT_DUE">Belum Jatuh Tempo</option>
            </select>

            {(filterBucket !== 'ALL' || filterStatus !== 'ALL') && (
              <button
                onClick={() => {
                  setFilterBucket('ALL');
                  setFilterStatus('ALL');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline px-1.5 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {filteredReceivables.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
            Tidak ada piutang yang memerlukan penagihan sesuai kriteria filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-2.5 px-3 text-center">Prioritas</th>
                  <th className="py-2.5 px-3">Invoice & Proyek</th>
                  <th className="py-2.5 px-3">Klien & Kontak</th>
                  <th className="py-2.5 px-3">Jatuh Tempo</th>
                  <th className="py-2.5 px-3 text-right">Hari Telat</th>
                  <th className="py-2.5 px-3 text-right">Sisa Piutang</th>
                  <th className="py-2.5 px-3 text-center">Status Penagihan</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredReceivables.map((item) => {
                  const statusBadge = getStatusBadge(item.collectionStatus);
                  const parentFinance = finances.find((f) => f.projectId === item.projectId);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            item.priorityScore <= 2
                              ? 'bg-rose-600 text-white'
                              : item.priorityScore <= 4
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : item.priorityScore <= 6
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          P{item.priorityScore}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] font-bold text-slate-900 block">
                          {item.invoiceNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                          {item.projectName} ({item.projectNumber})
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.title}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 text-xs">
                          {item.clientName}
                        </div>
                        {item.clientPhone ? (
                          <a
                            href={`https://wa.me/${item.clientPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-900 font-mono mt-0.5 hover:underline"
                            title="Hubungi via WhatsApp"
                          >
                            <Phone className="w-2.5 h-2.5" />
                            <span>{item.clientPhone}</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-xs">
                        {item.hasValidDueDate ? (
                          <span className={item.collectionStatus === 'OVERDUE' ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                            {item.dueDate}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Belum diset</span>
                        )}
                        <span className="text-[10px] text-slate-400 block">
                          Terbit: {item.invoiceDate}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        {item.hasValidDueDate && item.daysOverdue > 0 ? (
                          <span className="font-bold text-rose-600 text-xs block">
                            +{item.daysOverdue} hari
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs block">0 hari</span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          Usia: {item.invoiceAge} hari
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        <span className="font-extrabold text-sm text-slate-900 block">
                          {formatRupiah(item.outstandingAmount)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          dari {formatRupiah(item.totalAmount)}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {getAgingBucketLabel(item.agingBucket)}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {parentFinance && (
                            <button
                              type="button"
                              onClick={() => onSelectProjectFinance(parentFinance)}
                              className="p-1.5 text-xs text-slate-600 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50 rounded border border-slate-200 transition-colors cursor-pointer"
                              title="Buka Halaman Keuangan Proyek"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
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
  );
};
