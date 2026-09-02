'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Building2, 
  User, 
  MapPin, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { RAB, Lead } from '../../types';
import { formatRupiah, formatIndonesianDate } from '../../utils/helpers';
import { StatCard } from '../common/StatCard';
import { EmptyState } from '../common/EmptyState';
import { ConfirmModal } from '../common/ConfirmModal';
import { CreateRABModal } from './CreateRABModal';
import { EditRABModal } from './EditRABModal';

interface RABListViewProps {
  rabs: RAB[];
  leads?: Lead[];
  onSelectRAB: (rab: RAB) => void;
  onCreateRAB: (newRAB: Omit<RAB, 'id' | 'createdAt' | 'updatedAt' | 'items' | 'materialTotal' | 'laborTotal' | 'subtotalCost' | 'overheadAmount' | 'marginAmount' | 'grandTotal'>) => void;
  onUpdateRAB: (rabId: string, updatedData: Partial<RAB>) => void;
  onDeleteRAB: (rabId: string) => void;
}

export const RABListView: React.FC<RABListViewProps> = ({
  rabs,
  leads = [],
  onSelectRAB,
  onCreateRAB,
  onUpdateRAB,
  onDeleteRAB,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rabToEdit, setRabToEdit] = useState<RAB | null>(null);
  const [rabToDelete, setRabToDelete] = useState<RAB | null>(null);

  // Filter logic
  const filteredRabs = rabs.filter((rab) => {
    if (statusFilter !== 'all' && rab.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = rab.rabNumber.toLowerCase().includes(q);
      const matchProj = rab.projectName.toLowerCase().includes(q);
      const matchClient = rab.clientName.toLowerCase().includes(q);
      const matchLoc = rab.projectLocation.toLowerCase().includes(q);
      if (!matchNum && !matchProj && !matchClient && !matchLoc) return false;
    }
    return true;
  });

  // Key metrics
  const totalRABCount = rabs.length;
  const draftCount = rabs.filter((r) => r.status === 'Draft').length;
  const finalCount = rabs.filter((r) => r.status === 'Final').length;
  const totalRABValue = rabs.reduce((acc, r) => acc + (r.grandTotal || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Rencana Anggaran Biaya (RAB) Proyek
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Penyusunan estimasi biaya konstruksi, analisa harga satuan (Material & Upah), dan kalkulasi profit proyek
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Dokumen RAB</span>
        </button>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Dokumen RAB"
          value={totalRABCount}
          subtitle="Seluruh dokumen aktif"
          icon={FileSpreadsheet}
          iconColor="text-slate-700"
          iconBg="bg-slate-100"
        />
        <StatCard
          title="RAB Status Draft"
          value={draftCount}
          subtitle="Dalam penyusunan tim"
          icon={Clock}
          iconColor="text-amber-700"
          iconBg="bg-amber-100"
        />
        <StatCard
          title="RAB Final Disetujui"
          value={finalCount}
          subtitle="Siap terbit penawaran"
          icon={CheckCircle2}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />
        <StatCard
          title="Total Nilai Estimasi"
          value={formatRupiah(totalRABValue)}
          subtitle="Akumulasi seluruh proyek"
          icon={Sparkles}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />
      </div>

      {/* 3. Search Bar & Status Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor RAB, nama proyek, nama klien, atau lokasi..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/60 shrink-0 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua', count: totalRABCount },
              { id: 'Draft', label: 'Draft', count: draftCount },
              { id: 'Final', label: 'Final', count: finalCount },
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
      {filteredRabs.length === 0 ? (
        <EmptyState
          title={search ? 'RAB tidak ditemukan' : 'Belum ada dokumen RAB'}
          description={
            search
              ? 'Tidak ada dokumen RAB yang sesuai dengan kriteria pencarian.'
              : 'Mulai buat Rencana Anggaran Biaya proyek pertama untuk menghitung kebutuhan material, upah tukang, dan margin laba.'
          }
          actionText="+ Buat RAB Pertama"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Dokumen & Proyek</th>
                  <th className="py-3 px-4">Klien & Lokasi</th>
                  <th className="py-3 px-4 text-center">Item Pekerjaan</th>
                  <th className="py-3 px-4 text-right">Biaya HPP Riil</th>
                  <th className="py-3 px-4 text-right">Grand Total RAB</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRabs.map((rab) => {
                  const isFinal = rab.status === 'Final';
                  return (
                    <tr
                      key={rab.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectRAB(rab)}
                    >
                      {/* 1. RAB Number & Project */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                          {rab.rabNumber}
                        </span>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{rab.projectName}</span>
                        </div>
                        {rab.buildingAreaM2 && (
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Luas: {rab.buildingAreaM2} m²
                          </span>
                        )}
                      </td>

                      {/* 2. Client & Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{rab.clientName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{rab.projectLocation}</span>
                        </div>
                      </td>

                      {/* 3. Items Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-md text-slate-700 font-semibold text-[11px]">
                          <Layers className="w-3 h-3 text-slate-500" />
                          <span>{rab.items?.length || 0} item</span>
                        </span>
                      </td>

                      {/* 4. Subtotal Cost (HPP) */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono text-xs text-slate-600 block">
                          {formatRupiah(rab.subtotalCost)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Mat: {formatRupiah(rab.materialTotal)}
                        </span>
                      </td>

                      {/* 5. Grand Total */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono text-xs font-bold text-slate-900 block">
                          {formatRupiah(rab.grandTotal)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          Margin: +{rab.marginValue}%
                        </span>
                      </td>

                      {/* 6. Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            isFinal
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isFinal ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-slate-500" />
                          )}
                          <span>{rab.status}</span>
                        </span>
                      </td>

                      {/* 7. Action Buttons */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectRAB(rab)}
                            title="Buka Lembar Kerja RAB"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRabToEdit(rab)}
                            title="Edit Data Proyek"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRabToDelete(rab)}
                            title="Hapus RAB"
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
            {filteredRabs.map((rab) => {
              const isFinal = rab.status === 'Final';
              return (
                <div
                  key={rab.id}
                  onClick={() => onSelectRAB(rab)}
                  className="p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {rab.rabNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isFinal
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isFinal ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-slate-500" />
                      )}
                      <span>{rab.status}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {rab.projectName}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3 h-3 text-slate-400" />
                        {rab.clientName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {rab.projectLocation}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total RAB ({rab.items?.length || 0} item)</span>
                      <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                        {formatRupiah(rab.grandTotal)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Biaya HPP</span>
                      <span className="font-mono text-xs text-slate-600">
                        {formatRupiah(rab.subtotalCost)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatIndonesianDate(rab.updatedAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRabToEdit(rab)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onSelectRAB(rab)}
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

      {/* 5. Create RAB Modal */}
      <CreateRABModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        existingRABs={rabs}
        leads={leads}
        onSave={(newRAB) => {
          onCreateRAB(newRAB);
          setIsCreateModalOpen(false);
        }}
      />

      {/* 6. Edit RAB Modal */}
      {rabToEdit && (
        <EditRABModal
          isOpen={true}
          onClose={() => setRabToEdit(null)}
          rab={rabToEdit}
          onSave={(id, updatedData) => {
            onUpdateRAB(id, updatedData);
            setRabToEdit(null);
          }}
        />
      )}

      {/* 7. Delete Confirmation Modal */}
      {rabToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setRabToDelete(null)}
          title="Hapus Dokumen RAB?"
          message={`Apakah Anda yakin ingin menghapus dokumen "${rabToDelete.rabNumber} — ${rabToDelete.projectName}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus RAB"
          onConfirm={() => {
            onDeleteRAB(rabToDelete.id);
            setRabToDelete(null);
          }}
        />
      )}
    </div>
  );
};
