import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Sparkles, ArrowRight, Clock, BookOpen, Layers, Laptop, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources & Panduan Bisnis | DINAMIS',
  description:
    'Panduan praktis, artikel, dan SOP untuk membantu bisnis mengelola customer, mengurangi pekerjaan berulang, dan memanfaatkan AI serta software CRM.',
  keywords: [
    'Panduan CRM',
    'Follow-up Prospek',
    'SOP Sales Lapangan',
    'Database Customer Excel',
    'AI Bisnis',
    'DINAMIS Resources',
  ],
  openGraph: {
    title: 'Resources & Panduan Bisnis | DINAMIS',
    description:
      'Panduan praktis untuk membantu bisnis mengelola customer, mengurangi pekerjaan berulang, dan meningkatkan produktivitas.',
    type: 'website',
  },
};

export default function ResourcesPage() {
  const articles = [
    {
      id: 'lead-management',
      category: 'CRM & Pipeline',
      title: 'Cara Mengelola Lead Bisnis Agar Tidak Ada yang Terlewat',
      readTime: '4 min baca',
      desc: 'Standar pencatatan dan distribusi prospek baru dari WhatsApp dan form iklan ke tim sales lapangan agar waktu respon tetap cepat dan terkoordinasi.',
      solutionCategory: 'Solusi Software',
      solutionTitle: 'Contractor CRM',
      solutionHref: '/crm/contractor',
    },
    {
      id: 'followup-automation',
      category: 'AI & Automasi',
      title: 'Cara Membuat Sistem Follow-up Customer dengan Bantuan AI',
      readTime: '5 min baca',
      desc: 'Bagaimana asisten AI dapat membantu menyiapkan draf balasan pesan dan reminder kontak ulang tanpa membuat tim sales mengetik dari nol.',
      solutionCategory: 'AI Assistant',
      solutionTitle: 'AI Follow-up Assistant',
      solutionHref: '/ai-tools',
    },
    {
      id: 'customer-database',
      category: 'Digital Template',
      title: 'Panduan Praktis Menyusun Format Database Customer yang Rapi',
      readTime: '5 min baca',
      desc: 'Struktur kolom master data pelanggan yang wajib ada untuk melacak histori transaksi, estimasi closing, dan jadwal kontak berkala.',
      solutionCategory: 'Template Spreadsheet',
      solutionTitle: 'Customer Database Template',
      solutionHref: '/digital-products/customer-database-template',
    },
    {
      id: 'sales-objection',
      category: 'Sales & Negosiasi',
      title: 'Strategi Menghadapi Calon Klien yang Menyatakan "Kemahalan"',
      readTime: '6 min baca',
      desc: 'Pendekatan edukatif berbasis transparansi RAB dan rincian spesifikasi pekerjaan untuk menjaga nilai deal tanpa perang harga.',
      solutionCategory: 'Toolkit Sales',
      solutionTitle: 'Marketing & Sales Toolkit',
      solutionHref: '/digital-products/marketing-toolkit',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-36 pb-16 sm:pt-44 sm:pb-20 border-b border-[#E2EAE5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold tracking-wide shadow-2xs mb-6">
            <BookOpen className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>KNOWLEDGE HUB & BEST PRACTICES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.12]">
            Insight, Panduan, dan Resource Praktis.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#64756D] leading-relaxed max-w-2xl mx-auto">
            Panduan praktis untuk membantu bisnis mengelola customer, mengurangi pekerjaan berulang, dan meningkatkan produktivitas tim.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((item) => (
            <div
              key={item.id}
              className="p-7 sm:p-8 rounded-3xl bg-white border border-[#E2EAE5] space-y-5 hover:border-[#16A36A] transition duration-150 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#64756D]">
                  <span className="font-bold text-[#16A36A] uppercase tracking-wider font-mono text-[11px] bg-[#EAF8F1] px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#0B3D2E] leading-snug">
                  {item.title}
                </h2>

                <p className="text-sm text-[#64756D] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Related Solution Internal Link */}
              <div className="pt-4 border-t border-[#E2EAE5] flex items-center justify-between">
                <div className="text-xs text-[#64756D]">
                  Terkait:{' '}
                  <span className="font-semibold text-[#10231B]">{item.solutionCategory}</span>
                </div>
                <Link
                  href={item.solutionHref}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] transition"
                >
                  <span>{item.solutionTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Cross-Hub Navigation */}
      <section className="py-16 bg-white border-t border-[#E2EAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-2xl font-bold text-[#0B3D2E]">Jelajahi Solusi Digital DINAMIS</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/crm"
              className="px-5 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-semibold text-xs hover:bg-[#EAF8F1] transition"
            >
              CRM Directory
            </Link>
            <Link
              href="/ai-tools"
              className="px-5 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-semibold text-xs hover:bg-[#EAF8F1] transition"
            >
              AI Tools
            </Link>
            <Link
              href="/digital-products"
              className="px-5 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-semibold text-xs hover:bg-[#EAF8F1] transition"
            >
              Digital Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
