'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ChevronLeft, Calculator, RotateCcw, ArrowRight } from 'lucide-react';

export default function SellingPriceCalculatorPage() {
  const [costPrice, setCostPrice] = useState<number>(200000);
  const [targetMargin, setTargetMargin] = useState<number>(30); // 30%

  // Formula: Selling Price = Cost / (1 - (Margin / 100))
  const marginDecimal = targetMargin / 100;
  const recommendedSellingPrice =
    marginDecimal < 1 ? costPrice / (1 - marginDecimal) : costPrice * (1 + marginDecimal);
  const estimatedProfit = recommendedSellingPrice - costPrice;
  const markupPercentage = costPrice > 0 ? (estimatedProfit / costPrice) * 100 : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleReset = () => {
    setCostPrice(200000);
    setTargetMargin(30);
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
            <span>STRATEGI PENETAPAN HARGA (PRICING)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight">
            Kalkulator Harga Jual (Cost-Plus)
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64756D]">
            Tentukan harga penawaran produk atau jasa ideal untuk mengamankan target margin laba yang Anda inginkan.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className="md:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2EAE5] space-y-5 shadow-xs">
            <h2 className="text-lg font-bold text-[#0B3D2E]">Parameter Modal & Target Laba</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Total Modal / HPP per Unit (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={costPrice || ''}
                  onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-bold text-base focus:outline-none focus:border-[#16A36A] focus:bg-white transition"
                  placeholder="Modal barang / jasa"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Target Profit Margin yang Diinginkan (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="1"
                    value={targetMargin}
                    onChange={(e) => setTargetMargin(Number(e.target.value))}
                    className="flex-1 accent-[#16A36A]"
                  />
                  <span className="w-14 text-center font-bold text-base bg-[#EAF8F1] text-[#0B3D2E] px-2 py-1 rounded-lg">
                    {targetMargin}%
                  </span>
                </div>
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
                Rekomendasi Harga Jual
              </span>

              <div className="p-4 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6]">
                <div className="text-xs font-medium text-[#0B3D2E]">Harga Jual yang Disarankan</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E] mt-0.5">
                  {formatRupiah(recommendedSellingPrice)}
                </div>
                <div className="text-xs text-[#16A36A] font-semibold mt-1">
                  Margin laba bersih: {targetMargin}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
                  <div className="text-[11px] text-[#64756D]">Estimasi Laba per Unit</div>
                  <div className="text-sm sm:text-base font-extrabold text-[#0B3D2E] mt-1">
                    {formatRupiah(estimatedProfit)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5]">
                  <div className="text-[11px] text-[#64756D]">Markup dari HPP</div>
                  <div className="text-sm sm:text-base font-extrabold text-[#0B3D2E] mt-1">
                    +{markupPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2EAE5] text-xs text-[#64756D] space-y-1">
              <div className="font-semibold text-[#0B3D2E]">Tips Penawaran:</div>
              <p className="text-[11px] leading-relaxed">
                Gunakan harga ini sebagai batas dasar sebelum memberikan diskon atau negosiasi kepada customer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
