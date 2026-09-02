'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  User,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Layers,
  HardHat,
  Clock,
  Sparkles,
  Phone,
  FileCheck
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Quotation, RAB, ContractorProject, ProjectMilestone } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import {
  generateNextProjectNumber,
  generateDefaultMilestones,
  validateMilestoneWeights,
  calculateDaysBetween,
  addDays,
  createProjectFromQuotation,
  createProjectFromRAB
} from '../../../data/contractorProjectData';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotations: Quotation[];
  rabs: RAB[];
  existingProjects: ContractorProject[];
  preSelectedQuotationId?: string | null;
  onSave: (newProject: ContractorProject) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  quotations,
  rabs,
  existingProjects,
  preSelectedQuotationId,
  onSave,
}) => {
  // Source type: 'quotation' (Primary: Accepted SPH) or 'rab' (Fallback: Final RAB)
  const [sourceType, setSourceType] = useState<'quotation' | 'rab'>('quotation');

  const acceptedQuotations = React.useMemo(
    () => quotations.filter((q) => q.status === 'Accepted'),
    [quotations]
  );
  const finalRabs = React.useMemo(
    () => rabs.filter((r) => r.status === 'Final'),
    [rabs]
  );

  const [selectedQuotationId, setSelectedQuotationId] = useState<string>('');
  const [selectedRabId, setSelectedRabId] = useState<string>('');
  const [contractNumber, setContractNumber] = useState<string>('');
  const [contractStartDate, setContractStartDate] = useState<string>('');
  const [contractEndDate, setContractEndDate] = useState<string>('');
  const [siteManagerName, setSiteManagerName] = useState<string>('Ir. Hendra Gunawan, S.T.');
  const [siteManagerPhone, setSiteManagerPhone] = useState<string>('+62 812-9988-7711');
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const selectedQuotation = quotations.find((q) => q.id === selectedQuotationId) || null;
  const selectedRab = rabs.find((r) => r.id === selectedRabId) || null;

  // Initialize on open
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const defaultEnd = addDays(today, 90);
      const nextPrjNum = generateNextProjectNumber(existingProjects);
      const defaultSpk = `SPK-${new Date().getFullYear()}/${nextPrjNum.replace('PRJ-', '')}`;

      setContractStartDate(today);
      setContractEndDate(defaultEnd);
      setContractNumber(defaultSpk);
      setErrorMsg('');

      if (preSelectedQuotationId && acceptedQuotations.some((q) => q.id === preSelectedQuotationId)) {
        setSourceType('quotation');
        setSelectedQuotationId(preSelectedQuotationId);
      } else if (acceptedQuotations.length > 0) {
        setSourceType('quotation');
        setSelectedQuotationId(acceptedQuotations[0].id);
      } else if (finalRabs.length > 0) {
        setSourceType('rab');
        setSelectedRabId(finalRabs[0].id);
      } else {
        setSelectedQuotationId('');
        setSelectedRabId('');
      }
    }
  }, [isOpen, preSelectedQuotationId, acceptedQuotations, finalRabs, existingProjects]);

  // Regenerate milestones when dates or selected item changes
  useEffect(() => {
    if (isOpen && contractStartDate && contractEndDate) {
      let rabItems: RAB['items'] | undefined;
      if (sourceType === 'quotation' && selectedQuotation) {
        const sourceRAB = rabs.find((r) => r.id === selectedQuotation.rabId);
        rabItems = sourceRAB?.items;
      } else if (sourceType === 'rab' && selectedRab) {
        rabItems = selectedRab.items;
      }

      const defaultMs = generateDefaultMilestones(contractStartDate, contractEndDate, rabItems);
      setMilestones(defaultMs);
    }
  }, [isOpen, sourceType, selectedQuotation, selectedRab, contractStartDate, contractEndDate, rabs]);

  const durationDays = calculateDaysBetween(contractStartDate, contractEndDate);
  const totalWeight = milestones.reduce((sum, m) => sum + (Number(m.weightPercent) || 0), 0);
  const isWeightValid = Math.round(totalWeight) === 100;

  const handleMilestoneChange = (index: number, field: keyof ProjectMilestone, value: any) => {
    setMilestones((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddMilestone = () => {
    const newMs: ProjectMilestone = {
      id: `m-custom-${Date.now()}`,
      name: `Tahapan Pekerjaan Tambahan ${milestones.length + 1}`,
      category: 'Pekerjaan Struktur',
      weightPercent: 0,
      targetStartDate: contractStartDate,
      targetEndDate: contractEndDate,
      actualProgressPercent: 0,
      status: 'Pending',
    };
    setMilestones((prev) => [...prev, newMs]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) {
      setErrorMsg('Minimal harus ada 1 milestone.');
      return;
    }
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isWeightValid) {
      setErrorMsg(`Total bobot seluruh milestone harus tepat 100% (saat ini ${totalWeight}%).`);
      return;
    }

    try {
      let newProject: ContractorProject;

      if (sourceType === 'quotation') {
        if (!selectedQuotation) {
          setErrorMsg('Pilih dokumen Surat Penawaran Harga (SPH) yang telah Disetujui.');
          return;
        }
        const sourceRAB = rabs.find((r) => r.id === selectedQuotation.rabId);
        newProject = createProjectFromQuotation(
          selectedQuotation,
          {
            contractNumber: contractNumber.trim(),
            contractStartDate,
            contractEndDate,
            siteManagerName: siteManagerName.trim(),
            siteManagerPhone: siteManagerPhone.trim(),
            customMilestones: milestones,
            sourceRAB,
          },
          existingProjects
        );
      } else {
        if (!selectedRab) {
          setErrorMsg('Pilih dokumen RAB Final.');
          return;
        }
        newProject = createProjectFromRAB(
          selectedRab,
          {
            contractNumber: contractNumber.trim(),
            contractStartDate,
            contractEndDate,
            siteManagerName: siteManagerName.trim(),
            siteManagerPhone: siteManagerPhone.trim(),
            customMilestones: milestones,
          },
          existingProjects
        );
      }

      onSave(newProject);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membuat proyek baru.');
    }
  };

  const hasNoSources = acceptedQuotations.length === 0 && finalRabs.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terbitkan Proyek Konstruksi (SPK Masuk)"
      maxWidth="xl"
    >
      {hasNoSources ? (
        <div className="space-y-4 py-3">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm text-amber-950">
                Belum Ada Penawaran (SPH) Disetujui atau RAB Final
              </p>
              <p className="leading-relaxed">
                Penerbitan proyek konstruksi aktif memerlukan dokumen komersial acuan yang sah:
              </p>
              <ul className="list-disc list-inside space-y-0.5 pt-1 text-slate-700">
                <li><b>Surat Penawaran Harga (SPH)</b> dengan status <b>Accepted / Deal SPK</b> (Utama).</li>
                <li>Atau dokumen <b>RAB</b> dengan status <b>FINAL</b> (Fallback).</li>
              </ul>
              <p className="pt-2 text-amber-800">
                Silakan terbitkan SPH dari menu <b>Penawaran / SPH</b> lalu ubah statusnya menjadi <b>Accepted</b> ketika klien menyetujui kontrak.
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

          {/* 1. Source Document Selection */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">
                Sumber Acuan Kontrak Proyek
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSourceType('quotation')}
                  disabled={acceptedQuotations.length === 0}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    sourceType === 'quotation'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  SPH Disetujui ({acceptedQuotations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('rab')}
                  disabled={finalRabs.length === 0}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    sourceType === 'rab'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  RAB Final Fallback ({finalRabs.length})
                </button>
              </div>
            </div>

            {sourceType === 'quotation' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Surat Penawaran Harga (SPH Accepted / Deal SPK) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedQuotationId}
                  onChange={(e) => setSelectedQuotationId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                >
                  {acceptedQuotations.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.quotationNumber} — {q.projectName} • {q.clientName} ({formatRupiah(q.grandTotal)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Dokumen RAB (Final) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedRabId}
                  onChange={(e) => setSelectedRabId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                >
                  {finalRabs.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.rabNumber} — {r.projectName} • {r.clientName} ({formatRupiah(r.grandTotal)})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Snapshot Header Banner */}
          {(selectedQuotation || selectedRab) && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  {sourceType === 'quotation' ? selectedQuotation?.projectName : selectedRab?.projectName}
                </span>
                <span className="font-mono font-extrabold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Nilai Kontrak: {formatRupiah(sourceType === 'quotation' ? selectedQuotation?.grandTotal || 0 : selectedRab?.grandTotal || 0)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {sourceType === 'quotation' ? selectedQuotation?.clientName : selectedRab?.clientName}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span className="font-mono">{sourceType === 'quotation' ? selectedQuotation?.clientPhone : selectedRab?.clientPhone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{sourceType === 'quotation' ? selectedQuotation?.projectLocation : selectedRab?.projectLocation}</span>
                </span>
              </div>
            </div>
          )}

          {/* 3. Contract & Schedule Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Kontrak / SPK <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                required
                placeholder="SPK-2026/XXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Mulai (SPK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={contractStartDate}
                onChange={(e) => setContractStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Selesai (PHO) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={contractEndDate}
                onChange={(e) => setContractEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Site Manager / Pelaksana Lapangan
              </label>
              <input
                type="text"
                value={siteManagerName}
                onChange={(e) => setSiteManagerName(e.target.value)}
                placeholder="Nama Site Manager / Lead Proyek"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kontak Site Manager
              </label>
              <input
                type="text"
                value={siteManagerPhone}
                onChange={(e) => setSiteManagerPhone(e.target.value)}
                placeholder="+62 812-XXXX-XXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>

          {/* 4. Milestone / WBS Weight Configuration */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 text-xs">
                  Struktur Tahapan Proyek (WBS & Bobot %)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isWeightValid
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  }`}
                >
                  Total Bobot: {totalWeight}% {isWeightValid ? '✓ (Sah)' : '(Wajib 100%)'}
                </span>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs"
                >
                  <div className="col-span-1 text-center font-mono text-slate-400 font-bold">
                    {idx + 1}
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleMilestoneChange(idx, 'name', e.target.value)}
                      required
                      placeholder="Nama Tahapan Pekerjaan..."
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={m.weightPercent}
                        onChange={(e) => handleMilestoneChange(idx, 'weightPercent', parseFloat(e.target.value) || 0)}
                        required
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-slate-900 text-right"
                      />
                      <span className="text-[11px] font-bold text-slate-500">%</span>
                    </div>
                  </div>
                  <div className="col-span-3 text-[10px] text-slate-500 flex flex-col gap-0.5">
                    <input
                      type="date"
                      value={m.targetStartDate}
                      onChange={(e) => handleMilestoneChange(idx, 'targetStartDate', e.target.value)}
                      className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]"
                    />
                    <input
                      type="date"
                      value={m.targetEndDate}
                      onChange={(e) => handleMilestoneChange(idx, 'targetEndDate', e.target.value)}
                      className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Hapus Tahapan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              disabled={!isWeightValid}
              className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
                isWeightValid
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Terbitkan Proyek SPK</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
