'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ChevronLeft, Calculator, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MarginCalculatorPage() {
  const [costPrice, setCostPrice] = useState<number>(100000);
  const [sellingPrice, setSellingPrice] = useState<number>(150000);

  const grossProfit = sellingPrice - costPrice;
  const marginPercentage = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const markupPercentage = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleReset = () => {
    setCostPrice(100000);
    setSellingPrice(150000);
  };

  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      <section className="pt-32 pb-10 sm:pt-40 sm:pb-12 bg-white border-b border-[#E2EAE5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/free-tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64756D] hover:text-[#0B3D2E] transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Free Tools</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF8F1] text-[#0B3D2E] text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>FINANSIAL & PROFITABILITAS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight">
            Kalkulator Margin & Markup
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64756D]">
            Hitung keuntungan kotor, persentase profit margin, dan persentase markup secara instan tanpa login.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className="md:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2EAE5] space-y-5 shadow-xs">
            <h2 className="text-lg font-bold text-[#0B3D2E]">Parameter Biaya & Harga</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Harga Modal / HPP (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={costPrice || ''}
                  onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-bold text-base focus:outline-none focus:border-[#16A36A] focus:bg-white transition"
                  placeholder="Contoh: 100000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Harga Jual Produk / Jasa (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={sellingPrice || ''}
                  onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-bold text-base focus:outline-none focus:border-[#16A36A] focus:bg-white transition"
                  placeholder="Contoh: 150000"
                />
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64756D] hover:text-[#0B3D2E] pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Nilai Bawaan</span>
            </button>
          </div>

          {/* Result Output Column */}
          <div className="md:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#16A36A] space-y-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#16A36A] uppercase tracking-wider">
                Hasil Perhitungan
              </span>

              <div className="p-4 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6]">
                <div className="text-xs font-medium text-[#0B3D2E]">Margin Keuntungan (Gross Margin)</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E] mt-0.5">
                  {marginPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-[#16A36A] font-semibold mt-1">
                  Profit kotor: {formatRupiah(grossProfit)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
                  <div className="text-[11px] text-[#64756D]">Markup Harga Modal</div>
                  <div className="text-xl font-extrabold text-[#0B3D2E] mt-0.5">
                    {markupPercentage.toFixed(1)}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
                  <div className="text-[11px] text-[#64756D]">Total Keuntungan Kotor</div>
                  <div className="text-sm font-extrabold text-[#0B3D2E] mt-1">
                    {formatRupiah(grossProfit)}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2EAE5] text-xs text-[#64756D] space-y-1">
              <div className="font-semibold text-[#0B3D2E]">Perbedaan Margin vs Markup:</div>
              <p className="text-[11px] leading-relaxed">
                <strong>Margin</strong> = Persentase laba dari harga jual. <strong>Markup</strong> = Persentase kenaikan harga di atas modal (HPP).
              </p>
            </div>
          </div>
        </div>

        {/* Upgrade Callout */}
        <div className="mt-10 p-6 sm:p-7 rounded-3xl bg-[#0B3D2E] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-base">Butuh Perhitungan RAB Proyek Lebih Mendalam?</div>
            <div className="text-xs text-white/80 mt-0.5">
              Contractor CRM dilengkapi modul estimasi RAB otomatis dan kontrol belanja material lapangan.
            </div>
          </div>
          <Link
            href="/crm/contractor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0B3D2E] font-semibold text-xs hover:bg-[#EAF8F1] transition shrink-0"
          >
            <span>Pelajari Contractor CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
