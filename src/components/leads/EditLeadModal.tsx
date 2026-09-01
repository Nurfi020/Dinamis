'use client';

import React, { useState, useEffect } from 'react';
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
    { id: 'Cold', label: 'Cold', dot: 'bg-[#64748B]' },
    { id: 'Warm', label: 'Warm', dot: 'bg-[#F59E0B]' },
    { id: 'Hot', label: 'Hot', dot: 'bg-[#EF4444]' },
    { id: 'Closing', label: 'Closing', dot: 'bg-[#10B981]' },
    { id: 'Tidak Berhasil', label: 'Tidak Berhasil', dot: 'bg-[#6B7280]' },
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
      initialNotes: notes.trim() || undefined,
      nextFollowUpDate: status === 'Closing' || status === 'Tidak Berhasil' ? undefined : (nextFollowUpDate || undefined),
      nextFollowUpTime: status === 'Closing' || status === 'Tidak Berhasil' ? undefined : (nextFollowUpTime || undefined),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Data Calon Pelanggan"
      subtitle={`Perbarui informasi data prospek ${lead.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* 1. Nama Lengkap */}
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
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Contoh: Bpk. Hendra Gunawan"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#F7F9F8] border rounded-xl text-xs sm:text-sm text-[#17221C] focus:outline-none focus:bg-white transition-all ${
                errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E9E4] focus:border-[#00A651]'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-rose-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* 2. Nomor WhatsApp */}
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
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              placeholder="08xxxxxxxxxx"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#F7F9F8] border rounded-xl text-xs sm:text-sm text-[#17221C] font-mono focus:outline-none focus:bg-white transition-all ${
                errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E9E4] focus:border-[#00A651]'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-rose-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* 3. Kota Domisili */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
            Kota Domisili <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs sm:text-sm text-[#17221C] focus:outline-none focus:border-[#00A651] focus:bg-white cursor-pointer"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Produk Peminatan */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
            Produk Peminatan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Package className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs sm:text-sm text-[#17221C] focus:outline-none focus:border-[#00A651] focus:bg-white cursor-pointer"
            >
              {PRODUCTS_LIST.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Sumber Lead */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
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
                  className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F7EF] text-[#006B3C] border-[#00A651] shadow-xs'
                      : 'bg-white text-[#66736B] border-[#E2E9E4] hover:border-[#00A651]/40'
                  }`}
                >
                  <s.icon className="w-4 h-4 text-[#00A651]" />
                  <span className="text-[11px]">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Status Prospek */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
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
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F7EF] text-[#006B3C] border-[#00A651] shadow-xs ring-1 ring-[#00A651]'
                      : 'bg-white text-[#66736B] border-[#E2E9E4] hover:bg-slate-50'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Catatan */}
        <div>
          <label className="block font-bold text-[#17221C] mb-1.5">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informasi kebutuhan spesifik, preferensi, dsb."
            className="w-full px-3.5 py-2.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs sm:text-sm text-[#17221C] focus:outline-none focus:border-[#00A651] focus:bg-white resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E9E4]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E2E9E4] text-xs font-bold text-[#66736B] hover:text-[#17221C] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
