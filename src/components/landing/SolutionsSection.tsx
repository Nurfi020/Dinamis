'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';

export const SolutionsSection: React.FC = () => {
  const solutions = [
    {
      category: 'Contractor',
      title: 'Contractor CRM',
      desc: 'CRM untuk bisnis kontraktor, renovasi, dan interior.',
      status: 'Tersedia',
      isAvailable: true,
      href: '/crm/contractor',
      features: ['Pipeline 7-tahap proyek', 'Survei GPS lokasi & RAB', 'Kontrol belanja material'],
    },
    {
      category: 'Property',
      title: 'Property CRM',
      desc: 'Kelola prospek calon pembeli dan database listing unit.',
      status: 'Segera Hadir',
      isAvailable: false,
      href: '/crm#property',
      features: ['Database unit listing', 'Jadwal viewing prospek', 'Tracking agen marketing'],
    },
    {
      category: 'Service Business',
      title: 'Service CRM',
      desc: 'Kelola antrean order pengerjaan jasa dan reminder follow-up.',
      status: 'Segera Hadir',
      isAvailable: false,
      href: '/crm#service',
      features: ['Timeline order pekerjaan', 'Invoice & termin tagihan', 'Notifikasi status WhatsApp'],
    },
    {
      category: 'Agency',
      title: 'Agency CRM',
      desc: 'Manajemen client retainer, proposal pitch, dan deals.',
      status: 'Segera Hadir',
      isAvailable: false,
      href: '/crm#agency',
      features: ['Tracking pitch proposal', 'Approval brief klien', 'Laporan closing bulanan'],
    },
  ];

  return (
    <section id="solutions" className="py-24 sm:py-32 bg-white text-[#10231B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF8F1] text-[#0B3D2E] text-xs font-bold">
            <span>SOLUSI INDUSTRI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight">
            Solusi Digital untuk Berbagai Jenis Bisnis.
          </h2>

          <p className="text-base sm:text-lg text-[#64756D] leading-relaxed">
            Setiap bisnis memiliki proses yang berbeda. Karena itu, DINAMIS dikembangkan dengan pendekatan solusi yang dapat disesuaikan.
          </p>
        </div>

        {/* Solutions List (Contractor prominent, others subdued) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((sol, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition duration-150 ${
                sol.isAvailable
                  ? 'bg-white border-2 border-[#16A36A] shadow-xs ring-2 ring-[#EAF8F1]'
                  : 'bg-[#F7FAF8] border border-[#E2EAE5] opacity-90'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#64756D] uppercase tracking-wider">
                    {sol.category}
                  </span>
                  {sol.isAvailable ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A]">
                      {sol.status}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#64756D] border border-[#E2EAE5]">
                      {sol.status}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0B3D2E]">{sol.title}</h3>
                  <p className="mt-1.5 text-xs text-[#64756D] leading-relaxed min-h-[40px]">
                    {sol.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2EAE5] space-y-1.5">
                  {sol.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5 text-xs text-[#64756D]">
                      <Check className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2EAE5]">
                {sol.isAvailable ? (
                  <Link
                    href={sol.href}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#16A36A] transition shadow-xs"
                  >
                    <span>Lihat Solusi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a
                    href={sol.href}
                    className="w-full flex items-center justify-center gap-1 py-2.5 px-4 rounded-xl bg-white border border-[#E2EAE5] text-[#64756D] text-xs font-medium hover:text-[#0B3D2E] transition"
                  >
                    <span>Pelajari Alur</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#64756D]" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
