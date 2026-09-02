'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  Building2,
  User,
  MapPin,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  Send,
  XCircle,
  AlertTriangle,
  Phone
} from 'lucide-react';
import { Quotation, QuotationStatus, RAB } from '../../../types';
import { formatRupiah, formatIndonesianDate } from '../../../utils/helpers';
import { StatCard } from '../../common/StatCard';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { CreateQuotationModal } from './CreateQuotationModal';
import { EditQuotationModal } from './EditQuotationModal';

interface QuotationListViewProps {
  quotations: Quotation[];
  rabs: RAB[];
  onSelectQuotation: (quotation: Quotation) => void;
  onCreateQuotation: (newQuotation: Quotation) => void;
  onUpdateQuotation: (id: string, updatedData: Partial<Quotation>) => void;
  onDeleteQuotation: (id: string) => void;
}

export const QuotationListView: React.FC<QuotationListViewProps> = ({
  quotations,
  rabs,
  onSelectQuotation,
  onCreateQuotation,
  onUpdateQuotation,
  onDeleteQuotation,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [quotationToEdit, setQuotationToEdit] = useState<Quotation | null>(null);
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null);

  // Filter Logic
  const filteredQuotations = quotations.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchNum = q.quotationNumber.toLowerCase().includes(term);
      const matchProj = q.projectName.toLowerCase().includes(term);
      const matchClient = q.clientName.toLowerCase().includes(term);
      const matchLoc = q.projectLocation.toLowerCase().includes(term);
      const matchRab = q.rabNumber.toLowerCase().includes(term);
      if (!matchNum && !matchProj && !matchClient && !matchLoc && !matchRab) return false;
    }
    return true;
  });

  // KPI Metrics
  const totalCount = quotations.length;
  const draftCount = quotations.filter((q) => q.status === 'Draft').length;
  const sentCount = quotations.filter((q) => q.status === 'Sent').length;
  const acceptedCount = quotations.filter((q) => q.status === 'Accepted').length;
  const totalValue = quotations.reduce((acc, q) => acc + (q.grandTotal || 0), 0);

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'Draft':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock,
          label: 'Draft',
        };
      case 'Sent':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Send,
          label: 'Terkirim',
        };
      case 'Accepted':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          label: 'Disetujui',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
          label: 'Ditolak',
        };
      case 'Expired':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: AlertTriangle,
          label: 'Expired',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Surat Penawaran Harga (SPH)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Penerbitan dokumen penawaran harga komersial resmi berbasis snapshot RAB yang telah disetujui
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan SPH Baru</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Dokumen SPH"
          value={totalCount}
          subtitle="Seluruh penawaran"
          icon={FileText}
          iconColor="text-slate-700"
          iconBg="bg-slate-100"
        />
        <StatCard
          title="SPH Draft"
          value={draftCount}
          subtitle="Penyusunan tim"
          icon={Clock}
          iconColor="text-amber-700"
          iconBg="bg-amber-100"
        />
        <StatCard
          title="SPH Terkirim"
          value={sentCount}
          subtitle="Menunggu respon"
          icon={Send}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="SPH Disetujui (Deal)"
          value={acceptedCount}
          subtitle="Siap terbit SPK"
          icon={CheckCircle2}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />
        <StatCard
          title="Total Nilai Penawaran"
          value={formatRupiah(totalValue)}
          subtitle="Akumulasi penawaran"
          icon={Sparkles}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
      </div>

      {/* 3. Search Bar & Status Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor SPH, nomor RAB, proyek, klien, atau lokasi..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/60 shrink-0 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua', count: totalCount },
              { id: 'Draft', label: 'Draft', count: draftCount },
              { id: 'Sent', label: 'Terkirim', count: sentCount },
              { id: 'Accepted', label: 'Disetujui', count: acceptedCount },
              { id: 'Rejected', label: 'Ditolak', count: quotations.filter((q) => q.status === 'Rejected').length },
              { id: 'Expired', label: 'Expired', count: quotations.filter((q) => q.status === 'Expired').length },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}{' '}
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Table / Cards View */}
      {filteredQuotations.length === 0 ? (
        <EmptyState
          title={search ? 'Penawaran tidak ditemukan' : 'Belum ada Surat Penawaran Harga'}
          description={
            search
              ? 'Tidak ada dokumen SPH yang sesuai dengan kriteria pencarian.'
              : 'Terbitkan Surat Penawaran Harga (SPH) resmi dari dokumen RAB yang telah berstatus FINAL.'
          }
          actionText="+ Buat SPH Pertama"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. SPH & Proyek</th>
                  <th className="py-3 px-4">Klien & Kontak</th>
                  <th className="py-3 px-4">Tanggal & Validitas</th>
                  <th className="py-3 px-4 text-right">Nilai Penawaran</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotations.map((quotation) => {
                  const badge = getStatusBadge(quotation.status);
                  const BadgeIcon = badge.icon;

                  return (
                    <tr
                      key={quotation.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectQuotation(quotation)}
                    >
                      {/* No SPH & Project */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                            {quotation.quotationNumber}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            Sumber: {quotation.rabNumber}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{quotation.projectName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{quotation.projectLocation}</span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{quotation.clientName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="font-mono">{quotation.clientPhone}</span>
                        </div>
                      </td>

                      {/* Dates & Validity */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">
                          {formatIndonesianDate(quotation.quotationDate)}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Berlaku s/d {formatIndonesianDate(quotation.validUntil)} ({quotation.validityDays} hari)
                        </span>
                      </td>

                      {/* Grand Total */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono text-xs font-bold text-slate-900 block">
                          {formatRupiah(quotation.grandTotal)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          HPP: {formatRupiah(quotation.subtotalCost)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectQuotation(quotation)}
                            title="Buka Dokumen SPH"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setQuotationToEdit(quotation)}
                            title="Edit Data SPH"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setQuotationToDelete(quotation)}
                            title="Hapus Dokumen SPH"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredQuotations.map((quotation) => {
              const badge = getStatusBadge(quotation.status);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={quotation.id}
                  onClick={() => onSelectQuotation(quotation)}
                  className="p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {quotation.quotationNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {quotation.projectName}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3 h-3 text-slate-400" />
                        {quotation.clientName}
                      </span>
                      <span>•</span>
                      <span className="truncate">{quotation.projectLocation}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Nilai Penawaran</span>
                      <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                        {formatRupiah(quotation.grandTotal)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Berlaku Hingga</span>
                      <span className="text-[11px] font-medium text-slate-700">
                        {formatIndonesianDate(quotation.validUntil)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] text-slate-400">
                      Sumber: {quotation.rabNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuotationToEdit(quotation)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onSelectQuotation(quotation)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                      >
                        Buka
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateQuotationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        rabs={rabs}
        existingQuotations={quotations}
        onSave={(newQ) => {
          onCreateQuotation(newQ);
          setIsCreateModalOpen(false);
        }}
      />

      {/* Edit Modal */}
      {quotationToEdit && (
        <EditQuotationModal
          isOpen={true}
          onClose={() => setQuotationToEdit(null)}
          quotation={quotationToEdit}
          onSave={(id, updated) => {
            onUpdateQuotation(id, updated);
            setQuotationToEdit(null);
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      {quotationToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setQuotationToDelete(null)}
          title="Hapus Surat Penawaran Harga?"
          message={`Apakah Anda yakin ingin menghapus dokumen "${quotationToDelete.quotationNumber} — ${quotationToDelete.projectName}"? Dokumen sumber RAB dan Lead tidak akan terhapus.`}
          confirmText="Ya, Hapus SPH"
          onConfirm={() => {
            onDeleteQuotation(quotationToDelete.id);
            setQuotationToDelete(null);
          }}
        />
      )}
    </div>
  );
};
