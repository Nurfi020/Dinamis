'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Percent
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { BillingTerm, BillingType } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import { validateBillingSchedule } from '../../../data/contractorFinanceData';

interface ConfigureBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractValue: number;
  existingTerms: BillingTerm[];
  onSave: (updatedTerms: BillingTerm[]) => void;
}

export const ConfigureBillingModal: React.FC<ConfigureBillingModalProps> = ({
  isOpen,
  onClose,
  contractValue,
  existingTerms,
  onSave,
}) => {
  const [terms, setTerms] = useState<BillingTerm[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (existingTerms && existingTerms.length > 0) {
        setTerms(JSON.parse(JSON.stringify(existingTerms)));
      } else {
        setTerms([]);
      }
      setErrorMsg('');
    }
  }, [isOpen, existingTerms]);

  const handlePercentageChange = (index: number, newPct: number) => {
    const clamped = Math.max(0, Math.min(100, newPct));
    setTerms((prev) => {
      const updated = [...prev];
      const amount = Math.round((contractValue * clamped) / 100);
      updated[index] = {
        ...updated[index],
        percentage: clamped,
        amount,
      };
      return updated;
    });
  };

  const handleFieldChange = (index: number, field: keyof BillingTerm, value: any) => {
    setTerms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddTerm = () => {
    const newTerm: BillingTerm = {
      id: `term-custom-${Date.now()}`,
      projectId: terms[0]?.projectId || '',
      termNumber: terms.length,
      type: 'Termin',
      label: `Termin ${terms.length} (Target Fisik ${(terms.length * 20)}%)`,
      percentage: 0,
      amount: 0,
      targetPhysicalProgressTrigger: terms.length * 20,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Unbilled',
    };
    setTerms((prev) => [...prev, newTerm]);
  };

  const handleRemoveTerm = (index: number) => {
    if (terms.length <= 1) {
      setErrorMsg('Minimal harus ada 1 termin penagihan.');
      return;
    }
    const termToRemove = terms[index];
    if (termToRemove.status !== 'Unbilled') {
      setErrorMsg('Termin yang sudah diterbitkan invoice tidak dapat dihapus.');
      return;
    }
    setTerms((prev) => prev.filter((_, i) => i !== index));
  };

  const validation = validateBillingSchedule(terms, contractValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Jadwal termin tidak valid.');
      return;
    }
    onSave(terms);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Atur Skema & Jadwal Termin Pembayaran"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Header Summary */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Nilai Kontrak SPK (Acuan 100%)
            </span>
            <span className="font-mono text-sm font-extrabold text-slate-900">
              {formatRupiah(contractValue)}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                validation.isValid
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
              }`}
            >
              Total: {validation.totalPercentage}% {validation.isValid ? '✓ (Sah)' : '(Wajib 100%)'}
            </span>
          </div>
        </div>

        {/* 2. Terms List Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Daftar Termin & Syarat Penagihan
            </span>
            <button
              type="button"
              onClick={handleAddTerm}
              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Termin</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {terms.map((term, idx) => (
              <div
                key={term.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs"
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-1 text-center font-mono font-bold text-slate-400">
                    #{idx + 1}
                  </div>

                  <div className="col-span-4">
                    <input
                      type="text"
                      value={term.label}
                      onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                      required
                      placeholder="Label Termin..."
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div className="col-span-2">
                    <select
                      value={term.type}
                      onChange={(e) => handleFieldChange(idx, 'type', e.target.value as BillingType)}
                      className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded text-[11px]"
                    >
                      <option value="DP">DP (Uang Muka)</option>
                      <option value="Termin">Termin Bertahap</option>
                      <option value="Pelunasan">Pelunasan</option>
                      <option value="Retensi">Retensi Pemeliharaan</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={term.percentage}
                        onChange={(e) => handlePercentageChange(idx, parseFloat(e.target.value) || 0)}
                        required
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-slate-900 text-right"
                      />
                      <span className="text-[11px] font-bold text-slate-500">%</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="font-mono font-bold text-slate-900 text-xs block">
                      {formatRupiah(term.amount)}
                    </span>
                  </div>

                  <div className="col-span-1 text-center">
                    {term.status === 'Unbilled' ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveTerm(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Hapus Termin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-bold">✓</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 text-[11px] text-slate-500 pl-7 items-center">
                  <div className="col-span-6 flex items-center gap-1.5">
                    <span>Syarat Fisik Lapangan:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={term.targetPhysicalProgressTrigger || 0}
                      onChange={(e) => handleFieldChange(idx, 'targetPhysicalProgressTrigger', parseFloat(e.target.value) || 0)}
                      className="w-14 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-right font-mono"
                    />
                    <span>%</span>
                  </div>

                  <div className="col-span-6 flex items-center justify-end gap-1.5">
                    <span>Jatuh Tempo:</span>
                    <input
                      type="date"
                      value={term.dueDate || ''}
                      onChange={(e) => handleFieldChange(idx, 'dueDate', e.target.value)}
                      className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            disabled={!validation.isValid}
            className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
              validation.isValid
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simpan Skema Termin</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
