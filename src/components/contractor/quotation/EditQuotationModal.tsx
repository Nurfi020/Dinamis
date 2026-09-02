'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Quotation, QuotationStatus } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import { addDaysToDate } from '../../../data/contractorQuotationData';

interface EditQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: Quotation;
  onSave: (id: string, updatedData: Partial<Quotation>) => void;
}

export const EditQuotationModal: React.FC<EditQuotationModalProps> = ({
  isOpen,
  onClose,
  quotation,
  onSave,
}) => {
  const [status, setStatus] = useState<QuotationStatus>(quotation.status);
  const [quotationDate, setQuotationDate] = useState<string>(quotation.quotationDate);
  const [validityDays, setValidityDays] = useState<number>(quotation.validityDays || 14);
  const [validUntil, setValidUntil] = useState<string>(quotation.validUntil);
  const [clientEmail, setClientEmail] = useState<string>(quotation.clientEmail || '');
  const [workDescription, setWorkDescription] = useState<string>(quotation.workDescription || '');
  const [paymentTerms, setPaymentTerms] = useState<string>(quotation.paymentTerms || '');
  const [termsAndConditions, setTermsAndConditions] = useState<string>(quotation.termsAndConditions || '');
  const [notes, setNotes] = useState<string>(quotation.notes || '');

  useEffect(() => {
    if (quotation) {
      setStatus(quotation.status);
      setQuotationDate(quotation.quotationDate);
      setValidityDays(quotation.validityDays || 14);
      setValidUntil(quotation.validUntil);
      setClientEmail(quotation.clientEmail || '');
      setWorkDescription(quotation.workDescription || '');
      setPaymentTerms(quotation.paymentTerms || '');
      setTermsAndConditions(quotation.termsAndConditions || '');
      setNotes(quotation.notes || '');
    }
  }, [quotation]);

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

    onSave(quotation.id, {
      status,
      quotationDate,
      validityDays,
      validUntil,
      clientEmail: clientEmail.trim(),
      workDescription: workDescription.trim(),
      paymentTerms: paymentTerms.trim(),
      termsAndConditions: termsAndConditions.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Dokumen ${quotation.quotationNumber}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Header Snapshot Info */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {quotation.quotationNumber} (Sumber: {quotation.rabNumber})
            </span>
            <span className="font-mono text-xs font-bold text-slate-900">
              Total Penawaran: {formatRupiah(quotation.grandTotal)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{quotation.projectName}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-700">{quotation.clientName}</span>
            </div>
          </div>
        </div>

        {/* Status Selector & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Status Dokumen SPH <span className="text-rose-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as QuotationStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            >
              <option value="Draft">Draft (Dalam Penyusunan)</option>
              <option value="Sent">Sent (Terkirim ke Klien)</option>
              <option value="Accepted">Accepted (Disetujui / Deal SPK)</option>
              <option value="Rejected">Rejected (Ditolak / Negosiasi Gagal)</option>
              <option value="Expired">Expired (Lewat Masa Berlaku)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Klien
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="procurement@klien.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              />
            </div>
          </div>
        </div>

        {/* Date & Validity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tanggal Penawaran
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
              Masa Berlaku (Hari)
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

        {/* Work Description & Terms */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Lingkup / Deskripsi Pekerjaan
          </label>
          <textarea
            rows={2}
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
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
            Catatan Tambahan
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan..."
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
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </Modal>
  );
};
