'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function ConsultationBanner() {
  const BUSINESS_WA_URL =
    'https://wa.me/6281234567890?text=Halo%20DINAMIS,%20saya%20sudah%20mencoba%20Demo%20Business%20CRM%20dan%20ingin%20berdiskusi%20kebutuhan%20implementasi%20di%20bisnis%20saya.';

  return (
    <section className="rounded-3xl bg-gradient-to-br from-[#0B3D2E] to-[#124D3B] text-white p-6 sm:p-10 shadow-sm border border-[#0B3D2E]/20">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#22C55E] text-xs font-bold tracking-wide">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>KONSULTASI SOLUSI DINAMIS</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Cocok dengan alur bisnis Anda?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            DINAMIS dapat menyediakan Business CRM yang disesuaikan dengan kebutuhan operasional bisnis Anda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <a
            href={BUSINESS_WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#0B3D2E] font-bold text-sm hover:bg-[#EAF8F1] transition shadow-xs active:scale-98"
          >
            <span>Diskusikan Kebutuhan</span>
            <ArrowRight className="w-4 h-4 text-[#0B3D2E]" />
          </a>
          <Link
            href="/crm"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition"
          >
            <span>Katalog CRM</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
