'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Users, 
  Mail, 
  Check, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  RotateCcw,
  Send,
  FileText
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { 
  Lead, 
  LeadStatus, 
  FollowUpMethod, 
  FollowUpResult, 
  FollowUpLog,
  LostReason
} from '../../types';
import { 
  triggerClosingConfetti, 
  getWhatsAppTemplate, 
  generateWhatsAppUrl,
  WhatsAppTemplateType 
} from '../../utils/helpers';

interface LogFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onSaveFollowUp: (leadId: string, log: Omit<FollowUpLog, 'id' | 'createdAt'>) => void;
}

export const LogFollowUpModal: React.FC<LogFollowUpModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSaveFollowUp,
}) => {
  const [method, setMethod] = useState<FollowUpMethod>('WhatsApp');
  const [result, setResult] = useState<FollowUpResult>('Tertarik');
  const [newStatus, setNewStatus] = useState<LeadStatus>(lead.status);
  const [lostReason, setLostReason] = useState<LostReason>('Harga terlalu mahal');
  const [notes, setNotes] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateType | null>(null);
  
  // Next follow up date helper calculation
  const getFormattedDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [nextDate, setNextDate] = useState<string>(getFormattedDate(1));
  const [nextTime, setNextTime] = useState<string>('10:00');
  const [noNextFollowUp, setNoNextFollowUp] = useState(lead.status === 'Closing' || lead.status === 'Tidak Berhasil');

  const methodsList: { id: FollowUpMethod; label: string; icon: any }[] = [
    { id: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'Telepon', label: 'Telepon', icon: Phone },
    { id: 'Meeting', label: 'Meeting', icon: Users },
    { id: 'Email', label: 'Email', icon: Mail },
  ];

  const resultsList: FollowUpResult[] = [
    'Tertarik',
    'Minta Harga',
    'Minta Detail',
    'Masih Pertimbangkan',
    'Siap Membeli',
    'Tidak Tertarik',
    'Tidak Bisa Dihubungi',
    ...(lead.status === 'Tidak Berhasil' ? ['Buka Kembali' as FollowUpResult] : []),
    'Lainnya',
  ];

  const lostReasonsList: LostReason[] = [
    'Harga terlalu mahal',
    'Memilih kompetitor',
    'Tidak membutuhkan produk',
    'Tidak dapat dihubungi',
    'Nomor tidak valid',
    'Lainnya',
  ];

  const statusesList: { id: LeadStatus; label: string; dot: string }[] = [
    { id: 'Cold', label: 'Cold', dot: 'bg-[#64748B]' },
    { id: 'Warm', label: 'Warm', dot: 'bg-[#F59E0B]' },
    { id: 'Hot', label: 'Hot', dot: 'bg-[#EF4444]' },
    { id: 'Closing', label: 'Closing', dot: 'bg-[#10B981]' },
    { id: 'Tidak Berhasil', label: 'Tidak Berhasil', dot: 'bg-[#6B7280]' },
  ];

  const handleApplyTemplate = (type: WhatsAppTemplateType) => {
    setSelectedTemplate(type);
    const templateText = getWhatsAppTemplate(type, lead.name, lead.product);
    setNotes(templateText);
  };

  const handleQuickResultClick = (res: FollowUpResult) => {
    setResult(res);
    if (res === 'Siap Membeli') {
      setNewStatus('Hot');
    } else if (res === 'Tidak Tertarik') {
      setNewStatus('Tidak Berhasil');
      setNoNextFollowUp(true);
    } else if (res === 'Buka Kembali') {
      setNewStatus('Warm');
      setNoNextFollowUp(false);
    } else if (res === 'Minta Harga' || res === 'Minta Detail') {
      if (lead.status === 'Cold') setNewStatus('Warm');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (newStatus === 'Closing') {
      triggerClosingConfetti();
    }

    onSaveFollowUp(lead.id, {
      date: now.toISOString().split('T')[0],
      time: currentTimeStr,
      method,
      result,
      oldStatus: lead.status,
      newStatus,
      lostReason: newStatus === 'Tidak Berhasil' ? lostReason : undefined,
      notes: notes.trim() || undefined,
      nextFollowUpDate: noNextFollowUp || newStatus === 'Closing' || newStatus === 'Tidak Berhasil' ? undefined : nextDate,
      nextFollowUpTime: noNextFollowUp || newStatus === 'Closing' || newStatus === 'Tidak Berhasil' ? undefined : nextTime,
    });

    onClose();
  };

  const liveWhatsAppUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product, notes.trim() || undefined);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Riwayat Follow Up"
      subtitle={`Catat hasil interaksi dengan ${lead.name} (${lead.product.split('—')[0].trim()})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* 1. Metode Interaksi */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
            Metode Follow Up <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {methodsList.map((m) => {
              const Icon = m.icon;
              const isSelected = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F7EF] text-[#006B3C] border-[#00A651] shadow-xs ring-1 ring-[#00A651]'
                      : 'bg-white text-[#66736B] border-[#E2E9E4] hover:border-[#00A651]/40 hover:text-[#17221C]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#00A651]" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1.1 WhatsApp Templates Picker (If WhatsApp Selected) */}
        {method === 'WhatsApp' && (
          <div className="p-3.5 bg-[#E8F7EF]/60 rounded-2xl border border-[#A7F3D0] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#006B3C] text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Template Pesan WhatsApp Siap Pakai:
              </span>
              <a
                href={liveWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006B3C] hover:underline"
              >
                <span>Buka Chat WA</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {[
                { id: 'sapaan_awal' as WhatsAppTemplateType, label: 'Sapaan Awal' },
                { id: 'followup_h3' as WhatsAppTemplateType, label: 'Follow-up H+3' },
                { id: 'penawaran_khusus' as WhatsAppTemplateType, label: 'Penawaran Khusus' },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl.id)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'bg-[#00A651] text-white border-[#00A651] shadow-xs'
                      : 'bg-white text-[#006B3C] border-[#A7F3D0] hover:bg-[#E8F7EF]'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Hasil Respon / Interaksi */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
            Hasil Respon Customer <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {resultsList.map((res) => {
              const isSelected = result === res;
              return (
                <button
                  key={res}
                  type="button"
                  onClick={() => handleQuickResultClick(res)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#00A651] text-white border-[#00A651] shadow-xs'
                      : 'bg-white text-[#66736B] border-[#E2E9E4] hover:border-[#00A651]/40 hover:text-[#17221C]'
                  }`}
                >
                  {res}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Perbarui Status Prospek (Large Selectable Segmented Buttons) */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5 flex items-center justify-between">
            <span>Perbarui Status Lead</span>
            <span className="text-xs text-[#66736B] font-normal">
              {lead.status !== newStatus ? (
                <span className="text-[#006B3C] font-bold">
                  {lead.status} → {newStatus}
                </span>
              ) : (
                `Tetap: ${lead.status}`
              )}
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {statusesList.map((s) => {
              const isSelected = newStatus === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setNewStatus(s.id);
                    if (s.id === 'Closing' || s.id === 'Tidak Berhasil') {
                      setNoNextFollowUp(true);
                    } else {
                      setNoNextFollowUp(false);
                    }
                  }}
                  className={`py-2.5 px-1.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    isSelected
                      ? s.id === 'Hot'
                        ? 'bg-rose-50 text-rose-700 border-rose-400 ring-2 ring-rose-500/20'
                        : s.id === 'Closing'
                        ? 'bg-[#E8F7EF] text-[#006B3C] border-[#A7F3D0] ring-2 ring-[#00A651]/20'
                        : s.id === 'Warm'
                        ? 'bg-amber-50 text-amber-800 border-amber-400 ring-2 ring-amber-500/20'
                        : s.id === 'Cold'
                        ? 'bg-slate-100 text-slate-800 border-slate-400 ring-2 ring-slate-400/20'
                        : 'bg-gray-100 text-gray-700 border-gray-300 ring-2 ring-gray-400/20'
                      : 'bg-white text-[#66736B] border-[#E2E9E4] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    <span>{s.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3.1 Alasan Tidak Berhasil jika status Tidak Berhasil */}
        {newStatus === 'Tidak Berhasil' && (
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
            <label className="block font-bold text-rose-800">
              Alasan Tidak Berhasil <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {lostReasonsList.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setLostReason(reason)}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    lostReason === reason
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Jadwal Follow Up Berikutnya */}
        {newStatus !== 'Closing' && newStatus !== 'Tidak Berhasil' && (
          <div className="p-4 bg-[#F7F9F8] rounded-2xl border border-[#E2E9E4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17221C]">Jadwalkan Follow Up Selanjutnya</span>
              <label className="flex items-center gap-1.5 text-xs text-[#66736B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={noNextFollowUp}
                  onChange={(e) => setNoNextFollowUp(e.target.checked)}
                  className="rounded border-[#E2E9E4] text-[#00A651] focus:ring-[#00A651]"
                />
                <span>Tidak perlu jadwal lagi</span>
              </label>
            </div>

            {!noNextFollowUp && (
              <>
                {/* Quick date chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Hari Ini', offset: 0 },
                    { label: 'Besok', offset: 1 },
                    { label: '3 Hari Lagi', offset: 3 },
                    { label: '1 Minggu Lagi', offset: 7 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setNextDate(getFormattedDate(item.offset))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        nextDate === getFormattedDate(item.offset)
                          ? 'bg-[#00A651] text-white border-[#00A651] shadow-xs'
                          : 'bg-white text-[#66736B] border-[#E2E9E4] hover:border-[#00A651]/40 hover:text-[#17221C]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E2E9E4] rounded-xl text-xs font-medium text-[#17221C] focus:outline-none focus:border-[#00A651]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Waktu</label>
                    <select
                      value={nextTime}
                      onChange={(e) => setNextTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E2E9E4] rounded-xl text-xs font-medium text-[#17221C] focus:outline-none focus:border-[#00A651] cursor-pointer"
                    >
                      <option value="09:00">09:00 Pagi</option>
                      <option value="10:30">10:30 Pagi</option>
                      <option value="13:00">13:00 Siang</option>
                      <option value="15:00">15:00 Sore</option>
                      <option value="16:30">16:30 Sore</option>
                      <option value="19:00">19:00 Malam</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 5. Catatan Percakapan / Pesan WA */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1 flex items-center justify-between">
            <span>Catatan Percakapan / Draft Pesan</span>
            <span className="text-xs text-[#66736B] font-normal">Dapat diedit bebas</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ketik catatan hasil percakapan atau gunakan template di atas..."
            className="w-full p-3 bg-white border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] placeholder-[#66736B] focus:outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E2E9E4]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#66736B] hover:text-[#17221C] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-sm font-bold shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simpan Riwayat Follow Up</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};