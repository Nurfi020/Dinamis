'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export const ResourcesSection: React.FC = () => {
  const articles = [
    {
      num: '01',
      title: 'Cara Mengelola Lead Agar Tidak Terlewat',
      category: 'CRM & Pipeline',
      readTime: '4 min baca',
      desc: 'Standar operasional sederhana dalam mendokumentasikan dan membagi prospek baru agar seluruh tim memiliki respon cepat dan terkoordinasi.',
      relatedLinkText: 'Lihat Solusi CRM',
      relatedHref: '/crm',
    },
    {
      num: '02',
      title: 'Cara Membuat Sistem Follow-up Customer dengan AI',
      category: 'AI Productivity',
      readTime: '5 min baca',
      desc: 'Strategi timing pesan WhatsApp dan pemanfaatan asisten AI untuk menyusun pesan persuasif tanpa menulis dari nol setiap saat.',
      relatedLinkText: 'Jelajahi AI Tools',
      relatedHref: '/ai-tools',
    },
    {
      num: '03',
      title: 'Panduan Membuat Database Customer Sederhana',
      category: 'Digital Products',
      readTime: '5 min baca',
      desc: 'Struktur kolom esensial yang wajib ada saat mencatat data pelanggan untuk memudahkan analisis repeat order dan promosi bertarget.',
      relatedLinkText: 'Download Template',
      relatedHref: '/digital-products/customer-database-template',
    },
  ];

  return (
    <section id="resources" className="py-24 sm:py-32 bg-white text-[#10231B] border-t border-[#E2EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF8F1] text-[#0B3D2E] text-xs font-bold shadow-2xs">
            <span>KNOWLEDGE HUB</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight">
            Insight, Panduan, dan Resource Praktis.
          </h2>

          <p className="text-base sm:text-lg text-[#64756D] leading-relaxed">
            Artikel dan panduan operasional praktis untuk membantu Anda mengelola alur bisnis, mengurangi pekerjaan berulang, dan meningkatkan produktivitas.
          </p>
        </div>

        {/* 3 Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] hover:border-[#16A36A] hover:bg-white transition duration-150 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#64756D]">
                  <span className="font-bold text-[#16A36A] font-mono text-xs">
                    {item.num} • {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-[#64756D]" />
                    {item.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0B3D2E] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#64756D] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2EAE5] flex items-center justify-between text-xs">
                <Link
                  href={item.relatedHref}
                  className="font-bold text-[#16A36A] hover:text-[#0B3D2E] inline-flex items-center gap-1 transition"
                >
                  <span>{item.relatedLinkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Resources Hub */}
        <div className="mt-12 text-center">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0B3D2E] hover:text-[#16A36A] transition"
          >
            <span>Buka Semua Artikel & Panduan Resources</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
