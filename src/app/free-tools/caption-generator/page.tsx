'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ChevronLeft, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

export default function CaptionGeneratorPage() {
  const [productName, setProductName] = useState<string>('Jasa Desain & Renovasi Interior');
  const [mainBenefit, setMainBenefit] = useState<string>('Pengerjaan rapi tepat waktu dengan garansi purna-jual dan transparansi RAB.');
  const [ctaType, setCtaType] = useState<string>('Konsultasi gratis via WhatsApp');
  const [copied, setCopied] = useState<boolean>(false);

  const captionDraft = `Mau ${productName || 'layanan terbaik'} tanpa rasa khawatir dan ribet? 💡

Kami hadir untuk membantu Anda mendapatkan hasil terbaik:
✅ ${mainBenefit || 'Kualitas terjamin dan terpercaya'}
✅ Tim berpengalaman dan alur kerja transparan
✅ Pendampingan penuh dari survei hingga selesai

Jangan tunda lagi untuk wujudkan rencana terbaik Anda hari ini!

📲 Hubungi kami sekarang: ${ctaType}
🔗 Klik link di bio untuk info selengkapnya!

#BisnisIndonesia #SolusiPraktis #LayananTerpercaya`;

  const handleCopy = () => {
    navigator.clipboard.writeText(captionDraft);
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
            <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>MARKETING & MEDIA SOSIAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight">
            Generator Caption Bisnis & Promosi
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64756D]">
            Susun teks promosi dengan formula copywriting Hook, Benefit, dan CTA siap posting.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2EAE5] space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-[#0B3D2E]">Detail Promosi</h2>

            <div>
              <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                Nama Produk / Layanan
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#0B3D2E] focus:outline-none focus:border-[#16A36A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                Keunggulan / Nilai Utama
              </label>
              <textarea
                rows={3}
                value={mainBenefit}
                onChange={(e) => setMainBenefit(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#0B3D2E] focus:outline-none focus:border-[#16A36A] focus:bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                Ajakan Tindakan (CTA)
              </label>
              <input
                type="text"
                value={ctaType}
                onChange={(e) => setCtaType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#0B3D2E] focus:outline-none focus:border-[#16A36A] focus:bg-white"
              />
            </div>
          </div>

          {/* Output Column */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#16A36A] space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#16A36A] uppercase tracking-wider">
                Draf Caption Siap Pakai
              </span>

              <div className="mt-3 p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs sm:text-sm text-[#10231B] whitespace-pre-line leading-relaxed min-h-[220px]">
                {captionDraft}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
              >
                {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Caption Tersalin!' : 'Salin Teks Caption'}</span>
              </button>

              <Link
                href="/ai-tools"
                className="text-xs font-semibold text-[#16A36A] hover:text-[#0B3D2E] inline-flex items-center gap-1"
              >
                <span>Coba AI Assistant</span>
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
