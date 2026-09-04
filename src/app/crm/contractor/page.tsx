import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  FolderKanban,
  MapPin,
  FileSpreadsheet,
  ShoppingCart,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contractor CRM — Solusi Proyek & Operasional Kontraktor | DINAMIS',
  description:
    'Sistem operasional dan CRM kontraktor: Pipeline 7-tahap proyek, survei GPS lokasi, penyusunan RAB, pengadaan material, penandatanganan SPK, dan rekap keuangan terpadu.',
  keywords: [
    'Contractor CRM',
    'Aplikasi Kontraktor',
    'Software Renovasi Bangunan',
    'RAB Kontraktor',
    'Pipeline Proyek Konstruksi',
    'DINAMIS CRM Kontraktor',
  ],
};

export default function ContractorCRMPage() {
  const CONTRACTOR_WA_URL =
    'https://wa.me/6281234567890?text=Halo%20DINAMIS,%20saya%20tertarik%20dengan%20Contractor%20CRM%20dan%20ingin%20konsultasi%20kebutuhan%20proyek%20bisnis.';

  const workflowStages = [
    { num: '01', title: 'Lead Masuk', desc: 'Pencatatan data kontak calon klien dan kebutuhan proyek.' },
    { num: '02', title: 'Survei Lokasi', desc: 'Pengambilan titik koordinat GPS dan foto kondisi lapangan.' },
    { num: '03', title: 'Penyusunan RAB', desc: 'Kalkulasi rincian estimasi biaya material, upah, dan margin.' },
    { num: '04', title: 'Penawaran Klien', desc: 'Pengiriman surat penawaran harga resmi dan negosiasi alur.' },
    { num: '05', title: 'SPK Disetujui', desc: 'Verifikasi tanda tangan Surat Perjanjian Kerja & uang muka.' },
    { num: '06', title: 'Pelaksanaan Proyek', desc: 'Pencatatan belanja material real-time dan progres harian.' },
    { num: '07', title: 'Serah Terima & BAST', desc: 'Pelunasan termin akhir, berita acara, dan arsip audit log.' },
  ];

  const keyFeatures = [
    {
      icon: FolderKanban,
      title: 'Pipeline 7-Tahap Proyek',
      desc: 'Visualisasi status pengerjaan proyek dari inquiry awal hingga serah terima fisik tanpa ada informasi tercecer.',
    },
    {
      icon: MapPin,
      title: 'Survei GPS Lokasi',
      desc: 'Supervisor lapangan dapat mencatat titik koordinat GPS dan mengunggah dokumentasi foto langsung dari smartphone.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Manajemen RAB Proyek',
      desc: 'Upload dan kelola Rencana Anggaran Biaya, estimasi margin keuntungan, dan syarat termin pembayaran proyek.',
    },
    {
      icon: ShoppingCart,
      title: 'Kontrol Belanja Material',
      desc: 'Catat setiap nota pengadaan material toko bangunan dan pantau perbandingannya terhadap alokasi anggaran RAB.',
    },
    {
      icon: Users,
      title: 'Manajemen Tim & Multi-Role',
      desc: 'Hak akses terpisah untuk Owner, Project Manager, Site Supervisor, Tim Purchasing, dan Mandor Lapangan.',
    },
    {
      icon: ShieldCheck,
      title: 'Audit Log & Laporan Keuangan',
      desc: 'Perekaman jejak aktivitas operasional otomatis untuk mencegah manipulasi data belanja dan laporan keuangan.',
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
                <Building2 className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>SOLUSI SPESIFIK INDUSTRI</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0B3D2E] tracking-tight leading-[1.12]">
                Contractor CRM — Kelola Proyek & Operasional Lebih Rapi.
              </h1>

              <p className="text-base sm:text-lg text-[#64756D] leading-relaxed max-w-xl">
                Sistem CRM operasional terpadu untuk kontraktor, renovasi, dan interior: Satukan alur lead, survei lokasi, RAB, pengadaan material, SPK, hingga laporan keuangan dalam satu sistem terkontrol.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={CONTRACTOR_WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-base hover:bg-[#16A36A] transition shadow-xs active:scale-98"
                >
                  <span>Konsultasikan Kebutuhan Anda</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/login"
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
                  Siap Pakai Tanpa Instalasi
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  Akses Mobile Web
                </span>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-[#F7FAF8] border border-[#D1DDD6] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
                  <span className="text-xs font-bold text-[#0B3D2E]">Ringkasan Proyek Aktif</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A]">
                    Live Workspace
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#10231B]">Villa Ubud Resort</div>
                      <div className="text-[#64756D] text-[11px]">Nilai: Rp 1.450.000.000 • Tahap 5 SPK</div>
                    </div>
                    <span className="text-[#16A36A] font-bold">On Track</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#10231B]">Interior Kafe Senopati</div>
                      <div className="text-[#64756D] text-[11px]">Nilai: Rp 380.000.000 • Tahap 6 Material</div>
                    </div>
                    <span className="text-[#16A36A] font-bold">Belanja Terkontrol</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#10231B]">Ruko Komersial BSD</div>
                      <div className="text-[#64756D] text-[11px]">Nilai: Rp 620.000.000 • Tahap 2 Survei</div>
                    </div>
                    <span className="text-[#0B3D2E] font-bold">GPS Terverifikasi</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2EAE5] text-center">
                  <a
                    href={CONTRACTOR_WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] inline-flex items-center gap-1"
                  >
                    Konsultasikan Alur Proyek <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Stage Workflow Strip */}
      <section id="workflow" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF8F1] text-[#0B3D2E] text-xs font-bold">
            <span>ALUR KERJA TERSTRUKTUR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E]">
            Pipeline 7 Tahap Operasional Kontraktor
          </h2>
          <p className="text-sm sm:text-base text-[#64756D]">
            Setiap proyek bergerak melalui tahapan yang jelas untuk mencegah pekerjaan terlewat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {workflowStages.map((stg) => (
            <div
              key={stg.num}
              className="p-4 rounded-2xl bg-white border border-[#E2EAE5] space-y-2 hover:border-[#16A36A] transition"
            >
              <div className="text-xs font-mono font-bold text-[#16A36A] bg-[#EAF8F1] w-7 h-7 rounded-lg flex items-center justify-center">
                {stg.num}
              </div>
              <h3 className="font-bold text-[#0B3D2E] text-xs leading-snug">{stg.title}</h3>
              <p className="text-[11px] text-[#64756D] leading-relaxed">{stg.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 sm:py-24 bg-white border-t border-[#E2EAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E]">
              Fitur Lengkap yang Langsung Siap Pakai
            </h2>
            <p className="text-sm sm:text-base text-[#64756D]">
              Semua kebutuhan operasional kontraktor disatukan tanpa perlu software terpisah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-3 hover:border-[#16A36A] hover:bg-white transition duration-150"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0B3D2E]">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64756D] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Action CTA */}
      <section className="py-16 sm:py-20 bg-[#0B3D2E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Konsultasikan Kebutuhan Contractor CRM Anda
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base">
            Diskusikan alur operasional proyek, kebutuhan survei, RAB, dan pengadaan material Anda bersama tim solusi DINAMIS.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={CONTRACTOR_WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#0B3D2E] font-semibold text-sm hover:bg-[#EAF8F1] transition shadow-xs active:scale-98"
            >
              <span>Konsultasikan Kebutuhan Anda</span>
              <ArrowRight className="w-4 h-4 text-[#0B3D2E]" />
            </a>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-2xl bg-[#16A36A] text-white font-bold text-sm hover:bg-[#22C55E] transition shadow-xs"
            >
              <span>Lihat Demo</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition"
            >
              <span>Lihat Fitur Lengkap</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
