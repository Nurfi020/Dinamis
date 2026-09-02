'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  Calculator,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { RAB, RABStatus } from '../../types';

interface EditRABModalProps {
  isOpen: boolean;
  onClose: () => void;
  rab: RAB;
  onSave: (rabId: string, updatedData: Partial<RAB>) => void;
}

export const EditRABModal: React.FC<EditRABModalProps> = ({
  isOpen,
  onClose,
  rab,
  onSave,
}) => {
  const [projectName, setProjectName] = useState(rab.projectName);
  const [clientName, setClientName] = useState(rab.clientName);
  const [clientPhone, setClientPhone] = useState(rab.clientPhone);
  const [projectLocation, setProjectLocation] = useState(rab.projectLocation);
  const [buildingAreaM2, setBuildingAreaM2] = useState<string>(
    rab.buildingAreaM2 ? String(rab.buildingAreaM2) : ''
  );
  const [status, setStatus] = useState<RABStatus>(rab.status);
  const [overheadValue, setOverheadValue] = useState<number>(rab.overheadValue ?? 5);
  const [marginValue, setMarginValue] = useState<number>(rab.marginValue ?? 15);
  const [discountAmount, setDiscountAmount] = useState<string>(
    rab.discountAmount ? String(rab.discountAmount) : '0'
  );
  const [notes, setNotes] = useState(rab.notes || '');
  const [errors, setErrors] = useState<{ projectName?: string; clientName?: string }>({});

  useEffect(() => {
    if (rab) {
      setProjectName(rab.projectName);
      setClientName(rab.clientName);
      setClientPhone(rab.clientPhone);
      setProjectLocation(rab.projectLocation);
      setBuildingAreaM2(rab.buildingAreaM2 ? String(rab.buildingAreaM2) : '');
      setStatus(rab.status);
      setOverheadValue(rab.overheadValue ?? 5);
      setMarginValue(rab.marginValue ?? 15);
      setDiscountAmount(rab.discountAmount ? String(rab.discountAmount) : '0');
      setNotes(rab.notes || '');
      setErrors({});
    }
  }, [rab, isOpen]);

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

    onSave(rab.id, {
      projectName: projectName.trim(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || rab.clientPhone,
      projectLocation: projectLocation.trim() || rab.projectLocation,
      buildingAreaM2: buildingAreaM2 ? Number(buildingAreaM2) : undefined,
      status,
      overheadValue: Number(overheadValue) || 0,
      marginValue: Number(marginValue) || 0,
      discountAmount: Number(discountAmount) || 0,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Informasi RAB"
      subtitle={`Perbarui rincian proyek & parameter biaya (${rab.rabNumber})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
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
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
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
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
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
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
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
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
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
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* 4. Status Selection */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Status Dokumen RAB
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'Draft' as RABStatus, label: 'Draft', desc: 'Masih dalam penyusunan' },
              { id: 'Final' as RABStatus, label: 'Final', desc: 'Disetujui untuk penawaran' },
            ].map((s) => {
              const isSelected = status === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? s.id === 'Final'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold ring-2 ring-emerald-600/15'
                        : 'bg-slate-100 text-slate-900 border-slate-300 font-semibold ring-2 ring-slate-400/15'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{s.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{s.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Overhead, Margin & Discount */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Parameter Biaya & Profit:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Overhead (%)
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
                Margin (%)
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

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Diskon Khusus (Rp)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 6. Notes */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Catatan / Lingkup Khusus
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
