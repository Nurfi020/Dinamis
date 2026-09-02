'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Activity,
  Users,
  CloudSun,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Layers,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { ContractorProject, ProjectMilestone, ProgressLogEntry } from '../../../types';
import {
  calculatePlannedProgressForDate,
  calculateProjectProgress,
  calculateDeviation,
  getMilestoneStatus
} from '../../../data/contractorProjectData';

interface LogProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ContractorProject;
  existingLogToEdit?: ProgressLogEntry | null;
  onSave: (
    newLog: ProgressLogEntry,
    updatedMilestones?: ProjectMilestone[]
  ) => void;
}

export const LogProgressModal: React.FC<LogProgressModalProps> = ({
  isOpen,
  onClose,
  project,
  existingLogToEdit,
  onSave,
}) => {
  const [date, setDate] = useState<string>('');
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [workSummary, setWorkSummary] = useState<string>('');
  const [weatherCondition, setWeatherCondition] = useState<'Cerah' | 'Hujan Ringan' | 'Hujan Lebat'>('Cerah');
  const [manpowerCount, setManpowerCount] = useState<number>(12);
  const [notes, setNotes] = useState<string>('');

  // Working milestones progress state
  const [milestonesState, setMilestonesState] = useState<ProjectMilestone[]>([]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(existingLogToEdit?.date || today);

      // Calculate default week number based on project start date
      if (project.contractStartDate) {
        const start = new Date(project.contractStartDate).getTime();
        const cur = new Date(existingLogToEdit?.date || today).getTime();
        const diffDays = Math.max(0, Math.floor((cur - start) / (1000 * 60 * 60 * 24)));
        const calculatedWeek = Math.max(1, Math.floor(diffDays / 7) + 1);
        setWeekNumber(existingLogToEdit?.weekNumber || calculatedWeek);
      } else {
        setWeekNumber(existingLogToEdit?.weekNumber || 1);
      }

      setWorkSummary(existingLogToEdit?.workSummary || '');
      setWeatherCondition(existingLogToEdit?.weatherCondition || 'Cerah');
      setManpowerCount(existingLogToEdit?.manpowerCount || 12);
      setNotes(existingLogToEdit?.notes || '');

      // Clone project milestones
      setMilestonesState(JSON.parse(JSON.stringify(project.milestones || [])));
    }
  }, [isOpen, existingLogToEdit, project]);

  // Handle individual milestone progress slider / input change
  const handleMilestoneProgressChange = (idx: number, progressValue: number) => {
    const clamped = Math.min(100, Math.max(0, progressValue));
    setMilestonesState((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        actualProgressPercent: clamped,
        status: getMilestoneStatus(clamped),
      };
      return updated;
    });
  };

  // Real-time calculated progress and deviation
  const actualProgressPercent = calculateProjectProgress(milestonesState);
  const plannedProgressPercent = calculatePlannedProgressForDate(
    {
      contractStartDate: project.contractStartDate,
      contractEndDate: project.contractEndDate,
      milestones: milestonesState
    },
    date || new Date().toISOString().split('T')[0]
  );
  const deviationPercent = calculateDeviation(actualProgressPercent, plannedProgressPercent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const logEntry: ProgressLogEntry = {
      id: existingLogToEdit?.id || `log-${Date.now()}`,
      date,
      weekNumber,
      plannedProgressPercent,
      actualProgressPercent,
      deviationPercent,
      workSummary: workSummary.trim() || `Laporan opname progres fisik lapangan minggu ke-${weekNumber}.`,
      weatherCondition,
      manpowerCount,
      notes: notes.trim(),
      createdAt: existingLogToEdit?.createdAt || new Date().toISOString(),
    };

    onSave(logEntry, milestonesState);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingLogToEdit ? `Edit Opname Progres (Minggu ${weekNumber})` : `Catat Opname Progres Lapangan`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Header Metrics Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-white rounded-lg border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Target Kurva S
            </span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-blue-700">
              {plannedProgressPercent}%
            </span>
          </div>

          <div className="p-2 bg-white rounded-lg border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Realisasi Lapangan
            </span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-emerald-700">
              {actualProgressPercent}%
            </span>
          </div>

          <div className="p-2 bg-white rounded-lg border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Deviasi Progres
            </span>
            <span
              className={`font-mono text-sm sm:text-base font-extrabold flex items-center justify-center gap-1 ${
                deviationPercent >= 0
                  ? 'text-emerald-700'
                  : deviationPercent < -5
                  ? 'text-rose-600'
                  : 'text-amber-700'
              }`}
            >
              {deviationPercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {deviationPercent > 0 ? `+${deviationPercent}%` : `${deviationPercent}%`}
            </span>
          </div>
        </div>

        {/* 2. Date, Week & Site Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Tanggal Opname <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Minggu Ke- <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={weekNumber}
              onChange={(e) => setWeekNumber(parseInt(e.target.value, 10) || 1)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Jumlah Pekerja
            </label>
            <input
              type="number"
              min="0"
              value={manpowerCount}
              onChange={(e) => setManpowerCount(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kondisi Cuaca Lapangan
            </label>
            <select
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
            >
              <option value="Cerah">☀️ Cerah / Normal (Optimal)</option>
              <option value="Hujan Ringan">🌦️ Hujan Ringan (Sebagian Kerja)</option>
              <option value="Hujan Lebat">⛈️ Hujan Lebat / Badai (Pekerjaan Terhenti)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Internal / Kendala Lapangan
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Keterlambatan pengiriman semen, cuaca hujan 2 hari..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>

        {/* 3. Milestone-by-Milestone Progress Sliders */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Update Progres Fisik Tiap Tahapan Pekerjaan (WBS)
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Akumulasi Tertimbang: <b className="text-emerald-700 font-bold">{actualProgressPercent}%</b>
            </span>
          </div>

          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {milestonesState.map((m, idx) => (
              <div
                key={m.id}
                className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{m.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (Bobot: {m.weightPercent}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                        m.actualProgressPercent >= 100
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : m.actualProgressPercent > 0
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {m.actualProgressPercent >= 100 ? 'Selesai' : m.actualProgressPercent > 0 ? 'Sedang Berjalan' : 'Belum Mulai'}
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-900 w-12 text-right">
                      {m.actualProgressPercent}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={m.actualProgressPercent || 0}
                    onChange={(e) => handleMilestoneProgressChange(idx, parseFloat(e.target.value) || 0)}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={m.actualProgressPercent || 0}
                    onChange={(e) => handleMilestoneProgressChange(idx, parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-right text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Work Summary */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Uraian Ringkasan Pekerjaan Selesai Minggu Ini
          </label>
          <textarea
            rows={3}
            value={workSummary}
            onChange={(e) => setWorkSummary(e.target.value)}
            placeholder="Rincian pekerjaan yang telah diselesaikan pada periode minggu ini (misal: Pengecoran plat lantai 2 seluas 120m², pemasangan bata ringan lantai 1...)"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simpan Log Opname</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
