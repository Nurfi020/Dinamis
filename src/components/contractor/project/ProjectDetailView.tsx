'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Plus,
  Edit3,
  Trash2,
  Building2,
  User,
  Phone,
  Calendar,
  MapPin,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  HardHat,
  DollarSign,
  CloudSun,
  Users,
  Activity,
  FileText,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { ContractorProject, ProjectMilestone, ProgressLogEntry, ProjectStatus, ProjectStage } from '../../../types';
import { formatRupiah, formatIndonesianDate, formatFullIndonesianDate } from '../../../utils/helpers';
import {
  calculateProjectProgress,
  calculateDeviation,
  calculatePlannedProgressForDate,
  getMilestoneStatus,
  calculateDaysBetween
} from '../../../data/contractorProjectData';
import { LogProgressModal } from './LogProgressModal';
import { ConfirmModal } from '../../common/ConfirmModal';

interface ProjectDetailViewProps {
  project: ContractorProject;
  onBack: () => void;
  onUpdateProject: (id: string, updatedData: Partial<ContractorProject>) => void;
  onDeleteProject: (id: string) => void;
  onOpenFinance?: (projectId: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onUpdateProject,
  onDeleteProject,
  onOpenFinance,
}) => {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<ProgressLogEntry | null>(null);
  const [logToDelete, setLogToDelete] = useState<ProgressLogEntry | null>(null);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'overview' | 'kurva_s' | 'milestones' | 'logs'>('overview');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    onUpdateProject(project.id, { status: newStatus });
  };

  const handleStageChange = (newStage: ProjectStage) => {
    onUpdateProject(project.id, { stage: newStage });
  };

  // Milestone direct inline progress update
  const handleMilestoneProgressUpdate = (milestoneId: string, newProgress: number) => {
    const clamped = Math.min(100, Math.max(0, newProgress));
    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            actualProgressPercent: clamped,
            status: getMilestoneStatus(clamped),
          }
        : m
    );

    const newCurrentProgress = calculateProjectProgress(updatedMilestones);
    const todayStr = new Date().toISOString().split('T')[0];
    const newTargetProgress = calculatePlannedProgressForDate(
      { contractStartDate: project.contractStartDate, contractEndDate: project.contractEndDate, milestones: updatedMilestones },
      todayStr
    );
    const newDeviation = calculateDeviation(newCurrentProgress, newTargetProgress);

    onUpdateProject(project.id, {
      milestones: updatedMilestones,
      currentProgressPercent: newCurrentProgress,
      targetProgressPercent: newTargetProgress,
      deviationPercent: newDeviation,
    });
  };

  // Add / Edit Log Entry Handler
  const handleSaveLog = (newLog: ProgressLogEntry, updatedMilestones?: ProjectMilestone[]) => {
    let logs = [...project.progressLogs];
    const existingIdx = logs.findIndex((l) => l.id === newLog.id);

    if (existingIdx >= 0) {
      logs[existingIdx] = newLog;
    } else {
      logs = [newLog, ...logs];
    }

    // Sort logs chronologically by date
    logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const milestonesToUse = updatedMilestones || project.milestones;
    const newCurrentProgress = calculateProjectProgress(milestonesToUse);
    const todayStr = new Date().toISOString().split('T')[0];
    const newTargetProgress = calculatePlannedProgressForDate(
      { contractStartDate: project.contractStartDate, contractEndDate: project.contractEndDate, milestones: milestonesToUse },
      todayStr
    );
    const newDeviation = calculateDeviation(newCurrentProgress, newTargetProgress);

    onUpdateProject(project.id, {
      progressLogs: logs,
      milestones: milestonesToUse,
      currentProgressPercent: newCurrentProgress,
      targetProgressPercent: newTargetProgress,
      deviationPercent: newDeviation,
    });
  };

  // Delete Log Entry Handler
  const handleDeleteLog = (logId: string) => {
    const logs = project.progressLogs.filter((l) => l.id !== logId);
    onUpdateProject(project.id, { progressLogs: logs });
    setLogToDelete(null);
  };

  // Calculate days remaining
  const today = new Date();
  const end = new Date(project.contractEndDate);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isCritical = project.deviationPercent < -5;

  // Kurva S timeline points calculation (Weekly interval data)
  const totalWeeks = Math.max(4, Math.ceil(project.durationDays / 7));
  const kurvaSPoints = React.useMemo(() => {
    const points: Array<{
      week: number;
      dateStr: string;
      planned: number;
      actual: number | null;
      deviation: number | null;
    }> = [];

    const nowTime = new Date().getTime();
    const startMs = new Date(project.contractStartDate).getTime();

    for (let w = 1; w <= totalWeeks; w++) {
      const curDateMs = startMs + w * 7 * 24 * 60 * 60 * 1000;
      const dateStr = new Date(curDateMs).toISOString().split('T')[0];
      const planned = calculatePlannedProgressForDate(
        { contractStartDate: project.contractStartDate, contractEndDate: project.contractEndDate, milestones: project.milestones },
        dateStr
      );

      // Find matching actual log for week or closest date
      const matchingLog = project.progressLogs.find((l) => l.weekNumber === w);
      const isPastOrToday = curDateMs <= nowTime + 24 * 60 * 60 * 1000;

      let actual: number | null = null;
      let deviation: number | null = null;

      if (matchingLog) {
        actual = matchingLog.actualProgressPercent;
        deviation = matchingLog.deviationPercent;
      } else if (w === totalWeeks && project.currentProgressPercent >= 100) {
        actual = 100;
        deviation = 0;
      } else if (isPastOrToday && project.progressLogs.length === 0 && w === 1) {
        actual = project.currentProgressPercent;
        deviation = project.deviationPercent;
      }

      points.push({ week: w, dateStr, planned, actual, deviation });
    }
    return points;
  }, [project, totalWeeks]);

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
    <div className="space-y-6 print:m-0 print:p-0">
      {/* 1. Top Navigation & Quick Actions Bar (Hidden when printing) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Proyek</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
            {(['Planning', 'In_Progress', 'Delayed', 'Completed', 'On_Hold'] as ProjectStatus[]).map((st) => {
              const isActive = project.status === st;
              return (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                    isActive
                      ? st === 'Completed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : st === 'Delayed'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : st === 'In_Progress'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'In_Progress' ? 'Berjalan' : st}
                </button>
              );
            })}
          </div>

          {/* Log Opname Button */}
          <button
            onClick={() => {
              setLogToEdit(null);
              setIsLogModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Opname Mingguan</span>
          </button>

          {/* Jump to Project Finance */}
          {onOpenFinance && (
            <button
              onClick={() => onOpenFinance(project.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Buka Data Keuangan & Termin Proyek Ini"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Keuangan & Termin</span>
            </button>
          )}

          {/* Print / Progress Report Trigger */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak Laporan</span>
          </button>

          {/* Delete Project */}
          <button
            onClick={() => setIsDeleteProjectOpen(true)}
            className="p-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="Hapus Proyek"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Project Overview Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {project.projectNumber}
              </span>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                Kontrak: {project.contractNumber}
              </span>
              <span className="text-xs text-slate-500">
                Ref. SPH: <b className="font-mono text-slate-700">{project.quotationNumber || project.rabNumber}</b>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {project.projectName}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {project.clientName}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-emerald-700">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {project.clientPhone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.projectLocation} {project.buildingAreaM2 ? `(${project.buildingAreaM2} m²)` : ''}
              </span>
            </div>
          </div>

          {/* Quick Financial & Stage Badge */}
          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Nilai Kontrak SPK (Gross)</span>
            <span className="font-mono text-lg sm:text-xl font-extrabold text-slate-900">
              {formatRupiah(project.contractValue)}
            </span>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-500">Tahapan Aktif:</span>
              <select
                value={project.stage}
                onChange={(e) => handleStageChange(e.target.value as ProjectStage)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-emerald-800 focus:bg-white"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Critical Deviation Alert Banner */}
        {isCritical && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-rose-950">
                Peringatan Deviasi Kritis Lapangan: {project.deviationPercent}%
              </p>
              <p className="text-[11px] text-rose-700">
                Realisasi fisik lapangan ({project.currentProgressPercent}%) tertinggal lebih dari 5% dibanding target Kurva S rencana ({project.targetProgressPercent}%). Disarankan menambah jumlah tenaga kerja atau jam lembur (overtime).
              </p>
            </div>
          </div>
        )}

        {/* 4 Summary Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Realisasi Progres Fisik</span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xl font-extrabold text-slate-900">
                {project.currentProgressPercent}%
              </span>
              <span className="text-[10px] font-mono text-slate-500">Bobot WBS</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${Math.min(100, project.currentProgressPercent)}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Kurva S Rencana</span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xl font-extrabold text-blue-700">
                {project.targetProgressPercent}%
              </span>
              <span className="text-[10px] text-slate-500">Saat ini</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${Math.min(100, project.targetProgressPercent)}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Deviasi Jadwal</span>
            <div className="flex items-center gap-1.5">
              {project.deviationPercent >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-rose-600" />
              )}
              <span
                className={`font-mono text-xl font-extrabold ${
                  project.deviationPercent >= 0
                    ? 'text-emerald-700'
                    : isCritical
                    ? 'text-rose-600'
                    : 'text-amber-700'
                }`}
              >
                {project.deviationPercent > 0 ? `+${project.deviationPercent}%` : `${project.deviationPercent}%`}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {project.deviationPercent >= 0 ? '✓ Tepat Waktu / Lebih Cepat' : isCritical ? '⚠️ Keterlambatan Kritis' : 'Tertinggal minor'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Masa Kontrak & Sisa Waktu</span>
            <span className="font-mono text-xl font-extrabold text-slate-900 block">
              {diffDays > 0 ? `${diffDays} Hari` : 'Jatuh Tempo'}
            </span>
            <span className="text-[10px] text-slate-500 block truncate">
              {formatIndonesianDate(project.contractStartDate)} — {formatIndonesianDate(project.contractEndDate)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Tab Switcher Navigation (Hidden in print) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 print:hidden">
        {[
          { id: 'overview', label: 'Ringkasan & Kurva S', icon: Activity },
          { id: 'milestones', label: `WBS & Tahapan (${project.milestones?.length || 0})`, icon: Layers },
          { id: 'logs', label: `Log Opname Mingguan (${project.progressLogs?.length || 0})`, icon: FileText },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
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

      {/* TAB A: Kurva S & Progress Analytics */}
      {(activeTab === 'overview' || activeTab === 'kurva_s') && (
        <div className="space-y-6">
          {/* Native SVG Kurva S Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Grafik Kurva S (Rencana vs Realisasi Lapangan)
                </h3>
                <p className="text-xs text-slate-500">
                  Visualisasi kumulatif kurva rencana timeline vs aktual bobot fisik per minggu
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="text-slate-600 font-medium">Rencana (Planned S-Curve)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span className="text-slate-600 font-medium">Realisasi (Actual Progress)</span>
                </div>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px] h-64 relative border border-slate-100 bg-slate-50/50 rounded-lg p-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((pct) => {
                    const y = 180 - (pct / 100) * 160;
                    return (
                      <g key={pct}>
                        <line x1="40" y1={y} x2="780" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="10" y={y + 4} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                          {pct}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Planned Kurva S Line (Blue) */}
                  {kurvaSPoints.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3"
                      points={kurvaSPoints
                        .map((pt, i) => {
                          const x = 50 + (i / (kurvaSPoints.length - 1)) * 720;
                          const y = 180 - (pt.planned / 100) * 160;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* Actual Progress Points & Line (Emerald) */}
                  {kurvaSPoints.filter((pt) => pt.actual !== null).length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3"
                      strokeLinecap="round"
                      points={kurvaSPoints
                        .filter((pt) => pt.actual !== null)
                        .map((pt, i, arr) => {
                          const originalIdx = kurvaSPoints.findIndex((k) => k.week === pt.week);
                          const x = 50 + (originalIdx / (kurvaSPoints.length - 1)) * 720;
                          const y = 180 - ((pt.actual || 0) / 100) * 160;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* Render Points Circles */}
                  {kurvaSPoints.map((pt, i) => {
                    const x = 50 + (i / (kurvaSPoints.length - 1)) * 720;
                    const yPlanned = 180 - (pt.planned / 100) * 160;
                    const yActual = pt.actual !== null ? 180 - (pt.actual / 100) * 160 : null;

                    return (
                      <g key={pt.week}>
                        {/* Planned circle */}
                        <circle cx={x} cy={yPlanned} r="3" fill="#2563EB" />
                        {/* Actual circle */}
                        {yActual !== null && (
                          <circle cx={x} cy={yActual} r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
                        )}
                        {/* X-axis week label */}
                        <text x={x} y="196" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">
                          W{pt.week}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Kurva S Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Periode</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3 text-right">Target Kurva S</th>
                    <th className="py-2.5 px-3 text-right">Realisasi Fisik</th>
                    <th className="py-2.5 px-3 text-right">Deviasi (+ / -)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {kurvaSPoints.map((pt) => {
                    const hasData = pt.actual !== null;
                    return (
                      <tr key={pt.week} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-semibold text-slate-900">Minggu ke-{pt.week}</td>
                        <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{formatIndonesianDate(pt.dateStr)}</td>
                        <td className="py-2 px-3 text-right font-mono text-blue-700 font-bold">{pt.planned}%</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {hasData ? `${pt.actual}%` : '—'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold">
                          {hasData ? (
                            <span className={pt.deviation! >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                              {pt.deviation! > 0 ? `+${pt.deviation}%` : `${pt.deviation}%`}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {hasData ? (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                pt.deviation! >= 0
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : pt.deviation! < -5
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {pt.deviation! >= 0 ? 'Aman' : pt.deviation! < -5 ? 'Kritis' : 'Perhatian'}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Belum Berjalan</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: Milestones / WBS Breakdown Table */}
      {activeTab === 'milestones' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Daftar Tahapan Pekerjaan (WBS) & Progres Aktual
              </h3>
              <p className="text-xs text-slate-500">
                Geser slider atau masukkan persentase progres lapangan untuk memperbarui capaian fisik proyek
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Total Progres Proyek: {project.currentProgressPercent}%
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {project.milestones.map((m, idx) => (
              <div key={m.id} className="py-3.5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{m.name}</h4>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.2 rounded border border-slate-200">
                        Bobot: {m.weightPercent}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-7">
                      Target: {formatIndonesianDate(m.targetStartDate)} s/d {formatIndonesianDate(m.targetEndDate)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-7 sm:pl-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        m.actualProgressPercent >= 100
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : m.actualProgressPercent > 0
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {m.actualProgressPercent >= 100 ? 'Selesai' : m.actualProgressPercent > 0 ? 'Sedang Berjalan' : 'Belum Mulai'}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-slate-900 w-12 text-right">
                      {m.actualProgressPercent}%
                    </span>
                  </div>
                </div>

                <div className="pl-7 flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={m.actualProgressPercent || 0}
                    onChange={(e) => handleMilestoneProgressUpdate(m.id, parseFloat(e.target.value) || 0)}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: Opname Logs Timeline */}
      {activeTab === 'logs' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Riwayat Log Opname Progres Lapangan
              </h3>
              <p className="text-xs text-slate-500">
                Catatan mingguan kondisi fisik lapangan, laporan mandor, cuaca, dan tenaga kerja
              </p>
            </div>
            <button
              onClick={() => {
                setLogToEdit(null);
                setIsLogModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Log Opname</span>
            </button>
          </div>

          {project.progressLogs.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-700 text-xs">Belum ada Log Opname Lapangan</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Catat opname mingguan pertama untuk memonitor perkembangan fisik dan pergerakan Kurva S proyek.
              </p>
              <button
                onClick={() => {
                  setLogToEdit(null);
                  setIsLogModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                + Buat Log Opname Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {project.progressLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs text-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Laporan Opname — Minggu ke-{log.weekNumber}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {formatIndonesianDate(log.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        Realisasi: {log.actualProgressPercent}%
                      </span>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-1 rounded border ${
                          log.deviationPercent >= 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        Deviasi: {log.deviationPercent > 0 ? `+${log.deviationPercent}%` : `${log.deviationPercent}%`}
                      </span>
                      <button
                        onClick={() => {
                          setLogToEdit(log);
                          setIsLogModalOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-900 bg-white rounded border border-slate-200 transition-colors"
                        title="Edit Log"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setLogToDelete(log)}
                        className="p-1 text-slate-400 hover:text-rose-600 bg-white rounded border border-slate-200 transition-colors"
                        title="Hapus Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                    {log.workSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                      Cuaca: <b className="text-slate-700">{log.weatherCondition || 'Cerah'}</b>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      Tenaga Kerja: <b className="text-slate-700">{log.manpowerCount || 0} Orang</b>
                    </span>
                    {log.notes && (
                      <span className="text-slate-500 italic">
                        Catatan: &ldquo;{log.notes}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Printable A4 Progress Report (Visible on Print) */}
      <div className="hidden print:block bg-white p-8 max-w-4xl mx-auto space-y-6 text-slate-900 text-xs">
        {/* Letterhead */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="text-base font-extrabold tracking-tight">PT DINAMIS KONSTRUKSI NUSANTARA</h1>
            <p className="text-[11px] text-slate-600">Jl. H.R. Rasuna Said Kav. 62, Setiabudi, Jakarta Selatan 12920</p>
            <p className="text-[10px] text-slate-500">Telp: +62 21 5299-8800 • Email: projects@dinamiskonstruksi.com</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold border border-slate-800 px-2 py-0.5 rounded">
              {project.projectNumber}
            </span>
            <p className="text-[11px] pt-1">Kontrak: {project.contractNumber}</p>
            <p className="text-[10px] text-slate-500">{formatFullIndonesianDate(today.toISOString().split('T')[0])}</p>
          </div>
        </div>

        <div className="text-center py-2">
          <h2 className="text-base font-extrabold uppercase underline">
            LAPORAN MINGGUAN PROGRES FISIK PROYEK
          </h2>
          <p className="text-xs text-slate-600 font-mono">Nomor Dokumen: LAP-{project.projectNumber.replace('PRJ-', '')}</p>
        </div>

        {/* Project Info Table */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div>
            <p>Nama Proyek: <b>{project.projectName}</b></p>
            <p>Pemberi Tugas: <b>{project.clientName}</b> ({project.clientPhone})</p>
            <p>Lokasi Proyek: <b>{project.projectLocation}</b></p>
          </div>
          <div>
            <p>Nilai Kontrak: <b>{formatRupiah(project.contractValue)}</b></p>
            <p>Masa Pelaksanaan: <b>{formatIndonesianDate(project.contractStartDate)} s/d {formatIndonesianDate(project.contractEndDate)}</b> ({project.durationDays} hari)</p>
            <p>Site Manager PIC: <b>{project.siteManagerName}</b></p>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-3 text-center border border-slate-200 p-3 rounded-lg">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Realisasi Fisik Lapangan</span>
            <b className="text-sm font-mono">{project.currentProgressPercent}%</b>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Target Rencana (Kurva S)</span>
            <b className="text-sm font-mono">{project.targetProgressPercent}%</b>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Deviasi Jadwal</span>
            <b className="text-sm font-mono">{project.deviationPercent > 0 ? `+${project.deviationPercent}%` : `${project.deviationPercent}%`}</b>
          </div>
        </div>

        {/* Milestones Table */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase border-b border-slate-300 pb-1">1. Rincian Capaian Tahapan Pekerjaan (WBS)</h3>
          <table className="w-full text-left text-[11px] border border-slate-300">
            <thead className="bg-slate-100 font-semibold border-b border-slate-300">
              <tr>
                <th className="p-2 w-8 text-center">No</th>
                <th className="p-2">Uraian Tahapan Pekerjaan</th>
                <th className="p-2 text-center">Bobot %</th>
                <th className="p-2 text-center">Target Selesai</th>
                <th className="p-2 text-right">Progres Aktual</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {project.milestones.map((m, idx) => (
                <tr key={m.id}>
                  <td className="p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="p-1.5 font-medium">{m.name}</td>
                  <td className="p-1.5 text-center font-mono">{m.weightPercent}%</td>
                  <td className="p-1.5 text-center font-mono text-[10px]">{formatIndonesianDate(m.targetEndDate)}</td>
                  <td className="p-1.5 text-right font-mono font-bold">{m.actualProgressPercent}%</td>
                  <td className="p-1.5 text-center text-[10px]">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Latest Opname Summary */}
        {project.progressLogs.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase border-b border-slate-300 pb-1">2. Rangkuman Log Opname Lapangan Terakhir</h3>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] space-y-1">
              <p><b>Minggu Ke-{project.progressLogs[0].weekNumber} ({formatIndonesianDate(project.progressLogs[0].date)}):</b></p>
              <p>{project.progressLogs[0].workSummary}</p>
              <p className="text-[10px] text-slate-500">
                Cuaca: {project.progressLogs[0].weatherCondition || 'Cerah'} • Tenaga Kerja: {project.progressLogs[0].manpowerCount || 0} orang
              </p>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs">
          <div className="space-y-16">
            <p>Dibuat Oleh,<br /><b>Pelaksana Lapangan / Site Manager</b></p>
            <p className="font-bold underline">{project.siteManagerName || 'Site Manager PIC'}</p>
          </div>
          <div className="space-y-16">
            <p>Disetujui Oleh,<br /><b>Pemberi Tugas / Klien</b></p>
            <p className="font-bold underline">{project.clientName}</p>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <LogProgressModal
          isOpen={true}
          onClose={() => {
            setIsLogModalOpen(false);
            setLogToEdit(null);
          }}
          project={project}
          existingLogToEdit={logToEdit}
          onSave={handleSaveLog}
        />
      )}

      {/* Delete Log Confirm */}
      {logToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setLogToDelete(null)}
          title="Hapus Log Opname?"
          message={`Apakah Anda yakin ingin menghapus log opname Minggu ke-${logToDelete.weekNumber} (${formatIndonesianDate(logToDelete.date)})?`}
          confirmText="Ya, Hapus Log"
          onConfirm={() => handleDeleteLog(logToDelete.id)}
        />
      )}

      {/* Delete Project Confirm */}
      {isDeleteProjectOpen && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setIsDeleteProjectOpen(false)}
          title="Hapus Proyek Konstruksi?"
          message={`Apakah Anda yakin ingin menghapus proyek "${project.projectNumber} — ${project.projectName}"? Dokumen sumber SPH dan RAB tidak akan terhapus.`}
          confirmText="Ya, Hapus Proyek"
          onConfirm={() => {
            onDeleteProject(project.id);
            setIsDeleteProjectOpen(false);
            onBack();
          }}
        />
      )}
    </div>
  );
};
