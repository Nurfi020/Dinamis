'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck, 
  Receipt,
  User,
  ArrowRight
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { ProjectInvoice, InvoicePayment, PaymentMethod } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: ProjectInvoice;
  onSave: (
    paymentData: Omit<InvoicePayment, 'id' | 'projectId' | 'invoiceId' | 'invoiceNumber' | 'createdAt'>
  ) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onSave,
}) => {
  const remaining = Math.max(0, invoice.totalAmount - (invoice.paidAmount || 0));

  const [paymentDate, setPaymentDate] = useState<string>('');
  const [amount, setAmount] = useState<number>(remaining);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transfer Bank');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setPaymentDate(today);
      setAmount(remaining);
      setPaymentMethod('Transfer Bank');
      setReferenceNumber('');
      setNotes('');
      setErrorMsg('');
    }
  }, [isOpen, remaining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      setErrorMsg('Nominal pembayaran harus lebih besar dari Rp 0.');
      return;
    }

    if (amount > remaining) {
      setErrorMsg(`Nominal pembayaran (${formatRupiah(amount)}) tidak boleh melebihi sisa tagihan (${formatRupiah(remaining)}).`);
      return;
    }

    onSave({
      paymentDate,
      amount,
      paymentMethod,
      referenceNumber: referenceNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Pembayaran Masuk (Cash In)"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Invoice Snapshot Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {invoice.invoiceNumber}
            </span>
            <span className="text-[11px] text-slate-500">
              Klien: <b>{invoice.clientName}</b>
            </span>
          </div>

          <p className="font-bold text-slate-900 text-xs">{invoice.title}</p>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Tagihan</span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {formatRupiah(invoice.totalAmount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Sudah Dibayar</span>
              <span className="font-mono font-bold text-emerald-700 text-xs">
                {formatRupiah(invoice.paidAmount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Sisa Tagihan</span>
              <span className="font-mono font-bold text-rose-600 text-xs">
                {formatRupiah(remaining)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tanggal Pembayaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Metode Pembayaran <span className="text-rose-500">*</span>
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600"
            >
              <option value="Transfer Bank">🏦 Transfer Bank</option>
              <option value="Tunai / Cash">💵 Tunai / Cash</option>
              <option value="Giro / Cek">📄 Giro / Cek</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-semibold text-slate-700">
              Nominal Pembayaran Diterima (Rp) <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setAmount(remaining)}
              className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Set Lunas ({formatRupiah(remaining)})
            </button>
          </div>
          <input
            type="number"
            min="1"
            max={remaining}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            required
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-extrabold text-emerald-800 text-right focus:bg-white focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Nomor Bukti Transfer / No. Kwitansi
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="Contoh: TRF-MANDIRI-987654 / KWT-001"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Catatan Pembayaran
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Keterangan tambahan..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
          />
        </div>

        {/* 3. Action Buttons */}
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
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simpan Pembayaran</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
