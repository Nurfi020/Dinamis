'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  FolderKanban,
  ShoppingCart,
  Users2,
  FileSpreadsheet,
} from 'lucide-react';
import { DemoLead, DemoProject, DemoRABItem, DemoMaterial } from './types';

interface ReportViewProps {
  leads: DemoLead[];
  projects: DemoProject[];
  rabItems: DemoRABItem[];
  materials: DemoMaterial[];
}

export const ReportView: React.FC<ReportViewProps> = ({
  leads,
  projects,
  rabItems,
  materials,
}) => {
  const totalProjectValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalRABDirectCost = rabItems.reduce((acc, r) => acc + r.subtotal, 0);
  const totalMaterialPurchased = materials.reduce((acc, m) => {
    if (m.status === 'Dibeli' || m.status === 'Terpakai') {
      return acc + m.quantity * (m.actualCost || m.estimatedCost);
    }
    return acc;
  }, 0);

  const activeProjectsCount = projects.filter((p) => p.stage === 'Pengerjaan').length;
  const dealLeadsCount = leads.filter((l) => l.status === 'Deal').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#16A36A]" />
          <h2 className="text-xl font-extrabold text-[#0B3D2E]">
            Laporan Kinerja & Rekap Keuangan
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
          Ringkasan analitik real-time dari data operasional proyek yang sedang berjalan.
        </p>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-[#E2EAE5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D] text-xs">
            <span>Total Nilai Kontrak Proyek</span>
            <DollarSign className="w-4 h-4 text-[#16A36A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E]">
            Rp {totalProjectValue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#16A36A] font-semibold">
            Dari {projects.length} Total Proyek Tercatat
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2EAE5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D] text-xs">
            <span>Total Anggaran RAB (Cost)</span>
            <FileSpreadsheet className="w-4 h-4 text-[#16A36A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E]">
            Rp {totalRABDirectCost.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#64756D]">
            {rabItems.length} Rincian Item Pekerjaan Lapangan
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2EAE5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D] text-xs">
            <span>Realisasi Belanja Material</span>
            <ShoppingCart className="w-4 h-4 text-[#16A36A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#16A36A]">
            Rp {totalMaterialPurchased.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#64756D]">
            Nota Fisik Toko Bangunan Terinput
          </p>
        </div>
      </div>

      {/* Conversion Breakdown Card */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="font-bold text-sm text-[#0B3D2E]">Metrik Konversi Lead & Proyek</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-[#F7FAF8] rounded-2xl border border-[#E2EAE5]">
            <div className="text-2xl font-extrabold text-[#0B3D2E]">{leads.length}</div>
            <div className="text-xs text-[#64756D] mt-1">Total Leads Masuk</div>
          </div>

          <div className="p-4 bg-[#F7FAF8] rounded-2xl border border-[#E2EAE5]">
            <div className="text-2xl font-extrabold text-[#16A36A]">{dealLeadsCount}</div>
            <div className="text-xs text-[#64756D] mt-1">Lead Berhasil Deal</div>
          </div>

          <div className="p-4 bg-[#F7FAF8] rounded-2xl border border-[#E2EAE5]">
            <div className="text-2xl font-extrabold text-[#0B3D2E]">{activeProjectsCount}</div>
            <div className="text-xs text-[#64756D] mt-1">Sedang Pengerjaan</div>
          </div>

          <div className="p-4 bg-[#F7FAF8] rounded-2xl border border-[#E2EAE5]">
            <div className="text-2xl font-extrabold text-[#0B3D2E]">
              {projects.filter((p) => p.stage === 'Selesai').length}
            </div>
            <div className="text-xs text-[#64756D] mt-1">Proyek Serah Terima (BAST)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
