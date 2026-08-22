import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Layers, 
  FileText, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { CITIES_LIST, PRODUCTS_LIST } from '../../data/mockData';
import { cleanPhoneNumber } from '../../utils/helpers';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLead: Partial<Lead>) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Jakarta');
  const [source, setSource] = useState<LeadSource>('WhatsApp');
  const [product, setProduct] = useState(PRODUCTS_LIST[0]);
  const [status, setStatus] = useState<LeadStatus>('Cold');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; city?: string }>({});

  const sourcesList: LeadSource[] = [
    'WhatsApp',
    'Facebook',
    'Instagram',
    'TikTok',
    'Website',
    'Referral',
    'Marketplace',
    'Lainnya',
  ];

  const popularCities = ['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Bali'];

  const validate = () => {
    const errs: { name?: string; phone?: string; city?: string } = {};
    if (!name.trim()) {
      errs.name = 'Nama calon pelanggan wajib diisi.';
    }
    if (!phone.trim()) {
      errs.phone = 'Nomor WhatsApp wajib diisi.';
    } else {
      const cleaned = cleanPhoneNumber(phone);
      if (cleaned.length < 9 || cleaned.length > 15) {
        errs.phone = 'Format nomor WhatsApp tidak valid (minimal 9 digit).';
      }
    }
    if (!city) {
      errs.city = 'Kota wajib dipilih.';
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
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      nextFollowUpTime: '10:00',
      followUps: [],
    });

    // Reset form
    setName('');
    setPhone('');
    setCity('Jakarta');
    setSource('WhatsApp');
    setProduct(PRODUCTS_LIST[0]);
    setStatus('Cold');
    setNotes('');
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Lead Baru"
      subtitle="Catat calon pelanggan dengan cepat dan minim mengetik"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Nama Input */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5 flex items-center justify-between">
            <span>Nama Lengkap <span className="text-red-400">*</span></span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Contoh: Budi Santoso"
              className={`w-full pl-9 pr-3 py-2.5 bg-[#06111F] border rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none transition-all ${
                errors.name
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-[#17324D] focus:border-[#168BFF]'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* 2. Nomor WhatsApp */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5">
            Nomor WhatsApp <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder="Contoh: 081289123456"
              className={`w-full pl-9 pr-3 py-2.5 bg-[#06111F] border rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none transition-all ${
                errors.phone
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-[#17324D] focus:border-[#168BFF]'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* 3. Kota dengan Quick Chips */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5">
            Kota Domisili <span className="text-red-400">*</span>
          </label>
          {/* Quick city chips */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {popularCities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  city === c
                    ? 'bg-[#168BFF] text-white border-[#168BFF] shadow-[0_0_10px_rgba(22,139,255,0.3)]'
                    : 'bg-[#0E233D] text-[#94A3B8] border-[#17324D] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#06111F] border border-[#17324D] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#168BFF] cursor-pointer"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-[#0B1B2E] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Sumber Informasi (Clickable Chips) */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5">
            Sumber Lead <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sourcesList.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setSource(src)}
                className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  source === src
                    ? 'bg-[#168BFF]/20 text-[#22D3EE] border-[#168BFF] shadow-[0_0_12px_rgba(22,139,255,0.25)] ring-1 ring-[#168BFF]'
                    : 'bg-[#0E233D] text-[#94A3B8] border-[#17324D] hover:text-[#F8FAFC]'
                }`}
              >
                <span>{src}</span>
                {source === src && <Check className="w-3 h-3 text-[#22D3EE]" />}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Produk */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5">
            Produk Peminatan <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Package className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#06111F] border border-[#17324D] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#168BFF] cursor-pointer"
            >
              {PRODUCTS_LIST.map((prod) => (
                <option key={prod} value={prod} className="bg-[#0B1B2E] text-white">
                  {prod}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 6. Status Awal (Segmented Button: Cold / Warm / Hot) */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5">
            Status Awal Lead <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Cold' as LeadStatus, label: 'Cold', color: 'blue' },
              { id: 'Warm' as LeadStatus, label: 'Warm', color: 'amber' },
              { id: 'Hot' as LeadStatus, label: 'Hot', color: 'red' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatus(s.id)}
                className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all ${
                  status === s.id
                    ? s.id === 'Cold'
                      ? 'bg-blue-600/30 text-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500'
                      : s.id === 'Warm'
                      ? 'bg-amber-600/30 text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-500'
                      : 'bg-red-600/30 text-red-400 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-1 ring-red-500'
                    : 'bg-[#0E233D] text-[#94A3B8] border-[#17324D] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 7. Catatan Awal (Opsional) */}
        <div>
          <label className="block font-semibold text-[#F8FAFC] mb-1.5 flex items-center justify-between">
            <span>Catatan Awal</span>
            <span className="text-[11px] text-[#94A3B8] font-normal">Opsional</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catat kebutuhan penting calon pelanggan..."
            className="w-full p-3 bg-[#06111F] border border-[#17324D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#168BFF]"
          />
        </div>

        {/* Submit Button */}
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
            <span>Simpan Lead</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
