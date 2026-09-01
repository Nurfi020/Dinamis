'use client';

import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Check, 
  Sparkles, 
  AlertCircle,
  MessageCircle,
  Instagram,
  Facebook,
  Globe,
  Users,
  Layers
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { CITIES_LIST, PRODUCTS_LIST } from '../../data/mockData';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'followUps'>) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(CITIES_LIST[0]);
  const [source, setSource] = useState<LeadSource>('WhatsApp');
  const [product, setProduct] = useState(PRODUCTS_LIST[0]);
  const [status, setStatus] = useState<LeadStatus>('Warm');
  const [dealValue, setDealValue] = useState<string>('25000000');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const popularCities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang'];

  const sourcesList: { id: LeadSource; label: string; icon: any }[] = [
    { id: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'Instagram', label: 'Instagram', icon: Instagram },
    { id: 'Facebook', label: 'Facebook', icon: Facebook },
    { id: 'Website', label: 'Website', icon: Globe },
    { id: 'Referral', label: 'Referral', icon: Users },
    { id: 'Lainnya', label: 'Lainnya', icon: Layers },
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

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      city,
      source,
      product,
      status,
      value: Number(dealValue) || 15000000,
      initialNotes: notes.trim() || undefined,
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      nextFollowUpTime: '10:00',
    });

    // Reset Form
    setName('');
    setPhone('');
    setCity(CITIES_LIST[0]);
    setSource('WhatsApp');
    setProduct(PRODUCTS_LIST[0]);
    setStatus('Warm');
    setDealValue('25000000');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Lead Baru"
      subtitle="Input cepat calon pelanggan dengan dominan opsi klik"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* 1. Nama Lengkap (Text Input) */}
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
              placeholder="Contoh: Andi Pratama"
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

        {/* 2. Nomor WhatsApp (Text Input) */}
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
              placeholder="Contoh: 081234567890"
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

        {/* 3. Kota dengan Quick Chips */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Kota Domisili <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {popularCities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  city === c
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-white text-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Sumber Informasi (Clickable Chips) */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Sumber Informasi <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sourcesList.map((src) => {
              const Icon = src.icon;
              const isSelected = source === src.id;
              return (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => setSource(src.id)}
                  className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{src.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Produk Peminatan (Clickable Chips) */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Produk Peminatan <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRODUCTS_LIST.map((prod) => {
              const isSelected = product === prod;
              const shortName = prod.split('—')[0].trim();
              const desc = prod.split('—')[1]?.trim() || '';

              return (
                <button
                  key={prod}
                  type="button"
                  onClick={() => setProduct(prod)}
                  className={`p-2.5 rounded-lg text-left border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{shortName}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  {desc && <span className="text-[11px] text-slate-500 block mt-0.5">{desc}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Estimasi Nilai Deal (Nominal Rupiah) */}
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
                onClick={() => setDealValue(p.val)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  dealValue === p.val
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
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              placeholder="25000000"
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 focus:border-emerald-600 rounded-lg text-xs sm:text-sm font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />
          </div>
        </div>

        {/* 7. Status Awal (Selectable Segmented Buttons) */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Status Awal <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Cold' as LeadStatus, label: 'Cold', desc: 'Baru masuk', dot: 'bg-slate-400' },
              { id: 'Warm' as LeadStatus, label: 'Warm', desc: 'Berminat', dot: 'bg-amber-500' },
              { id: 'Hot' as LeadStatus, label: 'Hot', desc: 'Peluang tinggi', dot: 'bg-rose-500' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatus(s.id)}
                className={`py-2.5 px-2 rounded-lg text-center border transition-colors cursor-pointer ${
                  status === s.id
                    ? s.id === 'Cold'
                      ? 'bg-slate-100 text-slate-800 border-slate-300 font-semibold'
                      : s.id === 'Warm'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                      : 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="font-bold text-xs">{s.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 8. Catatan Awal */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Catatan Kebutuhan</span>
            <span className="text-xs text-slate-400 font-normal">Opsional</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catat pertanyaan atau kebutuhan khusus calon pembeli..."
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          />
        </div>

        {/* Submit / Action Buttons */}
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
            <span>Simpan Lead</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};