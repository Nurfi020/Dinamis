import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { CRMProductGrid } from '@/components/crm/CRMProductGrid';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Web Apps & CRM untuk Bisnis | DINAMIS',
  description:
    'Solusi Web Apps dan CRM untuk membantu bisnis mengelola customer, sales, follow-up, dan operasional dengan lebih terstruktur — tanpa menambah pekerjaan administratif yang tidak perlu.',
  keywords: [
    'Web Apps Bisnis',
    'CRM Bisnis',
    'Contractor CRM',
    'Property CRM',
    'Service CRM',
    'Agency CRM',
    'Custom Web App',
    'DINAMIS Web Apps',
  ],
  openGraph: {
    title: 'Web Apps & CRM untuk Bisnis | DINAMIS',
    description:
      'Solusi Web Apps dan CRM untuk membantu bisnis mengelola customer, sales, follow-up, dan operasional dengan lebih terstruktur.',
    type: 'website',
  },
};

export default function CRMDirectoryPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Directory Hero */}
      <section className="pt-36 pb-16 sm:pt-44 sm:pb-20 border-b border-[#E2EAE5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold tracking-wide shadow-2xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>DINAMIS WEB APPS & CRM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.12]">
            Web Apps & CRM untuk Bisnis yang Ingin Bekerja Lebih Terstruktur.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#64756D] leading-relaxed max-w-2xl mx-auto">
            Kelola customer, sales, follow-up, dan operasional bisnis dalam sistem yang lebih rapi — tanpa menambah pekerjaan administratif yang tidak perlu.
          </p>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0B3D2E]">Katalog Solusi Web Apps</h2>
            <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
              Pilih sistem Web App & CRM yang dirancang khusus mengikuti proses industri bisnis Anda.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64756D]">
            <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
            <span>Low-Maintenance & Self-Service Architecture</span>
          </div>
        </div>

        <CRMProductGrid />
      </section>

      {/* Custom Requirement Strip */}
      <section className="py-16 bg-white border-t border-[#E2EAE5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B3D2E]">
            Butuh Web App yang Lebih Spesifik?
          </h3>
          <p className="text-sm text-[#64756D] max-w-xl mx-auto">
            Jika kebutuhan bisnis Anda belum tersedia dalam produk siap pakai, kami dapat membantu membuat Web App sesuai kebutuhan.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/6281234567890?text=Halo%20DINAMIS,%20saya%20tertarik%20konsultasi%20pembuatan%20Custom%20Web%20App."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
            >
              <span>Konsultasikan via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
