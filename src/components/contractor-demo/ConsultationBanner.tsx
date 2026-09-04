'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Building2 } from 'lucide-react';

export const ConsultationBanner: React.FC = () => {
  const CONTRACTOR_WA_URL =
    'https://wa.me/6281234567890?text=Halo%20DINAMIS,%20saya%20sudah%20mencoba%20Interactive%20Demo%20Contractor%20CRM%20dan%20tertarik%20untuk%20menerapkannya%20pada%20bisnis%20saya.';

  return (
    <section className="rounded-3xl bg-[#0B3D2E] text-white p-8 sm:p-12 shadow-sm text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white shadow-2xs">
        <Building2 className="w-3.5 h-3.5 text-[#22C55E]" />
        <span>SOLUSI KONTRAKTOR PROFESIONAL</span>
      </div>

      <div className="max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tertarik Menerapkan Contractor CRM untuk Bisnis Anda?
        </h2>
        <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
          Diskusikan alur operasional proyek, kebutuhan survei, RAB otomatis, dan kontrol belanja material Anda bersama tim solusi DINAMIS.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={CONTRACTOR_WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#0B3D2E] font-bold text-sm hover:bg-[#EAF8F1] transition shadow-xs active:scale-98"
        >
          <span>Konsultasikan dengan DINAMIS</span>
          <ArrowRight className="w-4 h-4 text-[#0B3D2E]" />
        </a>
        <Link
          href="/crm/contractor"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition"
        >
          <span>Pelajari Fitur Lengkap</span>
        </Link>
      </div>
    </section>
  );
};
