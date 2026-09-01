'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Sparkles, 
  AlertCircle,
  MessageCircle,
  Instagram,
  Facebook,
  Globe,
  Users,
  Layers,
  CalendarClock
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { CITIES_LIST, PRODUCTS_LIST } from '../../data/mockData';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onSave: (leadId: string, updatedData: Partial<Lead>) => void;
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSave,
}) => {
  const [name, setName] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [city, setCity] = useState(lead.city);
  const [source, setSource] = useState<LeadSource>(lead.source);
  const [product, setProduct] = useState(lead.product);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [value, setValue] = useState<string>(lead.value?.toString() || '25000000');
  const [notes, setNotes] = useState(lead.initialNotes || '');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(lead.nextFollowUpDate || '');
  const [nextFollowUpTime, setNextFollowUpTime] = useState(lead.nextFollowUpTime || '10:00');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setPhone(lead.phone);
      setCity(lead.city);
      setSource(lead.source);
      setProduct(lead.product);
      setStatus(lead.status);
      setValue(lead.value?.toString() || '25000000');
      setNotes(lead.initialNotes || '');
      setNextFollowUpDate(lead.nextFollowUpDate || '');
      setNextFollowUpTime(lead.nextFollowUpTime || '10:00');
      setErrors({});
    }
  }, [lead, isOpen]);

  const sourcesList: { id: LeadSource; label: string; icon: any }[] = [
    { id: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'Instagram', label: 'Instagram', icon: Instagram },
    { id: 'Facebook', label: 'Facebook', icon: Facebook },
    { id: 'Website', label: 'Website', icon: Globe },
    { id: 'Referral', label: 'Referral', icon: Users },
    { id: 'Lainnya', label: 'Lainnya', icon: Layers },
  ];

  const statusesList: { id: LeadStatus; label: string; dot: string }[] = [
    { id: 'Cold', label: 'Cold', dot: 'bg-slate-400' },
    { id: 'Warm', label: 'Warm', dot: 'bg-amber-500' },
    { id: 'Hot', label: 'Hot', dot: 'bg-rose-500' },
    { id: 'Closing', label: 'Closing', dot: 'bg-emerald-600' },
    { id: 'Tidak Berhasil', label: 'Tidak Berhasil', dot: 'bg-slate-400' },
  ];

  const validate = () => {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) errs.name = 'Nama calon pelanggan wajib diisi';
    if (!phone.trim()) {
      errs.phone = 'Nomor WhatsApp wajib diisi';
    } else if (phone.replace(/\D/g, '').length < 9) {
      errs.phone = 'Nomor WhatsApp minimal 9 digit';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(lead.id, {
      name: name.trim(),
      phone: phone.trim(),
      city,
      source,
      product,
      status,
      value: Number(value) || lead.value || 15000000,
      initialNotes: notes.trim() || undefined,
      nextFollowUpDate: nextFollowUpDate || undefined,
      nextFollowUpTime: nextFollowUpTime || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Data Calon Pelanggan"
      subtitle={`Perbarui informasi prospek ${lead.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* 1. Nama Lengkap */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Nama Calon Pelanggan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Contoh: Budi Santoso"
              className={`w-full pl-9 pr-3.5 py-2 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                errors.name
                  ? 'border-rose-500 ring-2 ring-rose-500/15'
                  : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* 2. Nomor WhatsApp */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Nomor WhatsApp <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder="081289123456"
              className={`w-full pl-9 pr-3.5 py-2 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                errors.phone
                  ? 'border-rose-500 ring-2 ring-rose-500/15'
                  : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* 3. Kota Domisili */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Kota Domisili <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Produk Peminatan */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Produk Peminatan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Package className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {PRODUCTS_LIST.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Estimasi Nilai Deal (Nominal Rupiah) */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Estimasi Nilai Deal (Rupiah)</span>
            <span className="text-xs text-emerald-700 font-semibold">Potensi Revenue</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {[
              { label: 'Rp 15 Jt', val: '15000000' },
              { label: 'Rp 25 Jt', val: '25000000' },
              { label: 'Rp 50 Jt', val: '50000000' },
              { label: 'Rp 100 Jt', val: '100000000' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setValue(p.val)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  value === p.val
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="25000000"
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 focus:border-emerald-600 rounded-lg text-xs sm:text-sm font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />
          </div>
        </div>

        {/* 6. Sumber Lead */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Sumber Lead <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {sourcesList.map((s) => {
              const isSelected = source === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px]">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Status Prospek */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Status Prospek <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {statusesList.map((s) => {
              const isSelected = status === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-colors text-center cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Jadwal Follow Up Berikutnya */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <CalendarClock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tanggal Follow Up</span>
            </label>
            <input
              type="date"
              value={nextFollowUpDate}
              onChange={(e) => setNextFollowUpDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Waktu / Jam</label>
            <input
              type="time"
              value={nextFollowUpTime}
              onChange={(e) => setNextFollowUpTime(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* 9. Catatan */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Catatan Tambahan
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan hasil diskusi atau kebutuhan prospek..."
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Submit Actions */}
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
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
