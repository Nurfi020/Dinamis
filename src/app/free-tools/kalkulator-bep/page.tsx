'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ChevronLeft, Calculator, RotateCcw, ArrowRight } from 'lucide-react';

export default function BEPCalculatorPage() {
  const [fixedCost, setFixedCost] = useState<number>(10000000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(50000);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState<number>(100000);

  const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
  const bepUnits = contributionMargin > 0 ? Math.ceil(fixedCost / contributionMargin) : 0;
  const bepNominal = bepUnits * sellingPricePerUnit;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleReset = () => {
    setFixedCost(10000000);
    setVariableCostPerUnit(50000);
    setSellingPricePerUnit(100000);
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
            <span>ANALISIS KELAYAKAN TITIK IMPAS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight">
            Kalkulator Break-Even Point (BEP)
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64756D]">
            Hitung target minimal penjualan (unit dan nominal) untuk menutup seluruh biaya tetap dan variabel operasional.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className="md:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2EAE5] space-y-5 shadow-xs">
            <h2 className="text-lg font-bold text-[#0B3D2E]">Parameter Biaya Operasional</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Biaya Tetap / Fixed Cost per Bulan (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={fixedCost || ''}
                  onChange={(e) => setFixedCost(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-bold text-base focus:outline-none focus:border-[#16A36A] focus:bg-white transition"
                  placeholder="Gaji, sewa ruko, utilitas"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Biaya Variabel per Unit (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={variableCostPerUnit || ''}
                  onChange={(e) => setVariableCostPerUnit(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-bold text-base focus:outline-none focus:border-[#16A36A] focus:bg-white transition"
                  placeholder="Bahan baku, kemasan per unit"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Harga Jual per Unit (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={sellingPricePerUnit || ''}
                  onChange={(e) => setSellingPricePerUnit(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-bold text-base focus:outline-none focus:border-[#16A36A] focus:bg-white transition"
                  placeholder="Harga jual ke konsumen"
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
                Titik Impas (BEP)
              </span>

              <div className="p-4 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6]">
                <div className="text-xs font-medium text-[#0B3D2E]">BEP Unit (Target Minimal Penjualan)</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E] mt-0.5">
                  {bepUnits} <span className="text-base font-semibold">Unit</span>
                </div>
                <div className="text-xs text-[#16A36A] font-semibold mt-1">
                  Margin kontribusi: {formatRupiah(contributionMargin)} / unit
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5]">
                <div className="text-xs font-medium text-[#64756D]">BEP Nominal Rupiah (Omset Balik Modal)</div>
                <div className="text-2xl font-extrabold text-[#0B3D2E] mt-0.5">
                  {formatRupiah(bepNominal)}
                </div>
                <div className="text-xs text-[#64756D] mt-0.5">
                  Target omset minimal untuk mencapai titik 0 laba-rugi
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2EAE5] text-xs text-[#64756D] space-y-1">
              <div className="font-semibold text-[#0B3D2E]">Catatan Analisis:</div>
              <p className="text-[11px] leading-relaxed">
                Penjualan di atas <strong>{bepUnits} unit</strong> akan menghasilkan laba bersih langsung bagi bisnis Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 sm:p-7 rounded-3xl bg-[#0B3D2E] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-base">Ingin Pantau Sales Pipeline & Target Deals?</div>
            <div className="text-xs text-white/80 mt-0.5">
              Gunakan template atau software CRM untuk tracking prospek hingga tanda tangan SPK.
            </div>
          </div>
          <Link
            href="/digital-products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0B3D2E] font-semibold text-xs hover:bg-[#EAF8F1] transition shrink-0"
          >
            <span>Lihat Template Sales</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
