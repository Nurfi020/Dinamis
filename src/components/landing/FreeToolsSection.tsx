'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Zap } from 'lucide-react';
import { FREE_TOOLS } from '@/data/free-tools';

export const FreeToolsSection: React.FC = () => {
  const popularTools = FREE_TOOLS.slice(0, 4);

  return (
    <section id="free-tools" className="py-24 sm:py-32 bg-[#F7FAF8] text-[#10231B] border-t border-[#E2EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2EAE5] text-[#0B3D2E] text-xs font-bold shadow-2xs">
            <Calculator className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>FREE TOOLS & UTILITY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight">
            Tools Gratis untuk Membantu Bisnis Anda.
          </h2>

          <p className="text-base sm:text-lg text-[#64756D] leading-relaxed">
            Kalkulator dan generator praktis untuk membantu menghitung margin, BEP, dan menyusun pesan penawaran — tanpa login dan tanpa registrasi.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-2xl p-6 bg-white border border-[#E2EAE5] flex flex-col justify-between hover:border-[#16A36A] transition duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#16A36A] uppercase tracking-wider bg-[#EAF8F1] px-2.5 py-0.5 rounded">
                    {tool.categoryLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7FAF8] text-[#0B3D2E] border border-[#E2EAE5]">
                    {tool.badge || 'Gratis'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0B3D2E] mt-1 leading-snug">{tool.name}</h3>
                <p className="text-xs text-[#64756D] leading-relaxed min-h-[44px]">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2EAE5]">
                <Link
                  href={tool.href}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] text-xs font-semibold hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E] transition"
                >
                  <span>Gunakan Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Directory */}
        <div className="mt-12 text-center">
          <Link
            href="/free-tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs"
          >
            <span>Lihat Semua Free Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
