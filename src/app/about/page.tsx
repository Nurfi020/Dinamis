import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, Cpu, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Kami | DINAMIS Digital Business Platform',
  description:
    'DINAMIS membantu bisnis bekerja lebih rapi dengan solusi digital yang mengurangi pekerjaan manual dan pekerjaan berulang melalui software, AI tools, dan digital products.',
  keywords: [
    'Tentang DINAMIS',
    'Platform Bisnis Digital',
    'Software Indonesia',
    'Automasi Bisnis',
    'DINAMIS CRM',
  ],
  openGraph: {
    title: 'Tentang Kami | DINAMIS',
    description:
      'Membantu bisnis bekerja lebih rapi dan minim pekerjaan manual melalui ekosistem solusi digital terintegrasi.',
    type: 'website',
  },
};

export default function AboutPage() {
  const values = [
    {
      title: 'Less Admin, More Output',
      desc: 'Setiap produk dirancang untuk memangkas jam kerja administratif agar tim dapat fokus pada eksekusi dan penutupan deal penjualan.',
      icon: Zap,
    },
    {
      title: 'Pragmatis & Siap Pakai',
      desc: 'Menolak kerumitan software enterprise yang butuh waktu onboarding berbulan-bulan. Solusi DINAMIS siap digunakan dalam hitungan menit.',
      icon: Layers,
    },
    {
      title: 'Automasi Berkelanjutan',
      desc: 'Menghubungkan alur lead, pesan WhatsApp, dan database agar data mengalir otomatis tanpa perlu copy-paste manual berulang kali.',
      icon: Cpu,
    },
    {
      title: 'Keamanan Data & Privasi',
      desc: 'Data bisnis dan catatan keuangan dilindungi arsitektur server-side yang aman, role-based access control, dan audit logging.',
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-36 pb-16 sm:pt-44 sm:pb-20 border-b border-[#E2EAE5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold tracking-wide shadow-2xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>TENTANG DINAMIS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.12]">
            Membantu Bisnis Bekerja Lebih Rapi dan Minim Pekerjaan Manual.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#64756D] leading-relaxed max-w-2xl mx-auto">
            DINAMIS membangun ekosistem software, tools, dan produk digital untuk membebaskan tim dari rutinitas administratif yang berulang.
          </p>
        </div>
      </section>

      {/* Core Philosophy Banner */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B3D2E] text-white p-8 sm:p-14 space-y-6">
          <span className="text-xs font-mono font-bold text-[#22C55E] uppercase tracking-wider">
            Filosofi Utama Kami
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight max-w-3xl">
            &ldquo;Bangun sekali. Otomatiskan lebih banyak. Kelola lebih sedikit.&rdquo;
          </h2>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
            Kami percaya bahwa software yang baik bukanlah software dengan fitur terbanyak yang membingungkan, melainkan software yang paling efektif menghilangkan pekerjaan administratif yang tidak perlu.
          </p>
        </div>
      </section>

      {/* Principles Grid */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#E2EAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3D2E]">Prinsip Desain Produk DINAMIS</h2>
            <p className="text-xs sm:text-sm text-[#64756D]">
              Standar baku yang kami terapkan dalam mengembangkan seluruh solusi di ekosistem DINAMIS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B3D2E]">{val.title}</h3>
                  <p className="text-xs text-[#64756D] leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3D2E]">
          Mulai Bekerja Lebih Terstruktur Bersama DINAMIS
        </h2>
        <p className="text-sm sm:text-base text-[#64756D] max-w-xl mx-auto">
          Jelajahi ragam produk, asisten AI, dan software operasional yang sesuai dengan skala bisnis Anda saat ini.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/crm"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs"
          >
            Lihat Solusi CRM
          </Link>
          <Link
            href="/ai-tools"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[#E2EAE5] text-[#0B3D2E] font-semibold text-sm hover:bg-[#F7FAF8] transition"
          >
            Jelajahi AI Tools
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
