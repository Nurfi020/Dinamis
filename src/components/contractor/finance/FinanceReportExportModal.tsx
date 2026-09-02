'use client';

import React, { useState } from 'react';
import {
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { ProjectFinance } from '../../../types';
import { formatRupiah } from '../../../utils/helpers';
import {
  generateExecutiveFinanceCSV,
  generateReceivablesCSV,
  generateBudgetVsActualCSV,
  getPortfolioFinancialHealthSummary
} from '../../../data/contractorFinanceIntelligence';

interface FinanceReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  finances: ProjectFinance[];
}

export const FinanceReportExportModal: React.FC<FinanceReportExportModalProps> = ({
  isOpen,
  onClose,
  finances,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string>('');
  const [isPrintPreview, setIsPrintPreview] = useState<boolean>(false);

  const portfolioSummary = getPortfolioFinancialHealthSummary(finances);

  const handleDownloadCSV = (type: 'executive' | 'receivables' | 'budget') => {
    let csvContent = '';
    let fileName = '';
    const dateStr = new Date().toISOString().split('T')[0];

    if (type === 'executive') {
      csvContent = generateExecutiveFinanceCSV(finances);
      fileName = `Ringkasan_Keuangan_Eksekutif_${dateStr}.csv`;
    } else if (type === 'receivables') {
      csvContent = generateReceivablesCSV(finances);
      fileName = `Laporan_Aging_Piutang_Penagihan_${dateStr}.csv`;
    } else if (type === 'budget') {
      csvContent = generateBudgetVsActualCSV(finances);
      fileName = `Laporan_Kontrol_Anggaran_RAB_${dateStr}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`File "${fileName}" berhasil diunduh.`);
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pusat Ekspor Laporan Keuangan Kontraktor"
      maxWidth="xl"
    >
      <div className="space-y-5 text-xs text-slate-700">
        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Overview Banner */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <Building2 className="w-4 h-4 text-emerald-700" />
              Portofolio Finansial: {portfolioSummary.totalProjects} Proyek Aktif
            </span>
            <span className="font-mono text-emerald-900 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
              Total Kontrak: {formatRupiah(portfolioSummary.totalContractValue)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Ekspor data keuangan lengkap dalam format CSV/Excel atau cetak laporan eksekutif resmi A4.
          </p>
        </div>

        {/* 3 CSV Export Cards */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            Pilihan Unduhan CSV (Excel Compatible)
          </h4>

          {/* Option 1: Executive Summary */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 mt-0.5">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-xs">1. Ringkasan Keuangan Eksekutif</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Rekapitulasi nilai kontrak, total tertagih, penerimaan kas, pengeluaran aktual, laba realisasi, dan status kesehatan finansial.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadCSV('executive')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
          </div>

          {/* Option 2: Receivables Aging */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-xs">2. Laporan Aging Piutang & Penagihan</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Daftar seluruh invoice belum lunas, kontak klien, tanggal jatuh tempo, hari telat (Days Overdue), matriks aging, dan skor prioritas.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadCSV('receivables')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
          </div>

          {/* Option 3: Budget vs Actual */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-700 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-xs">3. Laporan Kontrol Anggaran RAB vs Realisasi</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Rincian 4 kategori biaya (Material, Labor, Alat, Operasional), pagu RAB baseline, biaya aktual, variance, dan utilisasi.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadCSV('budget')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>

        {/* Print Option */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Cetak format dokumen manajemen A4 langsung ke printer / PDF
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan A4</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
