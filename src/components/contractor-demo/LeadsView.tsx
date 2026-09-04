'use client';

import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Trash2,
  Phone,
  MessageSquare,
  Sparkles,
  X,
  Search,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { DemoLead, LeadStatus } from './types';

interface LeadsViewProps {
  leads: DemoLead[];
  onAddLead: (lead: Omit<DemoLead, 'id' | 'createdAt' | 'lastFollowUp'>) => void;
  onUpdateStatus: (id: string, status: LeadStatus, note?: string) => void;
  onDeleteLead: (id: string) => void;
}

const STATUS_OPTIONS: LeadStatus[] = [
  'Lead Baru',
  'Dihubungi',
  'Survey',
  'RAB',
  'Negosiasi',
  'Deal',
  'Tidak Jadi',
];

const PRESET_SOURCES = ['Website DINAMIS', 'WhatsApp Referral', 'Instagram Ads', 'Rekomendasi Klien', 'Walk-in'];

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onAddLead,
  onUpdateStatus,
  onDeleteLead,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<DemoLead | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0812-');
  const [projectType, setProjectType] = useState('Renovasi Rumah 2 Lantai');
  const [source, setSource] = useState('Website DINAMIS');
  const [potentialValue, setPotentialValue] = useState(120000000);
  const [status, setStatus] = useState<LeadStatus>('Lead Baru');
  const [notes, setNotes] = useState('Klien ingin survei awal dan estimasi biaya.');

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddLead({
      name,
      phone,
      projectType,
      source,
      potentialValue: Number(potentialValue),
      status,
      notes,
    });

    setIsAddModalOpen(false);
    setName('');
    setNotes('');
  };

  const filteredLeads = leads.filter((l) => {
    const matchFilter = filter === 'all' || l.status === filter;
    const matchSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header with Actions */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-[#16A36A]" />
            <h2 className="text-xl font-extrabold text-[#0B3D2E]">Manajemen Lead & Prospek</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
            Kelola kontak calon klien, potensi nilai proyek, dan tahapan follow-up.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0B3D2E] text-white text-xs font-bold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lead Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filter === 'all'
                ? 'bg-[#0B3D2E] text-white'
                : 'bg-white border border-[#E2EAE5] text-[#64756D] hover:text-[#0B3D2E]'
            }`}
          >
            Semua ({leads.length})
          </button>
          {STATUS_OPTIONS.map((st) => {
            const count = leads.filter((l) => l.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  filter === st
                    ? 'bg-[#0B3D2E] text-white'
                    : 'bg-white border border-[#E2EAE5] text-[#64756D] hover:text-[#0B3D2E]'
                }`}
              >
                {st} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64756D]" />
          <input
            type="text"
            placeholder="Cari nama, telp, proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-[#E2EAE5] rounded-xl focus:outline-none focus:border-[#16A36A]"
          />
        </div>
      </div>

      {/* Leads Cards Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-3xl bg-white border border-[#E2EAE5] p-5 shadow-xs hover:border-[#16A36A] transition space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#64756D] bg-[#F7FAF8] px-2 py-0.5 rounded border border-[#E2EAE5]">
                  {lead.source}
                </span>
                <h3 className="font-bold text-[#0B3D2E] text-base mt-1">{lead.name}</h3>
                <p className="text-xs text-[#10231B] font-semibold">{lead.projectType}</p>
              </div>

              {/* Status Dropdown */}
              <select
                value={lead.status}
                onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                className="text-xs font-bold py-1 px-2.5 rounded-full bg-[#EAF8F1] text-[#16A36A] border border-[#D1DDD6] focus:outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E2EAE5]">
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#64756D]">Potensi Nilai:</span>
                <div className="font-bold text-[#0B3D2E]">
                  Rp {lead.potentialValue.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#64756D]">Kontak WhatsApp:</span>
                <div className="font-semibold text-[#10231B] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#16A36A]" />
                  <span>{lead.phone}</span>
                </div>
              </div>
            </div>

            {lead.notes && (
              <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-[11px] text-[#64756D] italic">
                &ldquo;{lead.notes}&rdquo;
              </div>
            )}

            <div className="flex items-center justify-between pt-2 text-xs text-[#64756D]">
              <span>Follow-up: {lead.lastFollowUp}</span>
              <button
                onClick={() => onDeleteLead(lead.id)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                title="Hapus Lead"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#E2EAE5] text-[#64756D] space-y-2">
          <p className="text-sm">Tidak ada data lead pada filter ini.</p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-[#16A36A] hover:underline"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Modal: Tambah Lead */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2EAE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <div className="flex items-center gap-2 text-[#0B3D2E] font-bold text-sm">
                <Plus className="w-4 h-4 text-[#16A36A]" />
                <span>Tambah Lead Prospek Baru</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#64756D] hover:bg-[#F7FAF8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Nama Calon Klien *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Gunawan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Nomor WhatsApp</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Sumber Lead</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  >
                    {PRESET_SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Rencana Jenis Proyek</label>
                  <input
                    type="text"
                    placeholder="Renovasi / Bangun Baru / Interior"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Estimasi Nilai (Rp)</label>
                  <input
                    type="number"
                    step="5000000"
                    value={potentialValue}
                    onChange={(e) => setPotentialValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Tahap Status Awal</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Catatan Awal Kebutuhan</label>
                <textarea
                  rows={2}
                  placeholder="Kebutuhan khusus atau catatan kontak klien..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
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
                  Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
