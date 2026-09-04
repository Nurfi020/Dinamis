'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ChevronLeft, FileText, Copy, Check, ArrowRight } from 'lucide-react';

export default function ProposalGeneratorPage() {
  const [clientName, setClientName] = useState<string>('PT Artha Mandiri');
  const [projectName, setProjectName] = useState<string>('Pekerjaan Renovasi Ruang Kantor');
  const [scopeOfWork, setScopeOfWork] = useState<string>('Pembongkaran partisi lama, instalasi kelistrikan baru, pengecatan dinding, dan perapian lantai vinyl.');
  const [timeline, setTimeline] = useState<string>('30 Hari Kerja');
  const [copied, setCopied] = useState<boolean>(false);

  const proposalDraft = `SURAT PENAWARAN KERJA SAMA & PROPOSAL PEKERJAAN

Kepada Yth:
${clientName || '[Nama Klien / Perusahaan]'}

Perihal: Penawaran Biaya & Lingkup Pekerjaan ${projectName || '[Nama Proyek]'}

Dengan hormat,
Bersama surat ini kami mengajukan rincian penawaran pelaksanaan pekerjaan dengan rincian sebagai berikut:

1. LINGKUP PEKERJAAN (SCOPE OF WORK):
${scopeOfWork || '[Rincian Lingkup Pekerjaan]'}

2. ESTIMASI WAKTU PELAKSANAAN:
${timeline || '[Estimasi Durasi Pekerjaan]'} terhitung sejak penandatanganan Surat Perjanjian Kerja (SPK) dan penerimaan uang muka (DP).

3. SYARAT & KETENTUAN TERMIN PEMBAYARAN:
- Termin 1 (DP): 30% pada saat penandatanganan SPK / Kick-off
- Termin 2 (Progres 50%): 40% setelah pekerjaan struktur/dasar selesai
- Termin 3 (Pelunasan): 30% setelah pekerjaan selesai 100% dan Berita Acara Serah Terima (BAST)

Demikian proposal penawaran ini kami sampaikan. Kami siap berdiskusi lebih lanjut untuk penyesuaian teknis di lapangan.

Hormat kami,
Tim Pelaksana Proyek`;

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <FileText className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>DOKUMEN BISNIS & PENAWARAN</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight">
            Generator Draft Proposal
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64756D]">
            Susun kerangka surat penawaran harga, lingkup kerja, dan klausul termin dalam hitungan detik.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2EAE5] space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-[#0B3D2E]">Informasi Proyek</h2>

            <div>
              <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                Klien / Perusahaan
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#0B3D2E] focus:outline-none focus:border-[#16A36A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                Nama Proyek / Pekerjaan
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#0B3D2E] focus:outline-none focus:border-[#16A36A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                Lingkup Pekerjaan
              </label>
              <textarea
                rows={3}
                value={scopeOfWork}
                onChange={(e) => setScopeOfWork(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#0B3D2E] focus:outline-none focus:border-[#16A36A] focus:bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                Estimasi Waktu
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#0B3D2E] focus:outline-none focus:border-[#16A36A] focus:bg-white"
              />
            </div>
          </div>

          {/* Output Column */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#16A36A] space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#16A36A] uppercase tracking-wider">
                Draf Kerangka Proposal
              </span>

              <div className="mt-3 p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] font-mono text-[11px] text-[#10231B] whitespace-pre-line leading-relaxed max-h-[360px] overflow-y-auto">
                {proposalDraft}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
              >
                {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Proposal Tersalin!' : 'Salin Draf Proposal'}</span>
              </button>

              <Link
                href="/crm/contractor"
                className="text-xs font-semibold text-[#16A36A] hover:text-[#0B3D2E] inline-flex items-center gap-1"
              >
                <span>Modul SPK Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
