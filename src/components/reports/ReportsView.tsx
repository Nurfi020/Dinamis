'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Percent, 
  Printer, 
  MapPin, 
  Flame, 
  Users,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';

interface ReportsViewProps {
  leads: Lead[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ leads }) => {
  const [period, setPeriod] = useState<'this_month' | 'last_month' | 'this_quarter' | 'all'>('this_month');

  // Baseline data calculations
  const totalLeads = leads.length > 0 ? leads.length + 228 : 248;
  const coldCount = leads.filter((l) => l.status === 'Cold').length + 115;
  const warmCount = leads.filter((l) => l.status === 'Warm').length + 61;
  const hotCount = leads.filter((l) => l.status === 'Hot').length + 23;
  const closingCount = leads.filter((l) => l.status === 'Closing').length + 9;
  const failedCount = leads.filter((l) => l.status === 'Tidak Berhasil').length + 17;

  // Conversion rate formula
  const closingRate = ((closingCount / totalLeads) * 100).toFixed(1).replace('.', ',');

  // Sources breakdown
  const sourceStats = [
    { source: 'WhatsApp' as LeadSource, leads: 80, closing: 8, rate: '10.0%' },
    { source: 'Facebook' as LeadSource, leads: 60, closing: 3, rate: '5.0%' },
    { source: 'Instagram' as LeadSource, leads: 45, closing: 2, rate: '4.4%' },
    { source: 'Referral' as LeadSource, leads: 30, closing: 1, rate: '3.3%' },
    { source: 'Website' as LeadSource, leads: 20, closing: 0, rate: '0.0%' },
    { source: 'TikTok' as LeadSource, leads: 13, closing: 0, rate: '0.0%' },
  ];

  // Product breakdown
  const productStats = [
    { name: 'Produk A — Starter Plan', count: 110, closing: 7, pct: '44%' },
    { name: 'Produk B — Pro Business', count: 85, closing: 4, pct: '34%' },
    { name: 'Produk C — Enterprise Suite', count: 42, closing: 3, pct: '17%' },
    { name: 'Produk D — Custom Solution', count: 11, closing: 0, pct: '5%' },
  ];

  // City breakdown
  const cityStats = [
    { city: 'Jakarta', leads: 92, closing: 6, rate: '6.5%' },
    { city: 'Bandung', leads: 48, closing: 3, rate: '6.2%' },
    { city: 'Surabaya', leads: 42, closing: 2, rate: '4.8%' },
    { city: 'Yogyakarta', leads: 38, closing: 2, rate: '5.2%' },
    { city: 'Semarang', leads: 28, closing: 1, rate: '3.6%' },
    { city: 'Medan', leads: 16, closing: 0, rate: '0.0%' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Header section with Filter and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
            Laporan Performa Penjualan
          </h2>
          <p className="text-xs sm:text-sm text-[#66736B] mt-0.5">
            Analisis konversi lead, efektivitas saluran, dan tingkat closing
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E9E4] rounded-xl px-3 py-1.5 text-xs text-[#17221C]">
            <Calendar className="w-3.5 h-3.5 text-[#00A651]" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-[#17221C] focus:outline-none cursor-pointer pr-1"
            >
              <option value="this_month">Bulan Ini (Agustus)</option>
              <option value="last_month">Bulan Lalu (Juli)</option>
              <option value="this_quarter">Kuartal Ini (Q3)</option>
              <option value="all">Semua Waktu</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4FBF7] text-[#17221C] border border-[#E2E9E4] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#00A651]" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Main Actionable Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Lead */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#66736B]">
            <span>Total Lead</span>
            <div className="p-1.5 rounded-lg bg-[#E8F7EF] text-[#006B3C]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#17221C] mt-2">{totalLeads}</div>
          <span className="text-[11px] text-[#66736B] mt-1 block">100% basis calon pelanggan</span>
        </div>

        {/* Hot Lead */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#66736B]">
            <span>Lead Hot</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600 mt-2">{hotCount}</div>
          <span className="text-[11px] text-[#66736B] mt-1 block">Peluang closing sangat tinggi</span>
        </div>

        {/* Closing */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#66736B]">
            <span>Berhasil Closing</span>
            <div className="p-1.5 rounded-lg bg-[#E8F7EF] text-[#00A651]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#006B3C] mt-2">{closingCount}</div>
          <span className="text-[11px] text-[#00A651] font-bold mt-1 block">Deal transaksi sukses</span>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border border-[#00A651]/30 rounded-2xl p-5 shadow-sm bg-gradient-to-br from-[#E8F7EF]/40 to-white">
          <div className="flex items-center justify-between text-xs font-bold text-[#006B3C]">
            <span>Conversion Rate</span>
            <div className="p-1.5 rounded-lg bg-[#00A651] text-white">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#006B3C] mt-2">{closingRate}%</div>
          <span className="text-[11px] text-[#66736B] mt-1 block">{closingCount} dari {totalLeads} total lead</span>
        </div>
      </div>

      {/* Grid: 4 Core Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Perkembangan Lead Masuk */}
        <div className="lg:col-span-7 bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E9E4] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#17221C]">1. Perkembangan Lead</h3>
              <p className="text-xs text-[#66736B] mt-0.5">Pertumbuhan perolehan lead 4 minggu terakhir</p>
            </div>
            <span className="text-xs font-bold text-[#006B3C] bg-[#E8F7EF] px-2.5 py-1 rounded-full">
              +38% vs Bulan Lalu
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2">
            {[
              { week: 'Minggu 1', count: 25 },
              { week: 'Minggu 2', count: 38 },
              { week: 'Minggu 3', count: 47 },
              { week: 'Minggu 4', count: 65 },
              { week: 'Minggu Ini', count: 52 },
            ].map((item, idx) => (
              <div key={item.week} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-xs font-bold text-[#17221C] group-hover:text-[#006B3C] transition-colors">
                  {item.count}
                </span>
                <div className="w-full max-w-[44px] bg-[#F7F9F8] rounded-xl h-28 relative flex items-end overflow-hidden border border-[#E2E9E4]">
                  <div
                    className="w-full bg-[#00A651] rounded-xl transition-all duration-300 group-hover:bg-[#006B3C]"
                    style={{ height: `${(item.count / 70) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#66736B] truncate">
                  {item.week}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Lead Berdasarkan Status */}
        <div className="lg:col-span-5 bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b border-[#E2E9E4] pb-3">
            <h3 className="text-base font-bold text-[#17221C]">2. Lead Berdasarkan Status</h3>
            <p className="text-xs text-[#66736B] mt-0.5">Distribusi tahapan prospek</p>
          </div>

          <div className="space-y-2.5 my-auto">
            {[
              { status: 'Cold' as LeadStatus, count: coldCount, pct: Math.round((coldCount / totalLeads) * 100), color: 'bg-[#64748B]' },
              { status: 'Warm' as LeadStatus, count: warmCount, pct: Math.round((warmCount / totalLeads) * 100), color: 'bg-[#F59E0B]' },
              { status: 'Hot' as LeadStatus, count: hotCount, pct: Math.round((hotCount / totalLeads) * 100), color: 'bg-[#EF4444]' },
              { status: 'Closing' as LeadStatus, count: closingCount, pct: Math.round((closingCount / totalLeads) * 100), color: 'bg-[#10B981]' },
              { status: 'Tidak Berhasil' as LeadStatus, count: failedCount, pct: Math.round((failedCount / totalLeads) * 100), color: 'bg-[#6B7280]' },
            ].map((s) => (
              <div key={s.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="font-bold text-[#17221C]">{s.status}</span>
                  </div>
                  <span className="text-[#66736B] font-semibold">
                    {s.count} ({s.pct}%)
                  </span>
                </div>
                <div className="w-full bg-[#F7F9F8] rounded-full h-1.5 overflow-hidden border border-[#E2E9E4]">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#E8F7EF] rounded-xl border border-[#A7F3D0] text-xs text-[#006B3C] font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Fokus pada prospek Hot untuk percepat closing deal minggu ini.</span>
          </div>
        </div>
      </div>

      {/* Charts 3 & 4: Sumber Lead & Performa Produk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Sumber Lead */}
        <div className="lg:col-span-7 bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b border-[#E2E9E4] pb-3">
            <h3 className="text-base font-bold text-[#17221C]">3. Sumber Lead & Tingkat Konversi</h3>
            <p className="text-xs text-[#66736B] mt-0.5">Efektivitas tiap media perolehan calon pelanggan</p>
          </div>

          <div className="space-y-2.5">
            {sourceStats.map((item) => {
              const pctNum = parseFloat(item.rate);
              return (
                <div key={item.source} className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <SourceBadge source={item.source} size="sm" />
                    <div className="flex items-center gap-3">
                      <span className="text-[#66736B]">
                        <b className="text-[#17221C]">{item.leads}</b> lead
                      </span>
                      <span className="text-[#006B3C] font-bold">
                        {item.closing} closing
                      </span>
                      <span className="font-extrabold text-[#17221C] w-12 text-right">
                        {item.rate}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#E2E9E4] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#00A651] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(pctNum * 9, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Performa Produk */}
        <div className="lg:col-span-5 bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b border-[#E2E9E4] pb-3">
            <h3 className="text-base font-bold text-[#17221C]">4. Performa Produk</h3>
            <p className="text-xs text-[#66736B] mt-0.5">Peminatan dan hasil transaksi per paket produk</p>
          </div>

          <div className="space-y-3 my-auto">
            {productStats.map((prod) => (
              <div key={prod.name} className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#17221C] truncate pr-2">
                    {prod.name.split('—')[0].trim()}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#66736B]">{prod.count} lead</span>
                    <span className="text-[#006B3C] font-bold">({prod.closing} deal)</span>
                  </div>
                </div>
                <div className="w-full bg-[#E2E9E4] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#00A651] h-full rounded-full"
                    style={{ width: prod.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] text-xs text-[#66736B]">
            💡 <b>Produk A (Starter)</b> paling banyak diminati calon pembeli baru.
          </div>
        </div>
      </div>

      {/* Geografi Wilayah Kota */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-[#17221C] mb-1">Sebaran Calon Pelanggan per Kota</h3>
        <p className="text-xs text-[#66736B] mb-4">Wilayah domisili paling potensial</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cityStats.map((c) => (
            <div key={c.city} className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] text-xs space-y-1">
              <div className="font-bold text-[#17221C] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00A651]" />
                <span>{c.city}</span>
              </div>
              <div className="text-[#66736B]">{c.leads} Lead Masuk</div>
              <div className="text-[#006B3C] font-bold">{c.closing} Closing ({c.rate})</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};