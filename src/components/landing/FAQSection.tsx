'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa itu DINAMIS?',
      a: 'DINAMIS adalah platform solusi bisnis digital yang menghadirkan software, tools gratis, produk digital siap pakai, dan pengembangan sistem kustom untuk membantu bisnis mengelola customer, sales, pekerjaan, dan aktivitas sehari-hari secara lebih terstruktur.',
    },
    {
      q: 'Apakah DINAMIS hanya menyediakan CRM?',
      a: 'Tidak. Selain DinamisCRM sebagai produk perangkat lunak utama, ekosistem DINAMIS juga mencakup utilitas gratis (kalkulator margin, BEP, generator pesan), produk digital (template database, spreadsheet SOP, sales kit), serta layanan perancangan Custom Business Solutions.',
    },
    {
      q: 'Apa itu DinamisCRM?',
      a: 'DinamisCRM adalah aplikasi web manajemen prospek dan alur penjualan untuk mengelola kontak leads, tahapan pipeline deals, jadwal follow-up, hingga laporan konversi omset dalam satu dashboard terpadu.',
    },
    {
      q: 'Apakah tersedia solusi untuk industri tertentu?',
      a: 'Ya. DINAMIS mengembangkan solusi yang disesuaikan dengan alur industri. Solusi vertikal pertama yang telah aktif dan dapat langsung digunakan adalah Contractor CRM (untuk kontraktor, renovasi, dan interior). Solusi untuk industri properti, jasa, dan agensi sedang dalam tahap rilis bertahap.',
    },
    {
      q: 'Apakah ada tools gratis?',
      a: 'Ya. Kami menyediakan berbagai tools praktis tanpa biaya seperti Margin Calculator, BEP Calculator, WhatsApp Follow-up Generator, dan Customer Database Template untuk membantu pekerjaan bisnis Anda.',
    },
    {
      q: 'Apakah DINAMIS dapat membuat sistem custom?',
      a: 'Ya. Tim DINAMIS melayani perancangan dan pengembangan sistem digital khusus, portal web multi-role, dan automasi proses bisnis yang disesuaikan persis dengan workflow perusahaan Anda.',
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#F7FAF8] text-[#10231B] border-t border-[#E2EAE5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2EAE5] text-[#0B3D2E] text-xs font-bold shadow-2xs">
            <span>TANYA JAWAB</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E] tracking-tight">
            Pertanyaan yang Sering Ditanyakan
          </h2>

          <p className="text-base text-[#64756D]">
            Informasi lengkap seputar ekosistem solusi dan produk digital DINAMIS.
          </p>
        </div>

        {/* Minimal Clean Accordion List */}
        <div className="divide-y divide-[#E2EAE5] border-y border-[#E2EAE5] bg-white rounded-2xl px-6">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5 transition">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-bold text-base text-[#0B3D2E] hover:text-[#16A36A] transition focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#16A36A] shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pt-3 text-xs sm:text-sm text-[#64756D] leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
