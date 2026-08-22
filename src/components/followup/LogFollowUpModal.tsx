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
  ArrowRight
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { 
  Lead, 
  LeadStatus, 
  FollowUpMethod, 
  FollowUpResult, 
  FollowUpLog 
} from '../../types';
import { triggerClosingConfetti } from '../../utils/helpers';

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
  const [notes, setNotes] = useState('');
  
  // Next follow up date helper calculation
  const getFormattedDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [nextDate, setNextDate] = useState<string>(getFormattedDate(1)); // Besok by default
  const [nextTime, setNextTime] = useState<string>('10:00');
  const [noNextFollowUp, setNoNextFollowUp] = useState(false);

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
    'Lainnya',
  ];

  const statusesList: { id: LeadStatus; label: string }[] = [
    { id: 'Cold', label: 'Cold' },
    { id: 'Warm', label: 'Warm' },
    { id: 'Hot', label: 'Hot' },
    { id: 'Closing', label: 'Closing' },
    { id: 'Tidak Berhasil', label: 'Tidak Berhasil' },
  ];

  const handleQuickResultClick = (res: FollowUpResult) => {
    setResult(res);
    // Auto suggest smart status based on result choice
    if (res === 'Siap Membeli') {
      setNewStatus('Hot');
    } else if (res === 'Tidak Tertarik') {
      setNewStatus('Tidak Berhasil');
      setNoNextFollowUp(true);
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
      notes: notes.trim() || undefined,
      oldStatus: lead.status,
      newStatus,
      nextFollowUpDate: noNextFollowUp ? undefined : nextDate,
      nextFollowUpTime: noNextFollowUp ? undefined : nextTime,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Hasil Follow Up"
      subtitle={`Untuk ${lead.name} (${lead.product.split('—')[0].trim()})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Metode Follow Up (Pilihan Cepat) */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5">
            Metode Follow Up <span className="text-red-400">*</span>
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
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#168BFF] text-white border-[#168BFF] shadow-[0_0_15px_rgba(22,139,255,0.3)]'
                      : 'bg-[#0E233D] text-[#94A3B8] border-[#17324D] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Hasil Follow Up (8 Quick Chips) */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5">
            Hasil Interaksi <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {resultsList.map((res) => {
              const isSelected = result === res;
              return (
                <button
                  key={res}
                  type="button"
                  onClick={() => handleQuickResultClick(res)}
                  className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    isSelected
                      ? 'bg-[#168BFF]/20 text-[#22D3EE] border-[#168BFF] font-bold shadow-[0_0_12px_rgba(22,139,255,0.2)]'
                      : 'bg-[#0E233D] text-[#94A3B8] border-[#17324D] hover:text-white'
                  }`}
                >
                  {res}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Update Status Lead */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5 flex items-center justify-between">
            <span>Update Status Lead</span>
            <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
              Saat ini: <b className="text-white">{lead.status}</b>
              {lead.status !== newStatus && (
                <>
                  <ArrowRight className="w-3 h-3 text-[#22D3EE]" />
                  <b className="text-[#22D3EE]">{newStatus}</b>
                </>
              )}
            </span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {statusesList.map((s) => {
              const isSelected = newStatus === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setNewStatus(s.id)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all text-center ${
                    isSelected
                      ? s.id === 'Hot'
                        ? 'bg-red-500/20 text-red-400 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : s.id === 'Closing'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : s.id === 'Warm'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : s.id === 'Cold'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        : 'bg-slate-500/20 text-slate-400 border-slate-500'
                      : 'bg-[#0E233D] text-[#94A3B8] border-[#17324D] hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Jadwal Follow Up Berikutnya */}
        <div className="p-3 bg-[#06111F] rounded-xl border border-[#17324D] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#F8FAFC]">Jadwal Follow Up Berikutnya</span>
            <label className="flex items-center gap-1.5 text-xs text-[#94A3B8] cursor-pointer">
              <input
                type="checkbox"
                checked={noNextFollowUp}
                onChange={(e) => setNoNextFollowUp(e.target.checked)}
                className="rounded border-[#17324D] bg-[#0E233D] text-[#168BFF]"
              />
              <span>Tidak perlu follow up lagi</span>
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      nextDate === getFormattedDate(item.offset)
                        ? 'bg-[#168BFF] text-white border-[#168BFF]'
                        : 'bg-[#0E233D] text-[#94A3B8] border-[#17324D] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Date & Time Selectors */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] text-[#94A3B8] mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B1B2E] border border-[#17324D] rounded-xl text-xs text-white focus:outline-none focus:border-[#168BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#94A3B8] mb-1">Waktu</label>
                  <select
                    value={nextTime}
                    onChange={(e) => setNextTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B1B2E] border border-[#17324D] rounded-xl text-xs text-white focus:outline-none focus:border-[#168BFF]"
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

        {/* 5. Catatan Tambahan (Opsional) */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1 flex items-center justify-between">
            <span>Catatan Hasil Obrolan</span>
            <span className="text-[11px] text-[#94A3B8] font-normal">Opsional</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Customer minta diskon 10% dan minta dikirimkan quotation..."
            className="w-full p-3 bg-[#06111F] border border-[#17324D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#168BFF]"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#17324D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-[#0E233D] transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white text-sm font-bold shadow-[0_0_20px_rgba(22,139,255,0.4)] active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simpan Follow Up</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
