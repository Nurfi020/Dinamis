'use client';

import React from 'react';
import {
  FolderKanban,
  MapPin,
  Calendar,
  User,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DemoProject, ProjectStage } from './types';

interface ProjectsViewProps {
  projects: DemoProject[];
  onUpdateStage: (id: string, stage: ProjectStage) => void;
}

const STAGES: ProjectStage[] = [
  'Lead',
  'Survey',
  'RAB',
  'Negosiasi',
  'SPK',
  'Pengerjaan',
  'Selesai',
];

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onUpdateStage }) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-[#16A36A]" />
          <h2 className="text-xl font-extrabold text-[#0B3D2E]">Pipeline 7-Tahap Proyek Konstruksi</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
          Pindahkan proyek dari satu tahapan ke tahapan lain untuk memantau progres operasional secara real-time.
        </p>
      </div>

      {/* 7-Stage Visual Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {STAGES.map((stg, idx) => {
          const count = projects.filter((p) => p.stage === stg).length;
          return (
            <div
              key={stg}
              className="p-3 rounded-2xl bg-white border border-[#E2EAE5] text-center shadow-2xs space-y-1"
            >
              <div className="text-[10px] font-mono font-bold text-[#16A36A]">Tahap 0{idx + 1}</div>
              <div className="text-xs font-bold text-[#0B3D2E] truncate">{stg}</div>
              <div className="text-[11px] font-extrabold text-[#64756D] bg-[#F7FAF8] py-0.5 rounded-full border border-[#E2EAE5]">
                {count} Proyek
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects Cards Grid */}
      <div className="space-y-4">
        {projects.map((prj) => (
          <div
            key={prj.id}
            className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs hover:border-[#16A36A] transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2EAE5]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#16A36A] bg-[#EAF8F1] px-2 py-0.5 rounded">
                  Nilai Kontrak: Rp {(prj.contractValue / 1000000).toLocaleString('id-ID')} Jt
                </span>
                <h3 className="font-extrabold text-[#0B3D2E] text-lg mt-1">{prj.title}</h3>
                <p className="text-xs text-[#64756D]">
                  Klien: <strong>{prj.clientName}</strong> ({prj.clientPhone})
                </p>
              </div>

              {/* Stage Switcher Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64756D] font-medium hidden sm:inline">Ubah Tahap:</span>
                <select
                  value={prj.stage}
                  onChange={(e) => onUpdateStage(prj.id, e.target.value as ProjectStage)}
                  className="text-xs font-bold py-2 px-3.5 rounded-xl bg-[#0B3D2E] text-white focus:outline-none cursor-pointer shadow-xs"
                >
                  {STAGES.map((stg, idx) => (
                    <option key={stg} value={stg}>
                      Tahap {idx + 1}: {stg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] space-y-1">
                <div className="text-[#64756D] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#16A36A]" />
                  <span>Lokasi Proyek:</span>
                </div>
                <div className="font-semibold text-[#10231B] truncate">{prj.location}</div>
              </div>

              <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] space-y-1">
                <div className="text-[#64756D] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#16A36A]" />
                  <span>Jadwal Pengerjaan:</span>
                </div>
                <div className="font-semibold text-[#10231B]">
                  {prj.startDate} s/d {prj.targetEndDate}
                </div>
              </div>

              <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] space-y-1">
                <div className="text-[#64756D] flex items-center gap-1">
                  <User className="w-3 h-3 text-[#16A36A]" />
                  <span>Mandor Penanggung Jawab:</span>
                </div>
                <div className="font-semibold text-[#0B3D2E]">{prj.assignedMandor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
