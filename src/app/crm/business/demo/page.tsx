'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Users2,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Search,
  RotateCcw,
} from 'lucide-react';

const SAMPLE_LEADS = [
  {
    id: 'lead-1',
    name: 'Bpk. Anton Nugroho',
    company: 'CV Sumber Makmur (Ritel)',
    stage: 'Follow-up',
    phone: '0812-8899-1020',
    dealValue: 'Rp 35.000.000',
    lastContact: 'Kemarin, 15:30',
    nextAction: 'Kirim invoice penawaran diskon kuantiti',
    notes: 'Tertarik ambil stok grosir 50 karton per bulan.',
  },
  {
    id: 'lead-2',
    name: 'Ibu Maya Septiani',
    company: 'Klinik Estetika Glow',
    stage: 'Negosiasi',
    phone: '0813-4455-6677',
    dealValue: 'Rp 45.000.000',
    lastContact: 'Hari ini, 10:15',
    nextAction: 'Meeting finalisasi termin pembayaran',
    notes: 'Meminta sistem termin 2 tahap (DP 50% dan pelunasan 14 hari).',
  },
  {
    id: 'lead-3',
    name: 'Bpk. David Kurniawan',
    company: 'Distributor Mitra Abadi',
    stage: 'Closing',
    phone: '0811-2233-4455',
    dealValue: 'Rp 82.000.000',
    lastContact: 'Hari ini, 09:00',
    nextAction: 'Verifikasi bukti transfer DP',
    notes: 'PO resmi sudah terbit, menunggu konfirmasi kiriman batch 1.',
  },
];

export default function BusinessCRMDemoPage() {
  const [selectedLead, setSelectedLead] = useState(SAMPLE_LEADS[0]);
  const [filterStage, setFilterStage] = useState('all');

  const BUSINESS_WA_URL =
    'https://wa.me/6281234567890?text=Halo%20DINAMIS,%20saya%20sudah%20melihat%20Demo%20Business%20CRM%20dan%20ingin%20konsultasi%20kebutuhan%20sales%20bisnis%20saya.';

  const filteredLeads =
    filterStage === 'all'
      ? SAMPLE_LEADS
      : SAMPLE_LEADS.filter((l) => l.stage.toLowerCase() === filterStage.toLowerCase());

  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      <Navbar />

      {/* Demo Header */}
      <section className="pt-36 pb-12 sm:pt-44 sm:pb-16 bg-white border-b border-[#E2EAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Link
                  href="/crm"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#64756D] hover:text-[#0B3D2E] transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Katalog CRM</span>
                </Link>
                <span className="text-[#D1DDD6]">/</span>
                <span className="text-xs font-semibold text-[#16A36A]">Business CRM</span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B3D2E] tracking-tight">
                  Demo Interaktif Business CRM
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#0B3D2E] text-white tracking-wide uppercase shadow-xs">
                  DEMO
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#64756D] max-w-2xl">
                Pratinjau antarmuka database lead, timeline follow-up, dan pipeline deals dalam mode terisolasi tanpa backend database.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={BUSINESS_WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
              >
                <span>Konsultasikan via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/crm/business"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-[#E2EAE5] text-[#10231B] font-semibold text-sm hover:bg-[#F7FAF8] transition"
              >
                <span>Fitur Business CRM</span>
              </Link>
            </div>
          </div>

          {/* Safety & Isolation Notice */}
          <div className="mt-8 p-4 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#0B3D2E]">
              <ShieldAlert className="w-4 h-4 text-[#16A36A] shrink-0" />
              <span>
                <strong>Mode Demo Stateless:</strong> Berjalan mandiri tanpa database production untuk melihat alur penanganan customer bisnis.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setSelectedLead(SAMPLE_LEADS[0]);
                  setFilterStage('all');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D1DDD6] text-[#0B3D2E] font-bold hover:bg-[#F7FAF8] transition text-xs shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Reset Demo</span>
              </button>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#16A36A] border border-[#D1DDD6]">
                Sandbox Preview
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Workspace */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Leads Pipeline List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2EAE5]">
              <h2 className="text-sm font-bold text-[#0B3D2E] uppercase tracking-wider">
                Pipeline Lead & Customer
              </h2>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setFilterStage('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    filterStage === 'all'
                      ? 'bg-[#0B3D2E] text-white'
                      : 'bg-white border border-[#E2EAE5] text-[#64756D]'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterStage('follow-up')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    filterStage === 'follow-up'
                      ? 'bg-[#0B3D2E] text-white'
                      : 'bg-white border border-[#E2EAE5] text-[#64756D]'
                  }`}
                >
                  Follow-up
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredLeads.map((lead) => {
                const isSelected = lead.id === selectedLead.id;
                return (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`w-full text-left p-4 rounded-2xl transition border ${
                      isSelected
                        ? 'bg-white border-[#16A36A] shadow-md ring-2 ring-[#EAF8F1]'
                        : 'bg-white/80 border-[#E2EAE5] hover:bg-white hover:border-[#D1DDD6]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A]">
                        {lead.stage}
                      </span>
                      <span className="font-bold text-[#0B3D2E]">{lead.dealValue}</span>
                    </div>
                    <h3 className="font-bold text-[#10231B] text-sm">{lead.name}</h3>
                    <p className="text-xs text-[#64756D] mt-0.5">{lead.company}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Lead Detail Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2EAE5]">
                <div>
                  <h3 className="text-xl font-bold text-[#0B3D2E]">{selectedLead.name}</h3>
                  <p className="text-xs text-[#64756D] mt-0.5">{selectedLead.company}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF8F1] text-[#16A36A]">
                  Tahap: {selectedLead.stage}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-1">
                  <div className="text-xs text-[#64756D] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>Kontak WhatsApp</span>
                  </div>
                  <div className="text-sm font-bold text-[#10231B]">{selectedLead.phone}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-1">
                  <div className="text-xs text-[#64756D] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>Terakhir Dihubungi</span>
                  </div>
                  <div className="text-sm font-bold text-[#10231B]">{selectedLead.lastContact}</div>
                </div>
              </div>

              {/* Next Action Box */}
              <div className="p-4 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6] space-y-1.5">
                <div className="text-xs font-bold text-[#0B3D2E] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#16A36A]" />
                  <span>Jadwal Tindak Lanjut Berikutnya:</span>
                </div>
                <p className="text-xs font-semibold text-[#10231B]">{selectedLead.nextAction}</p>
              </div>

              {/* Notes */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-[#0B3D2E]">Catatan Percakapan:</div>
                <div className="p-3.5 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] text-[#64756D] leading-relaxed">
                  &ldquo;{selectedLead.notes}&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 bg-[#0B3D2E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Kelola Customer Bisnis Anda dengan Business CRM
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base">
            Konsultasikan alur penjualan dan implementasi sistem Anda bersama tim solusi DINAMIS.
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
              href="/crm"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition"
            >
              <span>Kembali ke Katalog CRM</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
