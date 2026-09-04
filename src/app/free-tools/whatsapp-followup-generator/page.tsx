'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ChevronLeft, MessageSquare, Copy, Check, ArrowRight } from 'lucide-react';

export default function WhatsAppFollowupGeneratorPage() {
  const [clientName, setClientName] = useState<string>('Bpk. Hendra');
  const [businessType, setBusinessType] = useState<string>('Jasa Renovasi & Interior');
  const [situation, setSituation] = useState<'after_quote' | 'no_reply' | 'price_concern' | 'schedule_survey'>('after_quote');
  const [copied, setCopied] = useState<boolean>(false);

  const getTemplate = () => {
    const name = clientName || 'Bpk/Ibu';
    const biz = businessType || 'layanan kami';

    switch (situation) {
      case 'after_quote':
        return `Halo ${name}, selamat pagi/siang. 

Semoga kabar baik menyertai Anda. Menindaklanjuti draf penawaran & RAB ${biz} yang kami kirimkan kemarin, apakah ada bagian spesifikasi atau item pekerjaan yang perlu kami sesuaikan kembali dengan kebutuhan Anda?

Kami siap bantu diskusikan opsi terbaik. Terima kasih banyak.`;

      case 'no_reply':
        return `Halo ${name}, salam hangat. 

Mohon maaf mengganggu waktunya sebentar. Kami ingin memastikan apakah penawaran terkait ${biz} sebelumnya sudah sempat ditinjau? 

Jika saat ini masih dalam tahap pertimbangan internal, silakan kabari kami jika membutuhkan informasi tambahan atau penyesuaian termin. Semoga sukses selalu!`;

      case 'price_concern':
        return `Halo ${name}, terima kasih banyak atas masukannya terkait penawaran harga ${biz}. 

Kami sangat memahami pertimbangan efisiensi anggaran Anda. Jika diperlukan, kami dapat membantu menyusun opsi penyesuaian material atau pentahapan pekerjaan agar sesuai dengan alokasi budget tanpa mengurangi standar mutu. 

Apakah memungkinkan untuk diskusi singkat via telepon hari ini? Terima kasih.`;

      case 'schedule_survey':
        return `Halo ${name}, terima kasih telah menghubungi kami mengenai ${biz}. 

Untuk memberikan estimasi perhitungan dan rekomendasi teknis yang paling presisi, tim kami siap melakukan survei pengukuran langsung ke lokasi. 

Kira-kira hari apa di minggu ini yang paling nyaman bagi Anda untuk jadwal survei? Terima kasih.`;
    }
  };

  const currentScript = getTemplate();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentScript);
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
            <MessageSquare className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>KOMUNIKASI & FOLLOW-UP SALES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight">
            Generator Follow-Up WhatsApp
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64756D]">
            Buat pesan follow-up sopan, persuasif, dan anti-ghosting tanpa perlu mengetik draf dari awal.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2EAE5] space-y-5 shadow-xs">
            <h2 className="text-lg font-bold text-[#0B3D2E]">Skenario Prospek</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Nama Klien / Panggilan
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] text-sm focus:outline-none focus:border-[#16A36A] focus:bg-white transition"
                  placeholder="Contoh: Bpk. Doni"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Bidang Bisnis / Layanan
                </label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] text-sm focus:outline-none focus:border-[#16A36A] focus:bg-white transition"
                  placeholder="Contoh: Pengadaan Material / Desain"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Situasi Follow-Up
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'after_quote', label: '1. Pasca Kirim RAB / Penawaran' },
                    { id: 'no_reply', label: '2. Belum Ada Balasan (Reminder)' },
                    { id: 'price_concern', label: '3. Prospek Merasa Kemahalan' },
                    { id: 'schedule_survey', label: '4. Menjadwalkan Survei Lokasi' },
                  ].map((sit) => (
                    <button
                      key={sit.id}
                      type="button"
                      onClick={() => setSituation(sit.id as any)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        situation === sit.id
                          ? 'bg-[#0B3D2E] text-white'
                          : 'bg-[#F7FAF8] text-[#64756D] hover:bg-[#EAF8F1]'
                      }`}
                    >
                      {sit.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generated Message Output Column */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#16A36A] space-y-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#16A36A] uppercase tracking-wider">
                  Draf Pesan Siap Kirim
                </span>
                <span className="text-[10px] bg-[#EAF8F1] text-[#16A36A] px-2 py-0.5 rounded-md font-bold">
                  WhatsApp Friendly
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] font-sans text-xs sm:text-sm text-[#10231B] whitespace-pre-line leading-relaxed min-h-[180px]">
                {currentScript}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
              >
                {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Teks Pesan'}</span>
              </button>

              <Link
                href="/digital-products/whatsapp-followup-kit"
                className="text-xs font-semibold text-[#16A36A] hover:text-[#0B3D2E] inline-flex items-center gap-1"
              >
                <span>35+ Skrip Lengkap</span>
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
