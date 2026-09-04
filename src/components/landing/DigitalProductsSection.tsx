'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import { DIGITAL_PRODUCTS } from '@/data/digital-products';

export const DigitalProductsSection: React.FC = () => {
  return (
    <section id="digital-products" className="py-24 sm:py-32 bg-[#F7FAF8] text-[#10231B] border-t border-[#E2EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2EAE5] text-[#0B3D2E] text-xs font-bold shadow-2xs">
            <span>TEMPLATE & TOOLKIT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight">
            Tidak Perlu Mulai dari Nol.
          </h2>

          <p className="text-base sm:text-lg text-[#64756D] leading-relaxed">
            Gunakan template, toolkit, dan panduan siap pakai untuk menyelesaikan pekerjaan dan merapikan operasional lebih cepat.
          </p>
        </div>

        {/* 4 Clean Document-Style Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIGITAL_PRODUCTS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-6 bg-white border border-[#E2EAE5] flex flex-col justify-between hover:border-[#16A36A] hover:shadow-xs transition duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#16A36A] uppercase tracking-wider bg-[#EAF8F1] px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <FileText className="w-4 h-4 text-[#64756D]" />
                </div>

                <h3 className="text-base font-bold text-[#0B3D2E] leading-snug">{item.name}</h3>
                <div className="text-xl font-extrabold text-[#10231B]">{item.formattedPrice}</div>
                <p className="text-xs text-[#64756D] leading-relaxed min-h-[44px]">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2EAE5]">
                <Link
                  href={item.href}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] text-xs font-semibold hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E] transition"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Directory */}
        <div className="mt-12 text-center">
          <Link
            href="/digital-products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs"
          >
            <span>Lihat Semua Digital Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
