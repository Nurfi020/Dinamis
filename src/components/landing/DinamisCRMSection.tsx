'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ChevronRight, MessageSquare, ShieldCheck } from 'lucide-react';

export const DinamisCRMSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'followup' | 'reporting'>('pipeline');

  const features = [
    'Lead Management',
    'Customer Management',
    'Sales Pipeline',
    'Follow-up Tracker',
    'Activity Tracking',
    'Reporting & Laporan',
  ];

  return (
    <section id="crm" className="py-24 sm:py-32 bg-[#EAF8F1] text-[#10231B] border-y border-[#D1DDD6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headline, Outcome Focus, Compact List, CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#D1DDD6] text-[#0B3D2E] text-xs font-bold shadow-2xs">
              <span>CORE PRODUCT — CRM</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.15]">
              Kelola Customer Tanpa Ribet.
            </h2>

            <p className="text-base sm:text-lg text-[#64756D] leading-relaxed">
              Dari lead masuk sampai customer ditangani dalam satu alur kerja yang lebih terstruktur — tanpa menambah beban administrasi manual yang tidak perlu.
            </p>

            {/* Compact Feature List */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-1">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-[#10231B]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/crm/contractor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
              >
                <span>Lihat Contractor CRM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/crm"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-[#D1DDD6] text-[#10231B] font-semibold text-sm hover:bg-[#F7FAF8] transition"
              >
                <span>Lihat Semua CRM</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Browser/Product Frame */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-[#D1DDD6] p-5 sm:p-6 shadow-sm space-y-4">
              {/* Frame Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
                <div className="flex items-center gap-1.5 p-1 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5]">
                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'pipeline'
                        ? 'bg-[#0B3D2E] text-white shadow-xs'
                        : 'text-[#64756D] hover:text-[#0B3D2E]'
                    }`}
                  >
                    Pipeline Sales
                  </button>
                  <button
                    onClick={() => setActiveTab('followup')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'followup'
                        ? 'bg-[#0B3D2E] text-white shadow-xs'
                        : 'text-[#64756D] hover:text-[#0B3D2E]'
                    }`}
                  >
                    Follow-up
                  </button>
                  <button
                    onClick={() => setActiveTab('reporting')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'reporting'
                        ? 'bg-[#0B3D2E] text-white shadow-xs'
                        : 'text-[#64756D] hover:text-[#0B3D2E]'
                    }`}
                  >
                    Laporan
                  </button>
                </div>

                <span className="text-[11px] font-mono text-[#16A36A] font-bold hidden sm:inline">
                  ● DinamisCRM Workspace
                </span>
              </div>

              {/* Tab 1: Pipeline */}
              {activeTab === 'pipeline' && (
                <div className="space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs text-[#64756D]">
                    <span className="font-bold text-[#10231B]">Alur Deals Berjalan</span>
                    <span>Total Deal: Rp 1,93 M</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#10231B]">Renovasi Ruko Senayan</div>
                        <div className="text-[#64756D] text-[11px]">Pak Hendra • Rp 450.000.000</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A]">
                        Survei Lokasi
                      </span>
                    </div>

                    <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#10231B]">Fit-out Kafe BSD</div>
                        <div className="text-[#64756D] text-[11px]">PT Artha • Rp 280.000.000</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A]">
                        Penyusunan RAB
                      </span>
                    </div>

                    <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#10231B]">Pembangunan Cluster Villa</div>
                        <div className="text-[#64756D] text-[11px]">Bpk. Gunawan • Rp 1.200.000.000</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0B3D2E] text-white">
                        SPK Ditandatangani
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Follow-up */}
              {activeTab === 'followup' && (
                <div className="space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs text-[#64756D]">
                    <span className="font-bold text-[#10231B]">Reminder Kontak Hari Ini</span>
                    <span className="text-[#16A36A] font-bold">2 Menunggu</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-[#16A36A]" />
                        <div>
                          <div className="font-bold text-[#10231B]">Kirim RAB Revisi Proyek Kafe</div>
                          <div className="text-[#64756D] text-[11px]">Bpk. Doni • WhatsApp 14:00 WIB</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF8F1] text-[#0B3D2E]">
                        Hari Ini
                      </span>
                    </div>

                    <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-[#16A36A]" />
                        <div>
                          <div className="font-bold text-[#10231B]">Konfirmasi Jadwal Pengukuran</div>
                          <div className="text-[#64756D] text-[11px]">Ibu Rina • WhatsApp 16:30 WIB</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF8F1] text-[#0B3D2E]">
                        Hari Ini
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Reporting */}
              {activeTab === 'reporting' && (
                <div className="space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs text-[#64756D]">
                    <span className="font-bold text-[#10231B]">Metrik Konversi</span>
                    <span className="text-[#16A36A]">Bulan Berjalan</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5]">
                      <div className="text-[#64756D] text-[11px]">Rasio Closing Deals</div>
                      <div className="text-xl font-extrabold text-[#0B3D2E] mt-1">38.4%</div>
                      <div className="text-[10px] text-[#16A36A] mt-0.5">+5.2% vs target</div>
                    </div>
                    <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E2EAE5]">
                      <div className="text-[#64756D] text-[11px]">Rata-rata Nilai Kontrak</div>
                      <div className="text-xl font-extrabold text-[#0B3D2E] mt-1">Rp 415 Jt</div>
                      <div className="text-[10px] text-[#64756D] mt-0.5">Berdasarkan 12 transaksi</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Frame Footer */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#64756D] border-t border-[#E2EAE5]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
                  Akses role-based & audit log
                </span>
                <Link href="/crm/contractor" className="text-[#16A36A] hover:text-[#0B3D2E] font-bold flex items-center gap-0.5">
                  Pelajari Contractor CRM <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
