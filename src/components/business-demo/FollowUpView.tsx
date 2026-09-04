'use client';

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  Video,
  Send,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import {
  DemoFollowUp,
  DemoLead,
  FollowUpType,
} from './types';

interface FollowUpViewProps {
  followups: DemoFollowUp[];
  leads: DemoLead[];
  onAddFollowUp: (data: Omit<DemoFollowUp, 'id' | 'status'>) => void;
  onCompleteFollowUp: (id: string, note?: string) => void;
  onDeleteFollowUp: (id: string) => void;
}

const FOLLOWUP_TYPES: FollowUpType[] = [
  'WhatsApp',
  'Telepon',
  'Meeting',
  'Kirim Penawaran',
];

export function FollowUpView({
  followups,
  leads,
  onAddFollowUp,
  onCompleteFollowUp,
  onDeleteFollowUp,
}: FollowUpViewProps) {
  const [activeTab, setActiveTab] = useState<'hari-ini' | 'terlambat' | 'mendatang' | 'selesai'>('hari-ini');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completionNote, setCompletionNote] = useState('');

  const todayStr = '2026-09-04';

  // Form State
  const [formData, setFormData] = useState({
    leadId: leads[0]?.id || '',
    type: 'WhatsApp' as FollowUpType,
    dueDate: todayStr,
    dueTime: '14:00',
    notes: '',
  });

  const todayList = followups.filter(
    (f) => f.dueDate === todayStr && f.status === 'Pending'
  );
  const overdueList = followups.filter((f) => f.status === 'Terlambat');
  const upcomingList = followups.filter(
    (f) => f.dueDate > todayStr && f.status === 'Pending'
  );
  const completedList = followups.filter((f) => f.status === 'Selesai');

  const currentList =
    activeTab === 'hari-ini'
      ? todayList
      : activeTab === 'terlambat'
      ? overdueList
      : activeTab === 'mendatang'
      ? upcomingList
      : completedList;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLead = leads.find((l) => l.id === formData.leadId);
    if (!selectedLead) return;

    onAddFollowUp({
      leadId: selectedLead.id,
      leadName: selectedLead.name,
      leadPhone: selectedLead.phone,
      type: formData.type,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      notes: formData.notes.trim() || `Follow-up ${formData.type} terjadwal.`,
    });

    setIsAddModalOpen(false);
    setFormData({
      leadId: leads[0]?.id || '',
      type: 'WhatsApp',
      dueDate: todayStr,
      dueTime: '14:00',
      notes: '',
    });
  };

  const handleConfirmComplete = () => {
    if (!completingId) return;
    onCompleteFollowUp(completingId, completionNote.trim() || undefined);
    setCompletingId(null);
    setCompletionNote('');
  };

  const getTypeIcon = (type: FollowUpType) => {
    switch (type) {
      case 'WhatsApp':
        return <MessageCircle className="w-3.5 h-3.5 text-[#16A36A]" />;
      case 'Telepon':
        return <Phone className="w-3.5 h-3.5 text-[#0B3D2E]" />;
      case 'Meeting':
        return <Video className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'Kirim Penawaran':
        return <Send className="w-3.5 h-3.5 text-[#D97706]" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Schedule Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E]">
            Jadwal Follow-up & Reminder
          </h2>
          <p className="text-xs sm:text-sm text-[#64756D]">
            Pastikan tim sales tidak lupa menghubungi prospek pada waktu yang tepat.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-xs sm:text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Follow-up</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="p-1.5 rounded-2xl bg-white border border-[#E2EAE5] shadow-2xs flex flex-wrap items-center gap-1">
        {[
          { key: 'hari-ini', label: 'Hari Ini', count: todayList.length, urgent: false },
          { key: 'terlambat', label: 'Terlambat', count: overdueList.length, urgent: overdueList.length > 0 },
          { key: 'mendatang', label: 'Mendatang', count: upcomingList.length, urgent: false },
          { key: 'selesai', label: 'Selesai', count: completedList.length, urgent: false },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-[#0B3D2E] text-white shadow-xs'
                  : 'text-[#64756D] hover:bg-[#F7FAF8] hover:text-[#0B3D2E]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : tab.urgent
                    ? 'bg-[#FEE2E2] text-[#DC2626]'
                    : 'bg-[#EAF8F1] text-[#16A36A]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Follow-up List */}
      {currentList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#E2EAE5] space-y-3">
          <CheckCircle2 className="w-10 h-10 text-[#16A36A] mx-auto" />
          <h3 className="text-sm font-bold text-[#0B3D2E]">Tidak Ada Jadwal Pada Kategori Ini</h3>
          <p className="text-xs text-[#64756D]">
            Semua tindak lanjut pada kategori ini sudah beres atau belum dijadwalkan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((fu) => {
            const isCompleted = fu.status === 'Selesai';
            const cleanPhone = fu.leadPhone.replace(/\D/g, '');
            const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=Halo%20${encodeURIComponent(fu.leadName)},%20saya%20dari%20tim%20sales%20ingin%20follow-up%20terkait%20kebutuhan%20bisnis%20Anda.`;

            return (
              <div
                key={fu.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2EAE5] hover:border-[#16A36A] transition shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-[#10231B]">
                        {fu.leadName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] flex items-center gap-1">
                        {getTypeIcon(fu.type)}
                        <span>{fu.type}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#64756D]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#16A36A]" />
                        {fu.dueDate} {fu.dueTime ? `pukul ${fu.dueTime}` : ''}
                      </span>
                      <span>•</span>
                      <span>{fu.leadPhone}</span>
                      {fu.completedAt && (
                        <>
                          <span>•</span>
                          <span className="text-[#16A36A] font-medium">
                            Selesai pada: {fu.completedAt}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF8F1] text-[#16A36A] font-bold text-xs hover:bg-[#16A36A] hover:text-white transition shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat WA</span>
                    </a>

                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => setCompletingId(fu.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B3D2E] text-white font-bold text-xs hover:bg-[#16A36A] transition shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span>Tandai Selesai</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteFollowUp(fu.id)}
                      className="p-2 rounded-xl text-[#64756D] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition"
                      title="Hapus Follow-up"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes box */}
                <div className="p-3 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#64756D] leading-relaxed">
                  <strong className="text-[#0B3D2E]">Catatan Follow-up: </strong>
                  {fu.notes}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Jadwalkan Follow-up Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2EAE5] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <h3 className="text-lg font-extrabold text-[#0B3D2E]">
                Jadwalkan Follow-up
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#64756D] hover:text-[#10231B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Pilih Lead / Prospek *</label>
                <select
                  value={formData.leadId}
                  onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.company} ({l.stage})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Jenis Follow-up</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as FollowUpType })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  >
                    {FOLLOWUP_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Waktu / Jam</label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Tanggal Jadwal</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Catatan Agenda Follow-up</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Kirim penawaran revisi diskon paket..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2EAE5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2EAE5] font-semibold text-[#64756D] hover:bg-[#F7FAF8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white font-bold hover:bg-[#16A36A] transition shadow-xs"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Konfirmasi Selesai Follow-up */}
      {completingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2EAE5] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-[#0B3D2E]">
              Tandai Follow-up Selesai
            </h3>
            <p className="text-xs text-[#64756D]">
              Tambahkan catatan hasil percakapan (opsional) sebelum menandai status selesai:
            </p>

            <textarea
              rows={3}
              placeholder="Contoh: Klien setuju, minta invoice dikirimkan besok..."
              value={completionNote}
              onChange={(e) => setCompletionNote(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCompletingId(null)}
                className="px-4 py-2 rounded-xl border border-[#E2EAE5] text-xs font-semibold text-[#64756D] hover:bg-[#F7FAF8]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-5 py-2 rounded-xl bg-[#16A36A] text-white font-bold text-xs hover:bg-[#22C55E] transition"
              >
                Konfirmasi Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
