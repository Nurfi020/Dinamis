'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, ShieldCheck, Sparkles, AlertCircle, X } from 'lucide-react';

interface DemoHeaderProps {
  onReset: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({ onReset }) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setConfirmModalOpen(false);
  };

  return (
    <>
      <div className="bg-white border-b border-[#E2EAE5] pt-28 pb-4 sm:pt-32 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumb & Navigation Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#64756D]">
              <Link href="/crm" className="hover:text-[#0B3D2E] transition">
                Web Apps
              </Link>
              <span className="text-[#D1DDD6]">/</span>
              <Link href="/crm/contractor" className="hover:text-[#0B3D2E] transition">
                Contractor CRM
              </Link>
              <span className="text-[#D1DDD6]">/</span>
              <span className="font-bold text-[#16A36A]">Demo Workspace</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/crm/contractor"
                className="inline-flex items-center gap-1.5 font-bold text-[#0B3D2E] hover:text-[#16A36A] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Contractor CRM</span>
              </Link>
              <span className="text-[#D1DDD6] hidden sm:inline">•</span>
              <Link
                href="/crm"
                className="text-[#64756D] hover:text-[#0B3D2E] transition hidden sm:inline"
              >
                Lihat Web Apps Lain
              </Link>
            </div>
          </div>

          {/* Title and Reset Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#0B3D2E] text-white uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  DEMO MODE
                </span>
                <span className="text-xs font-semibold text-[#64756D]">
                  Interactive Workspace
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] tracking-tight">
                Contractor CRM — Demo Interaktif
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setConfirmModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold hover:bg-[#EAF8F1] hover:border-[#16A36A] transition shadow-2xs active:scale-98"
                title="Reset data demo ke kondisi awal"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Compact Demo Notice Banner */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#0B3D2E]">
              <ShieldCheck className="w-4 h-4 text-[#16A36A] shrink-0" />
              <span>
                <strong>Mode Demo:</strong> Silakan coba menambah, mengubah, atau menghapus data. Seluruh perubahan disimpan mandiri di browser Anda tanpa koneksi ke database production.
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#16A36A] font-bold self-start sm:self-auto shrink-0">
              ● Client Sandbox
            </span>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E2EAE5]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2EAE5]">
              <div className="flex items-center gap-2 text-[#0B3D2E] font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-[#16A36A]" />
                <span>Konfirmasi Reset Demo</span>
              </div>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="p-1 rounded-lg text-[#64756D] hover:bg-[#F7FAF8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#64756D] leading-relaxed">
              Apakah Anda yakin ingin mengembalikan data demo ke kondisi awal? Semua data lead, survei, RAB, dan material yang baru Anda tambahkan di browser ini akan di-reset.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64756D] hover:bg-[#F7FAF8]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B3D2E] text-white hover:bg-[#16A36A] transition shadow-xs"
              >
                Ya, Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
