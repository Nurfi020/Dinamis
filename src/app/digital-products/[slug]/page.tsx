import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { DIGITAL_PRODUCTS, DigitalProduct } from '@/data/digital-products';
import {
  Check,
  ArrowRight,
  ChevronLeft,
  FileText,
  ShieldCheck,
  Zap,
  Users,
  Sparkles,
  Download
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return DIGITAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = DIGITAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | DINAMIS',
    };
  }

  return {
    title: `${product.name} — ${product.formattedPrice} | DINAMIS`,
    description: product.description,
    openGraph: {
      title: `${product.name} | DINAMIS Digital Products`,
      description: product.description,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = DIGITAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Breadcrumb & Header */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 bg-white border-b border-[#E2EAE5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/digital-products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64756D] hover:text-[#0B3D2E] transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Digital Products</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-[#16A36A] uppercase tracking-wider bg-[#EAF8F1] px-3 py-1 rounded-full border border-[#D1DDD6]">
              {product.category}
            </span>
            <span className="text-xs font-bold text-[#0B3D2E] bg-[#F7FAF8] border border-[#E2EAE5] px-3 py-1 rounded-full">
              {product.badge || 'Digital Asset'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight">
            {product.name}
          </h1>

          <p className="mt-3 text-lg font-semibold text-[#16A36A]">{product.tagline}</p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Description, What You Get, Preview */}
          <div className="lg:col-span-7 space-y-10">
            {/* Description Block */}
            <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-[#0B3D2E]">Deskripsi Produk</h2>
              <p className="text-sm sm:text-base text-[#64756D] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* What You Get Block */}
            <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#16A36A]" />
                <h2 className="text-xl font-bold text-[#0B3D2E]">Yang Anda Dapatkan</h2>
              </div>
              <div className="space-y-2.5 pt-2">
                {product.whatYouGet.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-[#10231B]">
                    <Check className="w-4 h-4 text-[#16A36A] shrink-0 mt-1" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Highlights Block */}
            <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#16A36A]" />
                <h2 className="text-xl font-bold text-[#0B3D2E]">Pratinjau Modul & Isi</h2>
              </div>
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {product.previewHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs font-semibold text-[#0B3D2E]"
                  >
                    {hl}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="p-5 rounded-2xl bg-[#EAF8F1]/60 border border-[#D1DDD6] text-xs text-[#0B3D2E] space-y-1">
              <div className="font-bold">Cocok Digunakan Oleh:</div>
              <p className="leading-relaxed text-[#64756D]">{product.targetAudience}</p>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Action Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-white border-2 border-[#16A36A] p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#64756D] uppercase">Investasi Sekali Beli</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E] mt-1">
                  {product.formattedPrice}
                </div>
                <div className="text-xs text-[#16A36A] font-medium mt-1">
                  Tanpa biaya langganan bulanan
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#E2EAE5] text-xs text-[#64756D]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#16A36A]" />
                  <span>Akses download digital instan</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
                  <span>Format siap pakai & dapat diedit penuh</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {product.externalUrl ? (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
                  >
                    <span>Dapatkan Produk Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="space-y-2">
                    <div className="w-full py-3.5 px-4 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-center text-sm font-bold text-[#64756D]">
                      Segera Hadir untuk Akses Langsung
                    </div>
                    <p className="text-[11px] text-[#64756D] text-center">
                      Produk digital ini sedang disiapkan untuk akses unduh instan mandiri.
                    </p>
                  </div>
                )}

                <Link
                  href="/digital-products"
                  className="w-full inline-flex items-center justify-center gap-1 py-2.5 px-4 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] text-xs font-semibold hover:bg-[#EAF8F1] transition"
                >
                  <span>Lihat Produk Digital Lainnya</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
