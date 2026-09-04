import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AIToolGrid } from '@/components/ai-tools/AIToolGrid';
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Tools untuk Bisnis & Produktivitas | DINAMIS',
  description:
    'Gunakan AI tools untuk mempercepat pekerjaan, mengurangi pekerjaan berulang, dan bekerja lebih produktif — asisten pesan follow-up, respon WhatsApp, dan proposal proyek.',
  keywords: [
    'AI Tools Bisnis',
    'AI Follow-up Assistant',
    'AI WhatsApp Response',
    'AI Proposal Generator',
    'AI Sales Assistant',
    'Produktivitas AI Indonesia',
    'DINAMIS AI',
  ],
  openGraph: {
    title: 'AI Tools untuk Bisnis & Produktivitas | DINAMIS',
    description:
      'Gunakan AI tools untuk mempercepat pekerjaan, mengurangi pekerjaan berulang, dan bekerja lebih produktif.',
    type: 'website',
  },
};

export default function AIToolsDirectoryPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Directory Hero */}
      <section className="pt-36 pb-16 sm:pt-44 sm:pb-20 border-b border-[#E2EAE5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold tracking-wide shadow-2xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>AI FOR AUTOMATION & PRODUCTIVITY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.12]">
            AI Tools untuk Membantu Pekerjaan Anda Lebih Cepat.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#64756D] leading-relaxed max-w-2xl mx-auto">
            Gunakan AI untuk mengurangi pekerjaan berulang, mempercepat pekerjaan rutin, dan membantu Anda bekerja lebih produktif tanpa kerumitan teknis.
          </p>
        </div>
      </section>

      {/* AI Tools Grid with Filter Tabs */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3D2E]">Katalog Asisten & Tools AI</h2>
          <p className="text-xs sm:text-sm text-[#64756D]">
            Dirancang untuk self-service, instant delivery, dan membantu tim memotong jam kerja manual.
          </p>
        </div>

        <AIToolGrid />
      </section>

      {/* Integration with CRM / Next Step */}
      <section className="py-16 bg-white border-t border-[#E2EAE5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B3D2E]">
            Ingin Menggabungkan AI dengan Sistem CRM Lengkap?
          </h3>
          <p className="text-sm text-[#64756D] max-w-xl mx-auto">
            DinamisCRM menyatukan asisten follow-up dengan database customer dan alur pipeline penjualan terintegrasi.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/crm"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs"
            >
              <span>Jelajahi Solusi CRM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/crm/contractor"
              className="inline-flex items-center gap-1 py-3 px-5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-semibold text-sm hover:bg-[#EAF8F1] transition"
            >
              <span>Lihat Contractor CRM</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
