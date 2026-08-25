'use client';

import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Package, 
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
          <label className="block font-bold text-[#17221C] mb-1.5">
            Nama Calon Pelanggan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Contoh: Andi Pratama"
              className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-sm text-[#17221C] placeholder-[#66736B] focus:outline-none transition-all ${
                errors.name
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-[#E2E9E4] focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20'
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
          <label className="block font-bold text-[#17221C] mb-1.5">
            Nomor WhatsApp <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder="Contoh: 081234567890"
              className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-sm text-[#17221C] placeholder-[#66736B] focus:outline-none transition-all ${
                errors.phone
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-[#E2E9E4] focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20'
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
          <label className="block font-bold text-[#17221C] mb-1.5">
            Kota Domisili <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {popularCities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  city === c
                    ? 'bg-[#E8F7EF] text-[#006B3C] border-[#00A651] shadow-xs'
                    : 'bg-white text-[#66736B] border-[#E2E9E4] hover:border-[#00A651]/40 hover:text-[#17221C]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E2E9E4] rounded-xl text-sm text-[#17221C] font-medium focus:outline-none focus:border-[#00A651] cursor-pointer"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-white text-[#17221C]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Sumber Informasi (Clickable Chips) */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
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
                  className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F7EF] text-[#006B3C] border-[#00A651] shadow-xs ring-1 ring-[#00A651]'
                      : 'bg-white text-[#66736B] border-[#E2E9E4] hover:border-[#00A651]/40 hover:text-[#17221C]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#00A651]" />
                    <span>{src.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#006B3C]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Produk Peminatan (Clickable Chips) */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
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
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F7EF] text-[#006B3C] border-[#00A651] shadow-xs ring-1 ring-[#00A651]'
                      : 'bg-white text-[#66736B] border-[#E2E9E4] hover:border-[#00A651]/40 hover:text-[#17221C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#17221C]">{shortName}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#006B3C]" />}
                  </div>
                  {desc && <span className="text-[11px] text-[#66736B] block mt-0.5">{desc}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Status Awal (Large Selectable Segmented Buttons) */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
            Bagaimana Kondisi Lead? (Status Awal) <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'Cold' as LeadStatus, label: 'Cold', desc: 'Baru tanya', dot: 'bg-[#64748B]' },
              { id: 'Warm' as LeadStatus, label: 'Warm', desc: 'Tertarik produk', dot: 'bg-[#F59E0B]' },
              { id: 'Hot' as LeadStatus, label: 'Hot', desc: 'Siap beli', dot: 'bg-[#EF4444]' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatus(s.id)}
                className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                  status === s.id
                    ? s.id === 'Cold'
                      ? 'bg-slate-100 text-slate-800 border-slate-400 ring-2 ring-slate-400/20'
                      : s.id === 'Warm'
                      ? 'bg-amber-50 text-amber-800 border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-rose-50 text-rose-700 border-rose-400 ring-2 ring-rose-500/20'
                    : 'bg-white text-[#66736B] border-[#E2E9E4] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                  <span className="font-extrabold text-xs">{s.label}</span>
                </div>
                <span className="text-[10px] opacity-80 block">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 7. Catatan Awal (Opsional) */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5 flex items-center justify-between">
            <span>Catatan Kebutuhan Calon Pelanggan</span>
            <span className="text-xs text-[#66736B] font-normal">Opsional</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catat pertanyaan atau kebutuhan khusus calon pembeli..."
            className="w-full p-3 bg-white border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] placeholder-[#66736B] focus:outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20"
          />
        </div>

        {/* Submit / Action Buttons */}
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
            <span>Simpan Lead Baru</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};