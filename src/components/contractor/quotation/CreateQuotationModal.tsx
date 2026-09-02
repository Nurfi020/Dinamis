'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  Building2,
  User,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { RAB, Quotation } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import {
  generateNextQuotationNumber,
  DEFAULT_COMPANY_INFO,
  DEFAULT_PAYMENT_TERMS,
  DEFAULT_TERMS_AND_CONDITIONS,
  addDaysToDate
} from '../../../data/contractorQuotationData';

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rabs: RAB[];
  existingQuotations: Quotation[];
  preSelectedRabId?: string | null;
  onSave: (newQuotation: Quotation) => void;
}

export const CreateQuotationModal: React.FC<CreateQuotationModalProps> = ({
  isOpen,
  onClose,
  rabs,
  existingQuotations,
  preSelectedRabId,
  onSave,
}) => {
  // Only Final RABs can generate SPH
  const finalRabs = React.useMemo(() => rabs.filter((r) => r.status === 'Final'), [rabs]);

  const [selectedRabId, setSelectedRabId] = useState<string>('');
  const [quotationNumber, setQuotationNumber] = useState<string>('');
  const [quotationDate, setQuotationDate] = useState<string>('');
  const [validityDays, setValidityDays] = useState<number>(14);
  const [validUntil, setValidUntil] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [workDescription, setWorkDescription] = useState<string>('');
  const [paymentTerms, setPaymentTerms] = useState<string>(DEFAULT_PAYMENT_TERMS);
  const [termsAndConditions, setTermsAndConditions] = useState<string>(DEFAULT_TERMS_AND_CONDITIONS);
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const selectedRab = rabs.find((r) => r.id === selectedRabId) || null;

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const nextNum = generateNextQuotationNumber(existingQuotations);
      setQuotationNumber(nextNum);
      setQuotationDate(today);
      setValidityDays(14);
      setValidUntil(addDaysToDate(today, 14));
      setErrorMsg('');

      if (preSelectedRabId && finalRabs.some((r) => r.id === preSelectedRabId)) {
        setSelectedRabId(preSelectedRabId);
      } else if (finalRabs.length > 0) {
        setSelectedRabId(finalRabs[0].id);
      } else {
        setSelectedRabId('');
      }
    }
  }, [isOpen, preSelectedRabId, finalRabs, existingQuotations]);

  useEffect(() => {
    if (selectedRab) {
      const desc =
        selectedRab.notes ||
        `Pelaksanaan pekerjaan konstruksi untuk proyek "${selectedRab.projectName}" berlokasi di ${selectedRab.projectLocation}, mencakup ${selectedRab.items?.length || 0} item pekerjaan konstruksi sesuai dokumen RAB ${selectedRab.rabNumber}.`;
      setWorkDescription(desc);
    }
  }, [selectedRab]);

  const handleValidityChange = (days: number) => {
    setValidityDays(days);
    if (quotationDate) {
      setValidUntil(addDaysToDate(quotationDate, days));
    }
  };

  const handleDateChange = (date: string) => {
    setQuotationDate(date);
    if (date && validityDays) {
      setValidUntil(addDaysToDate(date, validityDays));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRab) {
      setErrorMsg('Silakan pilih dokumen RAB Final terlebih dahulu.');
      return;
    }

    if (selectedRab.status !== 'Final') {
      setErrorMsg('SPH hanya dapat dibuat dari RAB dengan status FINAL.');
      return;
    }

    const now = new Date().toISOString();
    const newQuotation: Quotation = {
      id: `sph-${Date.now()}`,
      quotationNumber,
      rabId: selectedRab.id,
      rabNumber: selectedRab.rabNumber,
      leadId: selectedRab.leadId,
      projectName: selectedRab.projectName,
      clientName: selectedRab.clientName,
      clientPhone: selectedRab.clientPhone,
      clientEmail: clientEmail.trim(),
      projectLocation: selectedRab.projectLocation,
      buildingAreaM2: selectedRab.buildingAreaM2,
      quotationDate,
      validityDays,
      validUntil,
      companyName: DEFAULT_COMPANY_INFO.companyName,
      companyAddress: DEFAULT_COMPANY_INFO.companyAddress,
      companyPhone: DEFAULT_COMPANY_INFO.companyPhone,
      companyEmail: DEFAULT_COMPANY_INFO.companyEmail,
      workDescription: workDescription.trim(),
      paymentTerms: paymentTerms.trim(),
      termsAndConditions: termsAndConditions.trim(),
      notes: notes.trim(),
      materialTotal: selectedRab.materialTotal,
      laborTotal: selectedRab.laborTotal,
      subtotalCost: selectedRab.subtotalCost,
      overheadAmount: selectedRab.overheadAmount,
      overheadValue: selectedRab.overheadValue,
      marginAmount: selectedRab.marginAmount,
      marginValue: selectedRab.marginValue,
      discountAmount: selectedRab.discountAmount || 0,
      grandTotal: selectedRab.grandTotal,
      status: 'Draft',
      createdAt: now,
      updatedAt: now,
    };

    onSave(newQuotation);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buat Surat Penawaran Harga (SPH)"
      maxWidth="lg"
    >
      {finalRabs.length === 0 ? (
        <div className="space-y-4 py-3">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm text-amber-950">
                Belum Ada RAB dengan Status FINAL
              </p>
              <p className="leading-relaxed">
                Surat Penawaran Harga (SPH) merupakan dokumen penawaran komersial resmi yang harus berbasis pada Rencana Anggaran Biaya (RAB) yang telah disetujui dan berstatus <b>FINAL</b>.
              </p>
              <p className="pt-1 text-amber-800">
                Silakan buka menu <b>Rencana Anggaran (RAB)</b>, pilih dokumen terkait, lalu ubah statusnya menjadi <b>Final</b>.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Header Information & RAB Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pilih Dokumen Sumber RAB (Final) <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedRabId}
                onChange={(e) => setSelectedRabId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              >
                {finalRabs.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.rabNumber} — {r.projectName} ({formatRupiah(r.grandTotal)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Surat SPH <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          {/* 2. Snapshot Summary Card */}
          {selectedRab && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Data Snapshot dari {selectedRab.rabNumber}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Total SPH: {formatRupiah(selectedRab.grandTotal)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 text-[11px]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRab.projectName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRab.projectLocation} {selectedRab.buildingAreaM2 ? `(${selectedRab.buildingAreaM2} m²)` : ''}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRab.clientName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRab.clientPhone}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                <div>
                  <span>HPP Riil:</span>
                  <b className="font-mono block text-slate-700">{formatRupiah(selectedRab.subtotalCost)}</b>
                </div>
                <div>
                  <span>Overhead ({selectedRab.overheadValue}%):</span>
                  <b className="font-mono block text-slate-700">+{formatRupiah(selectedRab.overheadAmount)}</b>
                </div>
                <div>
                  <span>Margin ({selectedRab.marginValue}%):</span>
                  <b className="font-mono block text-emerald-700">+{formatRupiah(selectedRab.marginAmount)}</b>
                </div>
                <div>
                  <span>Diskon:</span>
                  <b className="font-mono block text-rose-600">-{formatRupiah(selectedRab.discountAmount || 0)}</b>
                </div>
              </div>
            </div>
          )}

          {/* 3. Dates & Client Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Penawaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={quotationDate}
                onChange={(e) => handleDateChange(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Masa Berlaku (Hari) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleValidityChange(d)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      validityDays === d
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d} Hari
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Berlaku Hingga
              </label>
              <input
                type="date"
                value={validUntil}
                readOnly
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Klien (Opsional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="misal: procurement@majubersama.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              />
            </div>
          </div>

          {/* 4. Scope & Commercial Terms */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lingkup / Deskripsi Pekerjaan SPH
            </label>
            <textarea
              rows={2}
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              placeholder="Jelaskan ringkasan lingkup pekerjaan yang ditawarkan..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Syarat Pembayaran (Payment Terms)
              </label>
              <textarea
                rows={3}
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[11px] focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ketentuan & Syarat (Terms & Conditions)
              </label>
              <textarea
                rows={3}
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[11px] focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Tambahan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan internal atau keterangan khusus penawaran..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terbitkan Dokumen SPH</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
