'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Users, 
  Mail, 
  Sparkles, 
  ArrowRight, 
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
    { id: 'Cold', label: 'Cold', dot: 'bg-slate-400' },
    { id: 'Warm', label: 'Warm', dot: 'bg-amber-500' },
    { id: 'Hot', label: 'Hot', dot: 'bg-rose-500' },
    { id: 'Closing', label: 'Closing', dot: 'bg-emerald-600' },
    { id: 'Tidak Berhasil', label: 'Tidak Berhasil', dot: 'bg-slate-400' },
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
          <label className="block font-semibold text-slate-700 mb-1">
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
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 font-semibold text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1.1 WhatsApp Templates Picker (If WhatsApp Selected) */}
        {method === 'WhatsApp' && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Template Pesan WhatsApp:
              </span>
              <a
                href={liveWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
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
                  className={`p-1.5 rounded-md text-xs font-medium border transition-colors text-center cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
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
          <label className="block font-semibold text-slate-700 mb-1">
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
                  className={`p-1.5 rounded-md text-xs font-medium border transition-colors text-center cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {res}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Perbarui Status Prospek */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Perbarui Status Lead</span>
            <span className="text-xs text-slate-500 font-normal">
              {lead.status !== newStatus ? (
                <span className="text-emerald-700 font-semibold">
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
                  className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-colors text-center cursor-pointer ${
                    isSelected
                      ? s.id === 'Hot'
                        ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-500/15'
                        : s.id === 'Closing'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-600/15'
                        : s.id === 'Warm'
                        ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-500/15'
                        : s.id === 'Cold'
                        ? 'bg-slate-100 text-slate-800 border-slate-300 ring-2 ring-slate-400/15'
                        : 'bg-slate-100 text-slate-700 border-slate-300 ring-2 ring-slate-400/15'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span>{s.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3.1 Alasan Lost jika status Tidak Berhasil */}
        {newStatus === 'Tidak Berhasil' && (
          <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-200 space-y-1.5">
            <label className="block font-semibold text-rose-800 text-xs">
              Alasan Tidak Berhasil / Batal:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {lostReasonsList.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setLostReason(reason)}
                  className={`p-1.5 rounded-md text-xs font-medium border text-left transition-colors cursor-pointer ${
                    lostReason === reason
                      ? 'bg-rose-100 text-rose-900 border-rose-300 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50/30'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Catatan Hasil Follow Up */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Catatan Percakapan / Detail Interaksi</span>
            <span className="text-xs text-slate-400 font-normal">Opsional</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis ringkasan hasil telepon atau chat WhatsApp..."
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          />
        </div>

        {/* 5. Jadwal Follow Up Berikutnya */}
        {newStatus !== 'Closing' && newStatus !== 'Tidak Berhasil' && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 text-xs flex items-center gap-1">
                <span>Rencanakan Jadwal Follow Up Berikutnya:</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noNextFollowUp}
                  onChange={(e) => setNoNextFollowUp(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tidak Perlu Jadwal</span>
              </label>
            </div>

            {!noNextFollowUp && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Besok', days: 1 },
                    { label: '+2 Hari', days: 2 },
                    { label: '+3 Hari', days: 3 },
                    { label: '+1 Minggu', days: 7 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNextDate(getFormattedDate(preset.days))}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <input
                    type="time"
                    value={nextTime}
                    onChange={(e) => setNextTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simpan Riwayat</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};