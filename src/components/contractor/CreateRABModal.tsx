'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Sparkles, 
  Percent,
  Calculator
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { RAB, Lead } from '../../types';
import { generateNextRABNumber } from '../../data/contractorRABData';

interface CreateRABModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingRABs: RAB[];
  leads?: Lead[];
  onSave: (newRAB: Omit<RAB, 'id' | 'createdAt' | 'updatedAt' | 'items' | 'materialTotal' | 'laborTotal' | 'subtotalCost' | 'overheadAmount' | 'marginAmount' | 'grandTotal'>) => void;
}

export const CreateRABModal: React.FC<CreateRABModalProps> = ({
  isOpen,
  onClose,
  existingRABs,
  leads = [],
  onSave,
}) => {
  const nextNumber = generateNextRABNumber(existingRABs);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [buildingAreaM2, setBuildingAreaM2] = useState<string>('');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [overheadValue, setOverheadValue] = useState<number>(5);
  const [marginValue, setMarginValue] = useState<number>(15);
  const [discountAmount, setDiscountAmount] = useState<string>('0');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ projectName?: string; clientName?: string }>({});

  // Auto-fill from selected Lead
  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    if (!leadId) return;
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setProjectName(lead.product || '');
      setClientName(lead.name || '');
      setClientPhone(lead.phone || '');
      setProjectLocation(lead.city || '');
      if (lead.initialNotes && !notes) {
        setNotes(lead.initialNotes);
      }
    }
  };

  const validate = () => {
    const errs: { projectName?: string; clientName?: string } = {};
    if (!projectName.trim()) errs.projectName = 'Nama proyek wajib diisi';
    if (!clientName.trim()) errs.clientName = 'Nama klien wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      rabNumber: nextNumber,
      leadId: selectedLeadId || undefined,
      projectName: projectName.trim(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '081234567890',
      projectLocation: projectLocation.trim() || 'Indonesia',
      buildingAreaM2: buildingAreaM2 ? Number(buildingAreaM2) : undefined,
      status: 'Draft',
      overheadType: 'percent',
      overheadValue: Number(overheadValue) || 0,
      marginType: 'percent',
      marginValue: Number(marginValue) || 0,
      discountAmount: Number(discountAmount) || 0,
      notes: notes.trim() || undefined,
    });

    // Reset Form
    setProjectName('');
    setClientName('');
    setClientPhone('');
    setProjectLocation('');
    setBuildingAreaM2('');
    setSelectedLeadId('');
    setOverheadValue(5);
    setMarginValue(15);
    setDiscountAmount('0');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buat Dokumen RAB Baru"
      subtitle={`Estimasi Rencana Anggaran Biaya Proyek (${nextNumber})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Quick Link from Prospek Proyek */}
        {leads.length > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <label className="block font-semibold text-slate-700 text-xs">
              Pilih dari Prospek Proyek Existing (Opsional):
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => handleSelectLead(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="">-- Buat RAB Mandiri / Proyek Baru --</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.product} ({l.city})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 1. Project Name */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Nama / Judul Pekerjaan Proyek <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (errors.projectName) setErrors({ ...errors, projectName: undefined });
              }}
              placeholder="Contoh: Renovasi Rumah Tinggal 2 Lantai"
              className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                errors.projectName
                  ? 'border-rose-500 ring-2 ring-rose-500/15'
                  : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15'
              }`}
            />
          </div>
          {errors.projectName && (
            <p className="text-rose-600 text-xs mt-1 font-medium">{errors.projectName}</p>
          )}
        </div>

        {/* 2. Client Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Klien / Pemilik Proyek <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (errors.clientName) setErrors({ ...errors, clientName: undefined });
                }}
                placeholder="Contoh: Bpk. Bambang"
                className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                  errors.clientName
                    ? 'border-rose-500 ring-2 ring-rose-500/15'
                    : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15'
                }`}
              />
            </div>
            {errors.clientName && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.clientName}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nomor WhatsApp Klien
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* 3. Location & Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Lokasi / Alamat Proyek
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
                placeholder="Contoh: Jl. Sudirman No. 45, Jakarta Selatan"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Luas Bangunan (m²)
            </label>
            <input
              type="number"
              value={buildingAreaM2}
              onChange={(e) => setBuildingAreaM2(e.target.value)}
              placeholder="Contoh: 250"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* 4. Overhead & Margin Settings */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Parameter Keuntungan & Biaya Tak Terduga:</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Overhead & Operasional (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={overheadValue}
                  onChange={(e) => setOverheadValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Margin Profit Kontraktor (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={marginValue}
                  onChange={(e) => setMarginValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Notes */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Catatan / Lingkup Khusus
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan spesifikasi awal atau kesepakatan survey..."
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Actions */}
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
            <span>Buat Dokumen RAB</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
