import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { ValueStrip } from '@/components/landing/ValueStrip';
import { WhatIsDinamis } from '@/components/landing/WhatIsDinamis';
import { DinamisCRMSection } from '@/components/landing/DinamisCRMSection';
import { SolutionsSection } from '@/components/landing/SolutionsSection';
import { AIToolsSection } from '@/components/landing/AIToolsSection';
import { DigitalProductsSection } from '@/components/landing/DigitalProductsSection';
import { FreeToolsSection } from '@/components/landing/FreeToolsSection';
import { ResourcesSection } from '@/components/landing/ResourcesSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'DINAMIS — Solusi Digital untuk Bisnis yang Lebih Terstruktur',
  description:
    'Software, tools, digital products, dan solusi digital untuk membantu bisnis mengelola customer, penjualan, pekerjaan, dan aktivitas sehari-hari dengan lebih rapi dan minim pekerjaan manual.',
  keywords: [
    'DINAMIS',
    'Solusi Digital Bisnis',
    'DinamisCRM',
    'Contractor CRM',
    'AI Tools Bisnis',
    'Digital Products Bisnis',
    'Free Tools Bisnis',
    'Automasi Sales',
    'Pipeline Penjualan',
  ],
  openGraph: {
    title: 'DINAMIS — Solusi Digital untuk Bisnis yang Lebih Terstruktur',
    description:
      'Software, tools, digital products, dan solusi digital untuk membantu bisnis mengelola customer, penjualan, pekerjaan, dan aktivitas sehari-hari dengan lebih rapi.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />
      <Hero />
      <ValueStrip />
      <WhatIsDinamis />
      <DinamisCRMSection />
      <SolutionsSection />
      <AIToolsSection />
      <DigitalProductsSection />
      <FreeToolsSection />
      <ResourcesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}