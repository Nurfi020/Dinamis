import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Users2,
  LayoutDashboard,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business CRM — CRM Sederhana untuk Mengelola Customer & Sales | DINAMIS',
  description:
    'Sistem CRM praktis untuk membantu bisnis mengelola lead, customer, follow-up, sales pipeline, dan riwayat aktivitas dalam satu tempat yang lebih rapi.',
  keywords: [
    'Business CRM',
    'CRM UMKM',
    'Aplikasi Sales Pipeline',
    'Lead Management Bisnis',
    'Follow up Customer',
    'DINAMIS CRM',
  ],
};

export default function BusinessCRMPage() {
  const BUSINESS_WA_URL =
    'https://wa.me/6281234567890?text=Halo%20DINAMIS,%20saya%20tertarik%20dengan%20Business%20CRM%20dan%20ingin%20konsultasi%20kebutuhan%20sales%20bisnis.';

  const features = [
    {
      icon: Users2,
      title: 'Database Lead & Customer Terpusat',
      desc: 'Simpan semua kontak prospek, nomor WhatsApp, preferensi, dan riwayat komunikasi tanpa tercecer di buku catatan atau chat pribadi.',
    },
    {
      icon: LayoutDashboard,
      title: 'Sales Pipeline & Tahapan Deals',
      desc: 'Pantau posisi deals pelanggan mulai dari tahap kontak pertama, follow-up, penawaran harga, hingga transaksi closing.',
    },
    {
      icon: Clock,
      title: 'Reminder Jadwal Follow-up',
      desc: 'Pengingat kontak kembali agar tim sales tidak lupa menghubungi prospek potensial pada waktu yang tepat.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-based Access & Keamanan Data',
      desc: 'Hak akses terstruktur untuk Owner, Manager Penjualan, dan Admin Sales untuk menjaga privasi data database.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 sm:pt-44 sm:pb-28 bg-white border-b border-[#E2EAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>UMKM & BISNIS UMUM</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0B3D2E] tracking-tight leading-[1.12]">
                Business CRM — Kelola Customer & Sales Lebih Rapi.
              </h1>

              <p className="text-base sm:text-lg text-[#64756D] leading-relaxed max-w-xl">
                Sistem CRM praktis untuk membantu bisnis mengelola lead, customer, follow-up, sales pipeline, dan riwayat aktivitas dalam satu alur yang sederhana dan minim pekerjaan manual.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={BUSINESS_WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-base hover:bg-[#16A36A] transition shadow-xs active:scale-98"
                >
                  <span>Konsultasikan via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/crm/business/demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6] text-[#0B3D2E] font-bold text-base hover:bg-[#16A36A] hover:text-white hover:border-[#16A36A] transition shadow-2xs active:scale-98"
                >
                  <span>Lihat Demo</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#E2EAE5] text-[#10231B] font-semibold text-base hover:bg-[#F7FAF8] transition"
                >
                  <span>Lihat Fitur</span>
                </a>
              </div>

              <div className="pt-2 flex items-center gap-6 text-xs text-[#64756D]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  Low Setup & Siap Pakai
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  Akses Mobile Browser
                </span>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-[#F7FAF8] border border-[#D1DDD6] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
                  <span className="text-xs font-bold text-[#0B3D2E]">Ringkasan Sales Pipeline</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A]">
                    Live Workspace
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#10231B]">Pak Anton (Toko Ritel)</div>
                      <div className="text-[#64756D] text-[11px]">Follow-up Hari Ini • Jadwal 14:00</div>
                    </div>
                    <span className="text-[#16A36A] font-bold">Follow-up</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#10231B]">Ibu Maya (Klinik Estetika)</div>
                      <div className="text-[#64756D] text-[11px]">Penawaran Paket • Rp 45.000.000</div>
                    </div>
                    <span className="text-[#0B3D2E] font-bold">Negosiasi</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#10231B]">Bpk. David (Distributor)</div>
                      <div className="text-[#64756D] text-[11px]">Repeat Order • Rp 82.000.000</div>
                    </div>
                    <span className="text-[#16A36A] font-bold">Closing</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2EAE5] text-center">
                  <Link
                    href="/crm/business/demo"
                    className="text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] inline-flex items-center gap-1"
                  >
                    Buka Demo Interaktif <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E]">
            Fitur Praktis untuk Mempercepat Penjualan
          </h2>
          <p className="text-sm sm:text-base text-[#64756D]">
            Dirancang agar tim Anda langsung dapat menggunakan sistem tanpa pelatihan rumit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2EAE5] space-y-3 hover:border-[#16A36A] transition duration-150 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B3D2E]">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-[#64756D] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 bg-[#0B3D2E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Konsultasikan Kebutuhan Business CRM Anda
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base">
            Diskusikan kebutuhan manajemen lead dan customer bisnis Anda bersama tim DINAMIS.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={BUSINESS_WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#0B3D2E] font-semibold text-sm hover:bg-[#EAF8F1] transition shadow-xs active:scale-98"
            >
              <span>Konsultasikan via WhatsApp</span>
              <ArrowRight className="w-4 h-4 text-[#0B3D2E]" />
            </a>
            <Link
              href="/crm/business/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-2xl bg-[#16A36A] text-white font-bold text-sm hover:bg-[#22C55E] transition shadow-xs"
            >
              <span>Lihat Demo</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
