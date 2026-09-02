'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
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
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Phone,
  HardHat,
  DollarSign
} from 'lucide-react';
import { ContractorProject, ProjectStatus, ProjectStage, Quotation, RAB } from '../../../types';
import { formatRupiah, formatIndonesianDate } from '../../../utils/helpers';
import { StatCard } from '../../common/StatCard';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { CreateProjectModal } from './CreateProjectModal';

interface ProjectListViewProps {
  projects: ContractorProject[];
  quotations: Quotation[];
  rabs: RAB[];
  onSelectProject: (project: ContractorProject) => void;
  onCreateProject: (newProject: ContractorProject) => void;
  onUpdateProject: (id: string, updatedData: Partial<ContractorProject>) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  quotations,
  rabs,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ContractorProject | null>(null);

  // Filter logic
  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchNum = p.projectNumber.toLowerCase().includes(term);
      const matchProj = p.projectName.toLowerCase().includes(term);
      const matchClient = p.clientName.toLowerCase().includes(term);
      const matchLoc = p.projectLocation.toLowerCase().includes(term);
      const matchSpk = (p.contractNumber || '').toLowerCase().includes(term);
      if (!matchNum && !matchProj && !matchClient && !matchLoc && !matchSpk) return false;
    }
    return true;
  });

  // KPI Metrics
  const activeProjects = projects.filter((p) => p.status === 'In_Progress' || p.status === 'Delayed');
  const totalActive = activeProjects.length;
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.currentProgressPercent || 0), 0) / projects.length)
    : 0;
  const onTimeCount = projects.filter((p) => (p.deviationPercent || 0) >= 0 && p.status !== 'Completed').length;
  const criticalDelayedCount = projects.filter((p) => (p.deviationPercent || 0) < -5 && p.status !== 'Completed').length;
  const totalContractValue = activeProjects.reduce((sum, p) => sum + (p.contractValue || 0), 0);

  const getStatusBadge = (status: ProjectStatus, deviation: number) => {
    switch (status) {
      case 'Planning':
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Planning' };
      case 'In_Progress':
        if (deviation < -5) {
          return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Terlambat (>5%)' };
        }
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Sedang Berjalan' };
      case 'Delayed':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Tertunda / Delayed' };
      case 'Completed':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Selesai (PHO)' };
      case 'On_Hold':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'On Hold' };
    }
  };

  const STAGES: ProjectStage[] = [
    'Persiapan',
    'Struktur',
    'Arsitektur',
    'MEP',
    'Finishing',
    'Serah Terima (PHO)',
    'Selesai',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Monitoring Proyek & Progres Lapangan
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pelacakan realisasi fisik, Kurva S, log opname mingguan, dan deviasi proyek konstruksi aktif
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Proyek Baru</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Proyek Aktif"
          value={totalActive}
          subtitle="Sedang dikerjakan"
          icon={HardHat}
          iconColor="text-slate-700"
          iconBg="bg-slate-100"
        />
        <StatCard
          title="Progres Rata-rata"
          value={`${avgProgress}%`}
          subtitle="Realisasi fisik"
          icon={Layers}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Proyek Tepat Waktu"
          value={onTimeCount}
          subtitle="Deviasi aman (≥ 0%)"
          icon={TrendingUp}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />
        <StatCard
          title="Deviasi Kritis"
          value={criticalDelayedCount}
          subtitle="Keterlambatan > 5%"
          icon={AlertTriangle}
          iconColor="text-rose-700"
          iconBg="bg-rose-100"
        />
        <StatCard
          title="Nilai Kontrak Berjalan"
          value={formatRupiah(totalContractValue)}
          subtitle="Akumulasi SPK aktif"
          icon={DollarSign}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
      </div>

      {/* 3. Search, Filter Tabs & View Toggle */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor proyek, nomor SPK, proyek, klien, atau lokasi..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan Tabel"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabel</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'kanban'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan Kanban"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/60 shrink-0 overflow-x-auto">
              {[
                { id: 'all', label: 'Semua', count: projects.length },
                { id: 'In_Progress', label: 'Berjalan', count: projects.filter((p) => p.status === 'In_Progress').length },
                { id: 'Delayed', label: 'Delayed', count: criticalDelayedCount },
                { id: 'Completed', label: 'Selesai', count: projects.filter((p) => p.status === 'Completed').length },
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
      </div>

      {/* 4. Main View: Table / Kanban */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title={search ? 'Proyek tidak ditemukan' : 'Belum ada Proyek Konstruksi'}
          description={
            search
              ? 'Tidak ada proyek yang sesuai dengan kata kunci pencarian.'
              : 'Terbitkan proyek konstruksi aktif dari Surat Penawaran Harga (SPH) yang telah Disetujui atau RAB Final.'
          }
          actionText="+ Terbitkan Proyek Pertama"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageProjects = filteredProjects.filter((p) => p.stage === stage);
            return (
              <div key={stage} className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-3 min-w-[240px] flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-xs truncate" title={stage}>
                    {stage}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700">
                    {stageProjects.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {stageProjects.map((proj) => {
                    const badge = getStatusBadge(proj.status, proj.deviationPercent);
                    return (
                      <div
                        key={proj.id}
                        onClick={() => onSelectProject(proj)}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:border-emerald-500 transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {proj.projectNumber}
                          </span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-emerald-700 transition-colors">
                            {proj.projectName}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {proj.clientName} • {proj.projectLocation}
                          </p>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">Progres Fisik:</span>
                            <span className="font-bold text-slate-900">{proj.currentProgressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                proj.deviationPercent < -5
                                  ? 'bg-rose-500'
                                  : proj.currentProgressPercent >= 100
                                  ? 'bg-emerald-600'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${Math.min(100, proj.currentProgressPercent)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span>Kontrak:</span>
                          <span className="font-mono font-bold text-slate-700">{formatRupiah(proj.contractValue)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Desktop Table & Mobile Cards */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Proyek & SPK</th>
                  <th className="py-3 px-4">Klien & Lokasi</th>
                  <th className="py-3 px-4">Tahapan & Status</th>
                  <th className="py-3 px-4">Progres Fisik (Kurva S)</th>
                  <th className="py-3 px-4 text-right">Nilai Kontrak</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => {
                  const badge = getStatusBadge(project.status, project.deviationPercent);
                  const isBehind = project.deviationPercent < -5;

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectProject(project)}
                    >
                      {/* Number & Project */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                            {project.projectNumber}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {project.contractNumber}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{project.projectName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Masa Kerja: {formatIndonesianDate(project.contractStartDate)} s/d {formatIndonesianDate(project.contractEndDate)} ({project.durationDays} hari)
                        </div>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{project.clientName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{project.projectLocation}</span>
                        </div>
                      </td>

                      {/* Stage & Status */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{project.stage}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-1 ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Progress bar & Kurva S metric */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="font-bold text-slate-900">
                              Realisasi: {project.currentProgressPercent}%
                            </span>
                            <span
                              className={`font-semibold flex items-center gap-0.5 text-[10px] ${
                                project.deviationPercent >= 0
                                  ? 'text-emerald-700'
                                  : isBehind
                                  ? 'text-rose-600 font-bold'
                                  : 'text-amber-700'
                              }`}
                            >
                              {project.deviationPercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {project.deviationPercent > 0 ? `+${project.deviationPercent}%` : `${project.deviationPercent}%`}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isBehind
                                  ? 'bg-rose-500'
                                  : project.currentProgressPercent >= 100
                                  ? 'bg-emerald-600'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${Math.min(100, project.currentProgressPercent)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            Target Kurva S: {project.targetProgressPercent}%
                          </span>
                        </div>
                      </td>

                      {/* Contract Value */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono text-xs font-bold text-slate-900 block">
                          {formatRupiah(project.contractValue)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {project.milestones?.length || 0} Tahapan WBS
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectProject(project)}
                            title="Buka Monitoring Proyek"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProjectToDelete(project)}
                            title="Hapus Proyek"
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
            {filteredProjects.map((project) => {
              const badge = getStatusBadge(project.status, project.deviationPercent);
              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {project.projectNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {project.projectName}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {project.clientName} • {project.projectLocation}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600">Realisasi Progres:</span>
                      <b className="text-slate-900">{project.currentProgressPercent}%</b>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, project.currentProgressPercent)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Target: {project.targetProgressPercent}%</span>
                      <span className={project.deviationPercent >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        Deviasi: {project.deviationPercent > 0 ? `+${project.deviationPercent}%` : `${project.deviationPercent}%`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nilai Kontrak SPK</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {formatRupiah(project.contractValue)}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectProject(project)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                    >
                      Buka Proyek
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        quotations={quotations}
        rabs={rabs}
        existingProjects={projects}
        onSave={(newProj) => {
          onCreateProject(newProj);
          setIsCreateModalOpen(false);
        }}
      />

      {/* Delete Modal */}
      {projectToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setProjectToDelete(null)}
          title="Hapus Proyek Konstruksi?"
          message={`Apakah Anda yakin ingin menghapus data proyek "${projectToDelete.projectNumber} — ${projectToDelete.projectName}"? Dokumen sumber SPH dan RAB tidak akan terhapus.`}
          confirmText="Ya, Hapus Proyek"
          onConfirm={() => {
            onDeleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }}
        />
      )}
    </div>
  );
};
