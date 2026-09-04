'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { DemoSPK } from './types';

interface SPKViewProps {
  spkList: DemoSPK[];
}

export const SPKView: React.FC<SPKViewProps> = ({ spkList }) => {
  const [selectedSPK, setSelectedSPK] = useState<DemoSPK | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#16A36A]" />
          <h2 className="text-xl font-extrabold text-[#0B3D2E]">
            Surat Perjanjian Kerja (SPK) & Kontrak
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
          Kelola dokumen kontrak kerja, nilai komitmen proyek, uang muka (DP), dan syarat termin pembayaran.
        </p>
      </div>

      {/* SPK List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spkList.map((spk) => (
          <div
            key={spk.id}
            className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs space-y-4 hover:border-[#16A36A] transition"
          >
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E2EAE5]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#16A36A] bg-[#EAF8F1] px-2 py-0.5 rounded">
                  {spk.spkNumber}
                </span>
                <h3 className="font-bold text-[#0B3D2E] text-base mt-1.5">{spk.projectTitle}</h3>
                <p className="text-xs text-[#64756D]">Klien: {spk.clientName}</p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF8F1] text-[#0B3D2E] border border-[#D1DDD6]">
                {spk.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5]">
                <span className="text-[#64756D] text-[11px]">Nilai Kontrak Total:</span>
                <div className="font-bold text-sm text-[#0B3D2E] mt-0.5">
                  Rp {spk.contractValue.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5]">
                <span className="text-[#64756D] text-[11px]">Uang Muka (DP 30%):</span>
                <div className="font-bold text-sm text-[#16A36A] mt-0.5">
                  Rp {spk.downPayment.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2EAE5] text-xs">
              <span className="text-[#64756D]">
                Periode: {spk.startDate} s/d {spk.targetEndDate}
              </span>
              <button
                onClick={() => setSelectedSPK(spk)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau SPK</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Pratinjau Dokumen SPK */}
      {selectedSPK && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl border border-[#E2EAE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2EAE5]">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-bold text-[#16A36A]">DOKUMEN KONTRAK CONTOH</div>
                <h3 className="text-lg font-bold text-[#0B3D2E]">Surat Perjanjian Kerja (SPK)</h3>
              </div>
              <button
                onClick={() => setSelectedSPK(null)}
                className="p-1 rounded-lg text-[#64756D] hover:bg-[#F7FAF8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F7FAF8] rounded-2xl border border-[#E2EAE5] space-y-3 text-xs leading-relaxed">
              <div className="font-bold text-[#10231B] text-center border-b border-[#E2EAE5] pb-2">
                NOMOR KONTRAK: {selectedSPK.spkNumber}
              </div>

              <p>
                Pada hari ini disepakati perjanjian pelaksanaan pekerjaan antara Kontraktor Pelaksana dengan pihak Klien:{' '}
                <strong>{selectedSPK.clientName}</strong> untuk pekerjaan <strong>{selectedSPK.projectTitle}</strong>.
              </p>

              <div className="space-y-1 bg-white p-3 rounded-xl border border-[#E2EAE5]">
                <div className="flex justify-between">
                  <span className="text-[#64756D]">Total Nilai Pekerjaan:</span>
                  <span className="font-bold text-[#0B3D2E]">Rp {selectedSPK.contractValue.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64756D]">Uang Muka / DP:</span>
                  <span className="font-bold text-[#16A36A]">Rp {selectedSPK.downPayment.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64756D]">Status Persetujuan:</span>
                  <span className="font-bold text-[#0B3D2E]">{selectedSPK.status}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-[#64756D] border-t border-[#E2EAE5]">
                <span>Pihak Pertama (Klien)</span>
                <span>Pihak Kedua (Kontraktor)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedSPK(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B3D2E] text-white hover:bg-[#16A36A] transition"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
