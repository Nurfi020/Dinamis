'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#0B3D2E] text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Temukan Solusi Digital yang Tepat untuk Bisnis Anda.
        </h2>

        <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
          Mulai dari tools praktis, produk digital siap pakai, hingga software CRM operasional terstruktur.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/crm"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#0B3D2E] font-semibold text-base hover:bg-[#EAF8F1] transition shadow-xs active:scale-98"
          >
            <span>Lihat Solusi</span>
            <ArrowRight className="w-4 h-4 text-[#0B3D2E]" />
          </Link>

          <Link
            href="/ai-tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-transparent border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition"
          >
            <span>Jelajahi AI Tools</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-white/70">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Satu Ekosistem Terpadu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Keamanan Data Teruji</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Dukungan Bisnis Indonesia</span>
          </div>
        </div>
      </div>
    </section>
  );
};
