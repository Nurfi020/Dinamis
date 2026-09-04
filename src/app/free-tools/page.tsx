import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { FREE_TOOLS } from '@/data/free-tools';
import { Calculator, ArrowRight, Zap, CheckCircle2, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Tools & Kalkulator Bisnis | DINAMIS',
  description:
    'Kumpulan tools bisnis gratis tanpa login: Kalkulator Margin, Kalkulator BEP, Kalkulator Harga Jual, dan Generator Pesan Follow-Up WhatsApp.',
  keywords: [
    'Free Tools Bisnis',
    'Kalkulator Margin',
    'Kalkulator BEP',
    'Kalkulator Harga Jual',
    'WhatsApp Follow-up Generator',
    'DINAMIS Free Tools',
  ],
  openGraph: {
    title: 'Free Tools & Kalkulator Bisnis | DINAMIS',
    description:
      'Kumpulan tools praktis gratis untuk membantu operasional, kalkulasi margin, dan komunikasi bisnis tanpa registrasi.',
    type: 'website',
  },
};

export default function FreeToolsDirectoryPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-36 pb-16 sm:pt-44 sm:pb-20 border-b border-[#E2EAE5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold tracking-wide shadow-2xs mb-6">
            <Calculator className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>FREE BUSINESS UTILITIES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.12]">
            Free Tools untuk Membantu Bisnis Anda.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#64756D] leading-relaxed max-w-2xl mx-auto">
            Gunakan kalkulator dan generator praktis untuk mempermudah perhitungan margin, BEP, dan draf pesan penawaran — tanpa login dan tanpa registrasi.
          </p>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#64756D] font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
              100% Gratis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
              Tanpa Perlu Daftar Akun
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
              Hasil Instan di Browser
            </span>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0B3D2E]">Katalog Tools Gratis</h2>
            <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
              Buka tool, masukkan angka atau parameter, dapatkan hasil kalkulasi secara instan.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64756D]">
            <Zap className="w-4 h-4 text-[#16A36A]" />
            <span>Zero-Effort & Self-Service</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FREE_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="rounded-3xl p-6 sm:p-7 bg-white border border-[#E2EAE5] flex flex-col justify-between hover:border-[#16A36A] hover:shadow-xs transition duration-150"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#16A36A] uppercase tracking-wider bg-[#EAF8F1] px-2.5 py-0.5 rounded">
                    {tool.categoryLabel}
                  </span>
                  <span className="text-[10px] font-bold text-[#0B3D2E] bg-[#F7FAF8] border border-[#E2EAE5] px-2 py-0.5 rounded">
                    {tool.badge || 'Gratis'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0B3D2E] leading-snug">{tool.name}</h3>
                  <p className="text-xs font-semibold text-[#16A36A] mt-1">{tool.tagline}</p>
                  <p className="text-xs sm:text-sm text-[#64756D] leading-relaxed mt-2.5 min-h-[44px]">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2EAE5]">
                <Link
                  href={tool.href}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
                >
                  <span>Gunakan Tool Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade to Web App CRM Banner */}
      <section className="py-16 bg-white border-t border-[#E2EAE5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B3D2E]">
            Butuh Sistem Otomatisasi Operasional yang Lebih Lengkap?
          </h3>
          <p className="text-sm text-[#64756D] max-w-xl mx-auto">
            Dinamis Web Apps menyatukan pencatatan lead, survei lapangan, kalkulasi RAB, hingga manajemen proyek dalam satu alur terpusat.
          </p>
          <div className="pt-2">
            <Link
              href="/crm"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs"
            >
              <span>Jelajahi Solusi Web Apps</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
