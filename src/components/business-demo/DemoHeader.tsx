'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';

interface DemoHeaderProps {
  onReset: () => void;
}

export function DemoHeader({ onReset }: DemoHeaderProps) {
  const [showResetNotice, setShowResetNotice] = useState(false);

  const BUSINESS_WA_URL =
    'https://wa.me/6281234567890?text=Halo%20DINAMIS,%20saya%20sudah%20mencoba%20Demo%20Business%20CRM%20dan%20ingin%20konsultasi%20kebutuhan%20sales%20bisnis%20saya.';

  const handleReset = () => {
    onReset();
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 3000);
  };

  return (
    <section className="pt-32 pb-8 sm:pt-40 sm:pb-12 bg-white border-b border-[#E2EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs">
              <Link
                href="/crm"
                className="inline-flex items-center gap-1 font-semibold text-[#64756D] hover:text-[#0B3D2E] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Katalog CRM</span>
              </Link>
              <span className="text-[#D1DDD6]">/</span>
              <Link
                href="/crm/business"
                className="font-semibold text-[#64756D] hover:text-[#0B3D2E] transition"
              >
                Business CRM
              </Link>
              <span className="text-[#D1DDD6]">/</span>
              <span className="font-bold text-[#16A36A]">Demo Interaktif</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B3D2E] tracking-tight">
                Business CRM
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#0B3D2E] text-white tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
                DEMO MODE
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#64756D] max-w-2xl leading-relaxed">
              Coba alur manajemen lead, follow-up, pipeline sales, dan pencatatan deal dalam mode isolasi browser tanpa koneksi ke database production.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={BUSINESS_WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
            >
              <span>Konsultasi WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/crm/business"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#10231B] font-semibold text-sm hover:bg-white transition"
            >
              <span>Fitur Produk</span>
            </Link>
          </div>
        </div>

        {/* Demo Mode Notice & Reset Banner */}
        <div className="p-4 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-[#0B3D2E]">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#D1DDD6] text-[#16A36A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#0B3D2E]">Mode Demo Terisolasi: </span>
              <span className="text-[#64756D]">
                Data yang Anda masukkan tersimpan di memori browser lokal dan tidak memengaruhi database utama.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {showResetNotice && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A36A] animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                Data demo di-reset
              </span>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D1DDD6] text-[#0B3D2E] font-bold hover:bg-[#F7FAF8] hover:border-[#16A36A] transition text-xs shadow-2xs active:scale-98"
              title="Kembalikan semua data ke contoh awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
