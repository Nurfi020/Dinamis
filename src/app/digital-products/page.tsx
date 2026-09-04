import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Digital Products | Template, Toolkit & Panduan | DINAMIS',
  description:
    'Template spreadsheet, toolkit follow-up, SOP penjualan, dan produk digital siap pakai untuk membantu bisnis bekerja lebih cepat tanpa mulai dari nol.',
  keywords: [
    'Digital Products Bisnis',
    'Template Spreadsheet Sales',
    'WhatsApp Follow-Up Kit',
    'Customer Database Template',
    'SOP Penjualan Bisnis',
    'DINAMIS Toolkit',
  ],
  openGraph: {
    title: 'Digital Products | Template, Toolkit & Panduan | DINAMIS',
    description:
      'Template, toolkit, panduan, dan digital products siap pakai untuk membantu bisnis bekerja lebih cepat.',
    type: 'website',
  },
};

export default function DigitalProductsDirectoryPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Directory Hero */}
      <section className="pt-36 pb-16 sm:pt-44 sm:pb-20 border-b border-[#E2EAE5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold tracking-wide shadow-2xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>READY-TO-USE DIGITAL PRODUCTS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.12]">
            Digital Products yang Siap Digunakan.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#64756D] leading-relaxed max-w-2xl mx-auto">
            Toolkit, template, panduan, dan resource praktis yang membantu Anda menyelesaikan pekerjaan tanpa harus mulai dari nol.
          </p>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0B3D2E]">Katalog Produk & Toolkit</h2>
            <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
              Format siap pakai berbasis Google Sheets, Excel, Notion, dan dokumen praktis.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64756D]">
            <Zap className="w-4 h-4 text-[#16A36A]" />
            <span>Instant Digital Delivery</span>
          </div>
        </div>

        <ProductGrid />
      </section>

      {/* Upgrade to Software Banner */}
      <section className="py-16 bg-white border-t border-[#E2EAE5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B3D2E]">
            Sudah Menggunakan Template dan Ingin Otomatisasi Penuh?
          </h3>
          <p className="text-sm text-[#64756D] max-w-xl mx-auto">
            Tingkatkan efisiensi kerja tim Anda dengan beralih ke software DinamisCRM terintegrasi.
          </p>
          <div className="pt-2">
            <Link
              href="/crm"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs"
            >
              <span>Pelajari Software CRM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
