'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const WhatIsDinamis: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'CRM Software',
      tagline: 'Sistem alur kerja & manajemen prospek terintegrasi.',
      desc: 'Membantu tim menangani proses deals dari kontak awal, survei, penawaran, hingga kontrak dalam satu alur terpusat.',
      href: '/crm',
    },
    {
      num: '02',
      title: 'AI Tools',
      tagline: 'Asisten AI untuk tugas berulang & follow-up.',
      desc: 'Membantu tim merespon chat WhatsApp, membuat follow-up persuasif, dan menyusun draft proposal instan.',
      href: '/ai-tools',
    },
    {
      num: '03',
      title: 'Digital Products',
      tagline: 'Template spreadsheet & SOP siap pakai.',
      desc: 'Format database pelanggan, dokumen SOP penanganan lead, dan toolkit praktis tanpa perlu mulai dari nol.',
      href: '/digital-products',
    },
    {
      num: '04',
      title: 'Free Tools',
      tagline: 'Kalkulator & generator praktis tanpa registrasi.',
      desc: 'Alat bantu hitung margin, BEP, harga jual, dan draf pesan untuk mempercepat pekerjaan harian tanpa perlu daftar akun.',
      href: '/free-tools',
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#F7FAF8] text-[#10231B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline & Ecosystem Philosophy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2EAE5] text-[#0B3D2E] text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>EKOSISTEM DINAMIS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.15]">
              Bukan Sekadar Software.
            </h2>

            <p className="text-base sm:text-lg text-[#64756D] leading-relaxed">
              DINAMIS membangun berbagai solusi digital untuk membantu bisnis bekerja lebih rapi, mengurangi pekerjaan berulang, dan memanfaatkan teknologi tanpa harus menambah kompleksitas.
            </p>

            <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] space-y-2 text-xs text-[#64756D]">
              <div className="font-bold text-[#0B3D2E] text-sm">Filosofi Solusi:</div>
              <p className="leading-relaxed">
                &ldquo;Bangun sekali. Otomatiskan lebih banyak. Kelola lebih sedikit.&rdquo; — Fokus membebaskan tim dari rutinitas administratif manual.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Ecosystem Pillars */}
          <div className="lg:col-span-7 divide-y divide-[#E2EAE5]">
            {pillars.map((pt, idx) => (
              <Link
                key={idx}
                href={pt.href}
                className={`block ${idx !== 0 ? 'pt-7' : ''} pb-7 group`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono font-bold text-[#16A36A] bg-white border border-[#E2EAE5] px-2.5 py-1 rounded-md">
                    {pt.num}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#0B3D2E] group-hover:text-[#16A36A] transition">
                        {pt.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-[#64756D] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                    </div>
                    <p className="text-sm font-semibold text-[#10231B]">
                      {pt.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-[#64756D] leading-relaxed pt-0.5">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
