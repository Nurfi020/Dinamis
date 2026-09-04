'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Phone,
  HardHat,
  FolderKanban,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { DemoTeamMember, DemoProject, TeamRole } from './types';

interface TeamViewProps {
  team: DemoTeamMember[];
  projects: DemoProject[];
  onAddMember: (member: Omit<DemoTeamMember, 'id'>) => void;
  onDeleteMember: (id: string) => void;
  onAssignProject: (id: string, projectTitle: string) => void;
}

const ROLES: TeamRole[] = ['Mandor', 'Tukang', 'Helper', 'Supervisor', 'Estimator'];

export const TeamView: React.FC<TeamViewProps> = ({
  team,
  projects,
  onAddMember,
  onDeleteMember,
  onAssignProject,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<TeamRole>('Tukang');
  const [phone, setPhone] = useState('0812-');
  const [assignedProjectTitle, setAssignedProjectTitle] = useState(projects[0]?.title || '');
  const [dailyRate, setDailyRate] = useState<number>(150000);

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMember({
      name,
      role,
      phone,
      assignedProjectTitle,
      dailyRate: Number(dailyRate),
      status: assignedProjectTitle ? 'Aktif di Proyek' : 'Standby',
    });

    setIsAddModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#16A36A]" />
            <h2 className="text-xl font-extrabold text-[#0B3D2E]">Manajemen Tim & Mandor Lapangan</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
            Daftar tukang, mandor, dan alokasi penugasan tenaga kerja di setiap proyek konstruksi.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0B3D2E] text-white text-xs font-bold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Anggota Tim</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="rounded-3xl bg-white border border-[#E2EAE5] p-5 shadow-xs space-y-4 hover:border-[#16A36A] transition"
          >
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E2EAE5]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#16A36A] bg-[#EAF8F1] px-2 py-0.5 rounded">
                  {member.role}
                </span>
                <h3 className="font-bold text-[#0B3D2E] text-base mt-1.5">{member.name}</h3>
                <p className="text-xs text-[#64756D] flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-[#16A36A]" />
                  <span>{member.phone}</span>
                </p>
              </div>

              <button
                onClick={() => onDeleteMember(member.id)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                title="Hapus Anggota"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Assignment & Rate */}
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="text-[#64756D] text-[11px] block">Penugasan Proyek:</label>
                <select
                  value={member.assignedProjectTitle}
                  onChange={(e) => onAssignProject(member.id, e.target.value)}
                  className="w-full text-xs font-bold py-1.5 px-2.5 rounded-xl bg-[#F7FAF8] text-[#0B3D2E] border border-[#E2EAE5] focus:outline-none cursor-pointer"
                >
                  <option value="">-- Standby / Bebas Tugas --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-2.5 bg-[#F7FAF8] rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#64756D]">Upah Harian (Estimasi):</span>
                <span className="font-bold text-[#0B3D2E]">
                  Rp {member.dailyRate.toLocaleString('id-ID')} / hari
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Tambah Tim */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E2EAE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <div className="flex items-center gap-2 text-[#0B3D2E] font-bold text-sm">
                <Users className="w-4 h-4 text-[#16A36A]" />
                <span>Tambah Tenaga Kerja Baru</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#64756D] hover:bg-[#F7FAF8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Nama Anggota Tim *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Slamet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Peran / Role Keahlian</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as TeamRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Penugasan Proyek Awal</label>
                <select
                  value={assignedProjectTitle}
                  onChange={(e) => setAssignedProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                >
                  <option value="">-- Standby / Belum Ditugaskan --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Standar Upah Harian (Rp)</label>
                <input
                  type="number"
                  min="50000"
                  step="10000"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E2EAE5]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64756D] hover:bg-[#F7FAF8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B3D2E] text-white hover:bg-[#16A36A] transition shadow-xs active:scale-98"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
