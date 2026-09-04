'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E2EAE5]'
          : 'bg-white/90 backdrop-blur-xs border-b border-[#E2EAE5]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-extrabold text-2xl tracking-tight text-[#0B3D2E] group-hover:text-[#16A36A] transition">
              DINAMIS
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A] tracking-wider uppercase">
              Platform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-[#10231B]">
            <Link href="/" className="px-3 py-2 rounded-lg hover:text-[#16A36A] transition">
              Home
            </Link>

            {/* Dropdown Web Apps */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('webapps')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-[#16A36A] transition">
                <span>Web Apps</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    activeDropdown === 'webapps' ? 'rotate-180 text-[#16A36A]' : 'text-[#64756D]'
                  }`}
                />
              </button>
              {activeDropdown === 'webapps' && (
                <div className="absolute top-full left-0 w-72 pt-2 shadow-xl rounded-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl border border-[#E2EAE5] p-3 shadow-md space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#64756D] px-2 py-1">
                      Software & Operasional Bisnis
                    </div>
                    <Link
                      href="/crm/contractor"
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#EAF8F1] transition group"
                    >
                      <div>
                        <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">Contractor CRM</div>
                        <div className="text-xs text-[#64756D]">Alur proyek, SPK & RAB</div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A] rounded-full">
                        Tersedia
                      </span>
                    </Link>
                    <div className="flex items-center justify-between p-2 rounded-xl opacity-75">
                      <div>
                        <div className="font-medium text-[#10231B]">Property CRM</div>
                        <div className="text-xs text-[#64756D]">Listing & calon pembeli</div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F7FAF8] text-[#64756D] rounded-full">
                        Segera Hadir
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl opacity-75">
                      <div>
                        <div className="font-medium text-[#10231B]">Service Business CRM</div>
                        <div className="text-xs text-[#64756D]">Order jasa & termin</div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F7FAF8] text-[#64756D] rounded-full">
                        Segera Hadir
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl opacity-75">
                      <div>
                        <div className="font-medium text-[#10231B]">Agency CRM</div>
                        <div className="text-xs text-[#64756D]">Client retainer & pitch</div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F7FAF8] text-[#64756D] rounded-full">
                        Segera Hadir
                      </span>
                    </div>
                    <Link
                      href="/crm"
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#EAF8F1] transition group"
                    >
                      <div>
                        <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">Custom Web App</div>
                        <div className="text-xs text-[#64756D]">Sesuai alur spesifik bisnis</div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EAF8F1] text-[#0B3D2E] rounded-full">
                        Konsultasi
                      </span>
                    </Link>
                    <div className="pt-2 border-t border-[#E2EAE5]">
                      <Link
                        href="/crm"
                        className="block text-center text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] py-1"
                      >
                        Lihat Semua Web Apps →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown AI Tools */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('ai')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-[#16A36A] transition">
                <span>AI Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    activeDropdown === 'ai' ? 'rotate-180 text-[#16A36A]' : 'text-[#64756D]'
                  }`}
                />
              </button>
              {activeDropdown === 'ai' && (
                <div className="absolute top-full left-0 w-72 pt-2 shadow-xl rounded-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl border border-[#E2EAE5] p-3 shadow-md space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#64756D] px-2 py-1">
                      Biarkan AI Mengerjakan Pekerjaan Berulang
                    </div>
                    <Link href="/ai-tools" className="block p-2 rounded-xl hover:bg-[#EAF8F1] transition group">
                      <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">AI Follow-up Assistant</div>
                      <div className="text-xs text-[#64756D]">Draft pesan follow-up prospek</div>
                    </Link>
                    <Link href="/ai-tools" className="block p-2 rounded-xl hover:bg-[#EAF8F1] transition group">
                      <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">AI WhatsApp Response</div>
                      <div className="text-xs text-[#64756D]">Respon customer cepat & ramah</div>
                    </Link>
                    <Link href="/ai-tools" className="block p-2 rounded-xl hover:bg-[#EAF8F1] transition group">
                      <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">AI Sales Assistant</div>
                      <div className="text-xs text-[#64756D]">Handling objection & negosiasi</div>
                    </Link>
                    <Link href="/ai-tools" className="block p-2 rounded-xl hover:bg-[#EAF8F1] transition group">
                      <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">AI Proposal Generator</div>
                      <div className="text-xs text-[#64756D]">Draft penawaran proyek instan</div>
                    </Link>
                    <div className="pt-2 border-t border-[#E2EAE5]">
                      <Link
                        href="/ai-tools"
                        className="block text-center text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] py-1"
                      >
                        Lihat Semua AI Tools →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown Digital Products */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-[#16A36A] transition">
                <span>Digital Products</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    activeDropdown === 'products' ? 'rotate-180 text-[#16A36A]' : 'text-[#64756D]'
                  }`}
                />
              </button>
              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 w-72 pt-2 shadow-xl rounded-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl border border-[#E2EAE5] p-3 shadow-md space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#64756D] px-2 py-1">
                      Solusi Siap Pakai, Tidak Mulai dari Nol
                    </div>
                    <Link
                      href="/digital-products/whatsapp-followup-kit"
                      className="block p-2 rounded-xl hover:bg-[#EAF8F1] transition group"
                    >
                      <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">WhatsApp Follow-Up Kit</div>
                      <div className="text-xs text-[#64756D]">35+ template skrip chat closing</div>
                    </Link>
                    <Link
                      href="/digital-products/customer-database-template"
                      className="block p-2 rounded-xl hover:bg-[#EAF8F1] transition group"
                    >
                      <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">Customer Database Template</div>
                      <div className="text-xs text-[#64756D]">Format master spreadsheet leads</div>
                    </Link>
                    <Link
                      href="/digital-products/sales-pipeline-template"
                      className="block p-2 rounded-xl hover:bg-[#EAF8F1] transition group"
                    >
                      <div className="font-bold text-[#10231B] group-hover:text-[#16A36A]">Sales Pipeline Template</div>
                      <div className="text-xs text-[#64756D]">Papan Notion & Sheets deals</div>
                    </Link>
                    <div className="pt-2 border-t border-[#E2EAE5]">
                      <Link
                        href="/digital-products"
                        className="block text-center text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] py-1"
                      >
                        Lihat Semua Digital Products →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/free-tools" className="px-3 py-2 rounded-lg hover:text-[#16A36A] transition">
              Free Tools
            </Link>

            <Link href="/resources" className="px-3 py-2 rounded-lg hover:text-[#16A36A] transition">
              Resources
            </Link>

            <Link href="/about" className="px-3 py-2 rounded-lg hover:text-[#16A36A] transition">
              Tentang
            </Link>
          </nav>

          {/* Desktop Right Action */}
          <div className="hidden md:flex items-center">
            <Link
              href="/crm"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white text-sm font-semibold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
            >
              <span>Lihat Solusi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/crm"
              className="px-3 py-1.5 text-xs font-bold bg-[#0B3D2E] text-white rounded-lg shadow-xs"
            >
              Lihat Solusi
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#10231B] hover:bg-[#F7FAF8] transition focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Accordion */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2EAE5] px-4 pt-3 pb-6 space-y-3 shadow-lg max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-1 text-sm font-medium text-[#10231B]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAF8F1] hover:text-[#16A36A] transition"
            >
              Home
            </Link>

            <Link
              href="/crm"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAF8F1] hover:text-[#16A36A] transition flex items-center justify-between"
            >
              <span>Web Apps</span>
              <ChevronRight className="w-4 h-4 text-[#64756D]" />
            </Link>

            <Link
              href="/ai-tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAF8F1] hover:text-[#16A36A] transition flex items-center justify-between"
            >
              <span>AI Tools Directory</span>
              <ChevronRight className="w-4 h-4 text-[#64756D]" />
            </Link>

            <Link
              href="/digital-products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAF8F1] hover:text-[#16A36A] transition flex items-center justify-between"
            >
              <span>Digital Products</span>
              <ChevronRight className="w-4 h-4 text-[#64756D]" />
            </Link>

            <Link
              href="/free-tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAF8F1] hover:text-[#16A36A] transition flex items-center justify-between"
            >
              <span>Free Tools</span>
              <ChevronRight className="w-4 h-4 text-[#64756D]" />
            </Link>

            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAF8F1] hover:text-[#16A36A] transition"
            >
              Resources
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-[#EAF8F1] hover:text-[#16A36A] transition"
            >
              Tentang DINAMIS
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E2EAE5] flex flex-col gap-2">
            <Link
              href="/crm"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0B3D2E] text-white font-semibold text-center text-sm shadow-xs"
            >
              <span>Lihat Solusi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
