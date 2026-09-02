'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Tag, 
  Receipt, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Hammer, 
  Truck, 
  Briefcase 
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { ProjectExpense, ExpenseCategory } from '../../../types';
import { WORK_CATEGORIES } from '../../../data/contractorRABData';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingExpenseToEdit?: ProjectExpense | null;
  onSave: (
    expenseData: Omit<ProjectExpense, 'id' | 'projectId' | 'createdAt'>,
    expenseId?: string
  ) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  projectId,
  existingExpenseToEdit,
  onSave,
}) => {
  const [expenseDate, setExpenseDate] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Material');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [vendorOrPayee, setVendorOrPayee] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [workCategory, setWorkCategory] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (existingExpenseToEdit) {
        setExpenseDate(existingExpenseToEdit.expenseDate);
        setCategory(existingExpenseToEdit.category);
        setDescription(existingExpenseToEdit.description);
        setAmount(existingExpenseToEdit.amount);
        setVendorOrPayee(existingExpenseToEdit.vendorOrPayee);
        setReferenceNumber(existingExpenseToEdit.referenceNumber || '');
        setWorkCategory(existingExpenseToEdit.workCategory || '');
        setNotes(existingExpenseToEdit.notes || '');
      } else {
        setExpenseDate(new Date().toISOString().split('T')[0]);
        setCategory('Material');
        setDescription('');
        setAmount(0);
        setVendorOrPayee('');
        setReferenceNumber('');
        setWorkCategory('');
        setNotes('');
      }
      setErrorMsg('');
    }
  }, [isOpen, existingExpenseToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      setErrorMsg('Nominal pengeluaran harus lebih besar dari Rp 0.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Uraian pengeluaran wajib diisi.');
      return;
    }

    onSave(
      {
        expenseDate,
        category,
        description: description.trim(),
        amount,
        vendorOrPayee: vendorOrPayee.trim() || 'Vendor / Mandor Lapangan',
        referenceNumber: referenceNumber.trim() || undefined,
        workCategory: workCategory || undefined,
        notes: notes.trim() || undefined,
      },
      existingExpenseToEdit?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingExpenseToEdit ? 'Edit Pengeluaran Proyek' : 'Catat Pengeluaran Lapangan (Cash Out)'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Date & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tanggal Pengeluaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kategori Biaya <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600"
            >
              <option value="Material">🧱 Material & Bahan Bangunan</option>
              <option value="Labor">👷 Upah Mandor & Tukang (Labor)</option>
              <option value="Equipment">🚜 Sewa Alat & Mesin (Equipment)</option>
              <option value="Operational">📋 Operasional Lapangan & Lainnya</option>
            </select>
          </div>
        </div>

        {/* 2. Description & Amount */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Uraian Pengeluaran <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Contoh: Pembelian Semen Padang 120 sak & Pasir cor 2 rit..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Nominal Pengeluaran (Rp) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            required
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-extrabold text-slate-900 text-right focus:bg-white focus:border-emerald-600"
          />
        </div>

        {/* 3. Vendor / Payee & Receipt Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Vendor / Penerima Pembayaran
            </label>
            <input
              type="text"
              value={vendorOrPayee}
              onChange={(e) => setVendorOrPayee(e.target.value)}
              placeholder="Contoh: TB Sumber Makmur / Mandor Joko"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nomor Nota / Kwitansi / Surat Jalan
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Contoh: NOTA-8871 / KW-002"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>

        {/* 4. Optional Link to RAB Work Category */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Tahapan / Kategori RAB Terkait (Opsional)
          </label>
          <select
            value={workCategory}
            onChange={(e) => setWorkCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
          >
            <option value="">-- Tanpa Spesifik Kategori RAB --</option>
            {WORK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Catatan Tambahan
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Keterangan tambahan..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
          />
        </div>

        {/* 5. Actions */}
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
            <span>{existingExpenseToEdit ? 'Simpan Perubahan' : 'Simpan Pengeluaran'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
