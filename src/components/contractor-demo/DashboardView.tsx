'use client';

import React from 'react';
import {
  Users2,
  MapPin,
  FileSpreadsheet,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DemoLead, DemoProject, DemoSurvey, DemoRABItem, DemoActivity } from './types';
import { DemoTabKey } from './DemoSidebar';

interface DashboardViewProps {
  leads: DemoLead[];
  projects: DemoProject[];
  surveys: DemoSurvey[];
  rabItems: DemoRABItem[];
  activities: DemoActivity[];
  onNavigate: (tab: DemoTabKey) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  projects,
  surveys,
  rabItems,
  activities,
  onNavigate,
}) => {
  const totalProjectValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalRABValue = rabItems.reduce((acc, r) => acc + r.subtotal, 0);
  const activeProjectsCount = projects.filter((p) => p.stage === 'Pengerjaan').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
              <span className="text-xs font-mono font-bold text-[#64756D] uppercase">
                Contractor CRM Workspace
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0B3D2E] tracking-tight">
              Ringkasan Operasional Proyek
            </h2>
            <p className="text-xs sm:text-sm text-[#64756D]">
              Pantau seluruh pergerakan deal, jadwal survei lapangan, RAB, hingga pengadaan material secara terpadu.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('leads')}
              className="px-4 py-2.5 rounded-xl bg-[#0B3D2E] text-white text-xs font-bold hover:bg-[#16A36A] transition shadow-xs"
            >
              + Tambah Lead
            </button>
            <button
              onClick={() => onNavigate('rab')}
              className="px-4 py-2.5 rounded-xl bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold hover:bg-[#16A36A] hover:text-white transition"
            >
              Kalkulator RAB
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64756D]">Total Prospek Lead</span>
            <Users2 className="w-4 h-4 text-[#16A36A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0B3D2E]">{leads.length}</div>
          <div className="text-[11px] text-[#16A36A] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{leads.filter((l) => l.status === 'Lead Baru').length} Lead Baru Perlu Follow-up</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64756D]">Jadwal Survei Lapangan</span>
            <MapPin className="w-4 h-4 text-[#16A36A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0B3D2E]">{surveys.length}</div>
          <div className="text-[11px] text-[#64756D]">
            {surveys.filter((s) => s.status === 'Dijadwalkan').length} Terjadwal Minggu Ini
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64756D]">Total Nilai Kontrak</span>
            <FolderKanban className="w-4 h-4 text-[#16A36A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0B3D2E]">
            Rp {(totalProjectValue / 1000000).toLocaleString('id-ID')} Jt
          </div>
          <div className="text-[11px] text-[#16A36A] font-semibold">
            {activeProjectsCount} Proyek Sedang Dikerjakan
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64756D]">Estimasi RAB Aktif</span>
            <FileSpreadsheet className="w-4 h-4 text-[#16A36A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0B3D2E]">
            Rp {(totalRABValue / 1000000).toLocaleString('id-ID')} Jt
          </div>
          <div className="text-[11px] text-[#64756D]">{rabItems.length} Item Pekerjaan Terkalkulasi</div>
        </div>
      </div>

      {/* Main Grid: Active Pipeline & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Projects Overview */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
            <h3 className="font-bold text-[#0B3D2E] text-sm">Status Proyek Lapangan</h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] flex items-center gap-1"
            >
              Lihat Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((prj) => (
              <div
                key={prj.id}
                className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-[#10231B]">{prj.title}</div>
                  <div className="text-xs text-[#64756D] mt-0.5">
                    {prj.clientName} • Nilai: Rp {(prj.contractValue / 1000000).toLocaleString('id-ID')} Jt
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EAF8F1] text-[#16A36A]">
                    {prj.stage}
                  </span>
                  <div className="text-[10px] text-[#64756D] mt-1">{prj.assignedMandor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
            <h3 className="font-bold text-[#0B3D2E] text-sm">Aktivitas Terkini</h3>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E]"
            >
              Semua Aktivitas
            </button>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-bold text-[#10231B]">{act.title}</div>
                  <p className="text-[#64756D] text-[11px]">{act.description}</p>
                  <div className="text-[10px] text-[#64756D] font-mono">{act.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
