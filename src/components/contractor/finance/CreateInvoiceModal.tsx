'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Percent, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard,
  Building2,
  User,
  Layers,
  Info
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { ProjectFinance, ContractorProject, ProjectInvoice, BillingTerm } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import { 
  generateNextInvoiceNumber, 
  generateNextBAPNumber,
  getRemainingBillingCapacity,
  validateInvoiceAgainstContractCeiling
} from '../../../data/contractorFinanceData';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  finance: ProjectFinance;
  project: ContractorProject;
  preSelectedTermId?: string | null;
  onSave: (newInvoice: ProjectInvoice) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  finance,
  project,
  preSelectedTermId,
  onSave,
}) => {
  const [selectedTermId, setSelectedTermId] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [bapNumber, setBapNumber] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(0);
  const [physicalProgressClaimPercent, setPhysicalProgressClaimPercent] = useState<number>(0);
  const [bankAccountInfo, setBankAccountInfo] = useState<string>(
    'Bank Mandiri: 123-00-9876543-2 a/n PT Dinamis Konstruksi Nusantara'
  );
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const remainingCapacity = getRemainingBillingCapacity(finance);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const autoInvNum = generateNextInvoiceNumber(finance.invoices, finance.projectNumber);
      const autoBapNum = generateNextBAPNumber(finance.invoices, finance.projectNumber);

      setInvoiceDate(today);
      setDueDate(defaultDue);
      setInvoiceNumber(autoInvNum);
      setBapNumber(autoBapNum);
      setPhysicalProgressClaimPercent(project.currentProgressPercent || 0);
      setTaxRatePercent(0);
      setErrorMsg('');

      // Find term
      const unbilledTerms = finance.billingTerms.filter((t) => t.status === 'Unbilled');
      let targetTerm: BillingTerm | undefined;

      if (preSelectedTermId) {
        targetTerm = finance.billingTerms.find((t) => t.id === preSelectedTermId);
      } else if (unbilledTerms.length > 0) {
        targetTerm = unbilledTerms[0];
      }

      if (targetTerm) {
        setSelectedTermId(targetTerm.id);
        setTitle(`Penagihan ${targetTerm.label}`);
        setAmount(targetTerm.amount);
        if (targetTerm.dueDate) {
          setDueDate(targetTerm.dueDate);
        }
      } else {
        setSelectedTermId('custom');
        setTitle(`Penagihan Progres Fisik Proyek (${project.currentProgressPercent}%)`);
        const defaultAdHoc = Math.min(remainingCapacity, Math.round(finance.contractValueSnapshot * 0.2));
        setAmount(defaultAdHoc);
      }
    }
  }, [isOpen, finance, project, preSelectedTermId, remainingCapacity]);

  const handleTermChange = (termId: string) => {
    setSelectedTermId(termId);
    if (termId === 'custom') {
      setTitle(`Penagihan Progres Fisik Proyek (${project.currentProgressPercent}%)`);
      setAmount(Math.min(remainingCapacity, Math.round(finance.contractValueSnapshot * 0.1)));
    } else {
      const found = finance.billingTerms.find((t) => t.id === termId);
      if (found) {
        setTitle(`Penagihan ${found.label}`);
        setAmount(found.amount);
        if (found.dueDate) setDueDate(found.dueDate);
      }
    }
  };

  const taxAmount = Math.round((amount * taxRatePercent) / 100);
  const totalAmount = amount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate against global contractual billing ceiling
    const ceilingValidation = validateInvoiceAgainstContractCeiling(finance, amount);
    if (!ceilingValidation.isValid) {
      setErrorMsg(ceilingValidation.error || 'Nominal tagihan melebihi pagu kontrak.');
      return;
    }

    const selectedTerm = finance.billingTerms.find((t) => t.id === selectedTermId);

    const newInvoice: ProjectInvoice = {
      id: `inv-${Date.now()}`,
      projectId: finance.projectId,
      projectNumber: finance.projectNumber,
      projectName: finance.projectName,
      clientName: finance.clientName,
      clientPhone: project.clientPhone,
      clientAddress: project.projectLocation,
      invoiceNumber: invoiceNumber.trim(),
      billingTermId: selectedTermId !== 'custom' ? selectedTermId : undefined,
      type: selectedTerm?.type || 'Termin',
      title: title.trim(),
      invoiceDate,
      dueDate,
      amount,
      taxRatePercent,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      status: 'Issued',
      physicalProgressClaimPercent,
      bapNumber: bapNumber.trim(),
      bapDate: invoiceDate,
      notes: notes.trim(),
      bankAccountInfo: bankAccountInfo.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newInvoice);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terbitkan Surat Tagihan / Invoice & BAP"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Project & Contract Ceiling Info Banner */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              {finance.projectName} ({finance.projectNumber})
            </span>
            <span className="font-mono text-emerald-900 font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
              Nilai Kontrak SPK: {formatRupiah(finance.contractValueSnapshot)}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 border-t border-slate-200 text-slate-600">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Klien: <b>{finance.clientName}</b>
            </span>
            <span>Realisasi Fisik: <b className="text-emerald-700">{project.currentProgressPercent}%</b></span>
            <span className="bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded">
              Sisa Pagu Pokok Kontrak: {formatRupiah(remainingCapacity)}
            </span>
          </div>
        </div>

        {/* 2. Billing Term Selection */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Pilih Termin Penagihan <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedTermId}
            onChange={(e) => handleTermChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600"
          >
            {finance.billingTerms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.label} — {formatRupiah(term.amount)} ({term.percentage}%) [{term.status}]
              </option>
            ))}
            <option value="custom">-- Invoice Kustom / Termin Tambahan (Ad-hoc) --</option>
          </select>
        </div>

        {/* 3. Invoice & BAP Numbers, Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nomor Invoice <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nomor Berita Acara (BAP)
            </label>
            <input
              type="text"
              value={bapNumber}
              onChange={(e) => setBapNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Judul / Uraian Tagihan <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Contoh: Penagihan Uang Muka (DP) 20% Proyek..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tanggal Terbit <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Jatuh Tempo <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Klaim Progres Fisik (%)
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={physicalProgressClaimPercent}
                onChange={(e) => setPhysicalProgressClaimPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:bg-white focus:border-emerald-600 text-right"
              />
              <span className="text-xs font-bold text-slate-500">%</span>
            </div>
          </div>
        </div>

        {/* 4. Financial Amounts & Tax */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">
                  Nilai Pokok Tagihan (Billing Base) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  Maks: {formatRupiah(remainingCapacity)}
                </span>
              </div>
              <input
                type="number"
                min="1"
                max={remainingCapacity}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-extrabold text-slate-900 focus:border-emerald-600 text-right"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pajak PPN (%)
              </label>
              <select
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-emerald-600 font-semibold"
              >
                <option value={0}>Non-PPN (0%)</option>
                <option value={11}>PPN 11%</option>
                <option value={12}>PPN 12%</option>
              </select>
            </div>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Pokok Tagihan (Billing Base):</span>
              <span className="font-mono font-semibold text-slate-900">{formatRupiah(amount)}</span>
            </div>
            {taxRatePercent > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Pajak PPN ({taxRatePercent}%):</span>
                <span className="font-mono text-slate-800">{formatRupiah(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
              <span className="text-slate-800">Total Tagihan Final (Gross):</span>
              <span className="font-mono text-sm text-emerald-800">{formatRupiah(totalAmount)}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Pagu kontrak dihitung dari <b>Nilai Pokok Tagihan</b>. PPN tidak mengurangi atau menambah kapasitas pagu kontrak.</span>
          </p>
        </div>

        {/* 5. Bank Transfer Info & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Rekening Pembayaran (Tercetak di Invoice)
            </label>
            <input
              type="text"
              value={bankAccountInfo}
              onChange={(e) => setBankAccountInfo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan / Syarat Khusus
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Bukti transfer mohon diinfokan via WA..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>

        {/* 6. Actions */}
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
            <span>Terbitkan Invoice & BAP</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
