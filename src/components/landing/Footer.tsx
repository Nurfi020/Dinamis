'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07261C] text-white/70 border-t border-white/10 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <span className="font-extrabold text-2xl tracking-tight text-white hover:text-[#22C55E] transition">
                DINAMIS
              </span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Digital solutions for business & work. Membantu bisnis bekerja lebih rapi dengan solusi digital yang mengurangi pekerjaan manual dan pekerjaan berulang.
            </p>
            <div className="text-[11px] text-[#22C55E] font-mono">
              Build once. Automate more. Maintain less.
            </div>
          </div>

          {/* Solutions Col */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Web Apps</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/crm/contractor" className="text-white hover:text-[#22C55E] transition font-medium">
                  Contractor CRM
                </Link>
              </li>
              <li>
                <Link href="/crm#property" className="hover:text-[#22C55E] transition">
                  Property CRM
                </Link>
              </li>
              <li>
                <Link href="/crm#service" className="hover:text-[#22C55E] transition">
                  Service Business
                </Link>
              </li>
              <li>
                <Link href="/crm#agency" className="hover:text-[#22C55E] transition">
                  Agency CRM
                </Link>
              </li>
              <li>
                <Link href="/crm" className="hover:text-[#22C55E] transition">
                  Custom Web App
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & AI Tools Col */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Products & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/crm" className="hover:text-[#22C55E] transition">
                  Web Apps
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="hover:text-[#22C55E] transition">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link href="/digital-products" className="hover:text-[#22C55E] transition">
                  Digital Products
                </Link>
              </li>
              <li>
                <Link href="/free-tools" className="hover:text-[#22C55E] transition">
                  Free Tools
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#22C55E] transition">
                  Resources & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal Col */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#22C55E] transition">
                  Tentang DINAMIS
                </Link>
              </li>
              <li>
                <Link href="/about#privacy" className="hover:text-[#22C55E] transition">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/about#terms" className="hover:text-[#22C55E] transition">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            &copy; {new Date().getFullYear()} DINAMIS (dinamiscrm.online). All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>Platform V2 Ecosystem</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-white/70 hover:text-white transition p-1"
              aria-label="Kembali ke atas"
            >
              <span>Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
