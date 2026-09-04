'use client';

import React from 'react';
import { ArrowRight, ChevronRight, TrendingUp, Clock, CheckCircle2, CheckSquare } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 overflow-hidden bg-[#F7FAF8] text-[#10231B]">
      {/* Subtle soft-green ambient background glow */}
      <div className="absolute top-12 right-1/4 w-[480px] h-[480px] bg-[#EAF8F1] rounded-full blur-3xl pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-1/2 left-8 w-80 h-80 bg-[#EAF8F1] rounded-full blur-3xl pointer-events-none -z-10 opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2EAE5] text-[#0B3D2E] text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
              <span>DINAMIS DIGITAL SOLUTIONS</span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-[#0B3D2E] tracking-tight leading-[1.10]">
              Buat Bisnis Anda Bekerja Lebih Rapi.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-[#64756D] leading-relaxed max-w-xl mx-auto lg:mx-0">
              Software, tools, dan solusi digital untuk membantu bisnis mengelola customer, penjualan, pekerjaan, dan aktivitas sehari-hari dengan lebih sederhana.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#solutions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-base hover:bg-[#16A36A] transition shadow-xs active:scale-98"
              >
                <span>Lihat Solusi</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/crm"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#E2EAE5] text-[#10231B] font-semibold text-base hover:border-[#16A36A] hover:text-[#0B3D2E] transition shadow-2xs"
              >
                <span>Lihat DinamisCRM</span>
                <ChevronRight className="w-4 h-4 text-[#64756D]" />
              </a>
            </div>

            {/* Micro Trust Statement */}
            <div className="pt-3 text-xs sm:text-sm font-medium text-[#64756D] flex items-center justify-center lg:justify-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
              <span>Satu ekosistem untuk berbagai kebutuhan digital bisnis.</span>
            </div>
          </div>

          {/* Right Column: 1 Central Ecosystem Visual + 3 Focused Floating Cards */}
          <div className="lg:col-span-6 relative">
            {/* Main Central Visual Frame */}
            <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 sm:p-7 shadow-sm space-y-5 relative z-10">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2EAE5]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E2EAE5]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E2EAE5]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E2EAE5]" />
                  <span className="text-xs font-mono text-[#64756D] ml-2 hidden sm:inline">
                    dinamiscrm.online / hub
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF8F1] text-[#16A36A] text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span>Sistem Aktif</span>
                </div>
              </div>

              {/* Central Summary Content */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#64756D]">Pipeline Omset Bulan Berjalan</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] mt-0.5">
                      Rp 42,5 M
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#16A36A] bg-[#EAF8F1] px-2.5 py-1 rounded-full">
                    +18.4% On Target
                  </span>
                </div>

                {/* 2 Key Floating Cards in Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] hover:border-[#16A36A] transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#64756D]">Lead Baru</span>
                      <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#0B3D2E] mt-1">+24</div>
                    <div className="text-xs text-[#16A36A] font-semibold mt-0.5">New Leads Masuk</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] hover:border-[#16A36A] transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#64756D]">Jadwal Kontak</span>
                      <Clock className="w-3.5 h-3.5 text-[#16A36A]" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#0B3D2E] mt-1">8</div>
                    <div className="text-xs text-[#64756D] font-semibold mt-0.5">Follow-ups Today</div>
                  </div>
                </div>

                {/* Micro Status Bar */}
                <div className="pt-2 flex items-center justify-between text-xs text-[#64756D] border-t border-[#E2EAE5]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                    Pencatatan sales & proyek terkoordinasi
                  </span>
                  <span className="font-semibold text-[#0B3D2E]">Dinamis Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
