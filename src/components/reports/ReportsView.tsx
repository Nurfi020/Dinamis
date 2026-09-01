'use client';

import React, { useState, useMemo } from 'react';
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
  Download,
  Wallet
} from 'lucide-react';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { CITIES_LIST, PRODUCTS_LIST } from '../../data/mockData';
import { formatRupiah } from '../../utils/helpers';

interface ReportsViewProps {
  leads: Lead[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ leads }) => {
  const [period, setPeriod] = useState<'this_month' | 'last_month' | 'this_quarter' | 'all'>('all');

  // Filter leads based on selected period
  const filteredLeads = useMemo(() => {
    if (period === 'all') return leads;

    const now = new Date();
    return leads.filter((l) => {
      const createdAt = new Date(l.createdAt);
      if (period === 'this_month') {
        return (
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear()
        );
      }
      if (period === 'last_month') {
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return (
          createdAt.getMonth() === lastMonth &&
          createdAt.getFullYear() === year
        );
      }
      if (period === 'this_quarter') {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const leadQuarter = Math.floor(createdAt.getMonth() / 3);
        return (
          leadQuarter === currentQuarter &&
          createdAt.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  }, [leads, period]);

  // Baseline data calculations
  const totalLeads = filteredLeads.length;
  const coldCount = useMemo(() => filteredLeads.filter((l) => l.status === 'Cold').length, [filteredLeads]);
  const warmCount = useMemo(() => filteredLeads.filter((l) => l.status === 'Warm').length, [filteredLeads]);
  const hotCount = useMemo(() => filteredLeads.filter((l) => l.status === 'Hot').length, [filteredLeads]);
  const closingCount = useMemo(() => filteredLeads.filter((l) => l.status === 'Closing').length, [filteredLeads]);
  const failedCount = useMemo(() => filteredLeads.filter((l) => l.status === 'Tidak Berhasil').length, [filteredLeads]);

  // Revenue calculations
  const totalPipelineRevenue = useMemo(() => {
    return filteredLeads
      .filter((l) => l.status === 'Cold' || l.status === 'Warm' || l.status === 'Hot')
      .reduce((sum, l) => sum + (l.value || 0), 0);
  }, [filteredLeads]);

  const totalClosingRevenue = useMemo(() => {
    return filteredLeads
      .filter((l) => l.status === 'Closing')
      .reduce((sum, l) => sum + (l.value || 0), 0);
  }, [filteredLeads]);

  // Conversion rate formula
  const closingRateNum = totalLeads > 0 ? (closingCount / totalLeads) * 100 : 0;
  const closingRate = closingRateNum.toFixed(1).replace('.', ',');

  // Sources breakdown
  const sourceStats = useMemo(() => {
    const sources: LeadSource[] = ['WhatsApp', 'Instagram', 'Facebook', 'Website', 'Referral', 'TikTok', 'Lainnya'];
    return sources
      .map((s) => {
        const sLeads = filteredLeads.filter((l) => l.source === s);
        const sClosing = sLeads.filter((l) => l.status === 'Closing').length;
        const rate = sLeads.length > 0 ? (sClosing / sLeads.length) * 100 : 0;
        return {
          source: s,
          leads: sLeads.length,
          closing: sClosing,
          rate: `${rate.toFixed(1).replace('.', ',')}%`,
        };
      })
      .sort((a, b) => b.leads - a.leads);
  }, [filteredLeads]);

  // Product breakdown
  const productStats = useMemo(() => {
    return PRODUCTS_LIST.map((prod) => {
      const pLeads = filteredLeads.filter((l) => l.product.startsWith(prod.split('—')[0].trim()));
      const pClosing = pLeads.filter((l) => l.status === 'Closing').length;
      const pct = totalLeads > 0 ? Math.round((pLeads.length / totalLeads) * 100) : 0;
      return {
        name: prod,
        count: pLeads.length,
        closing: pClosing,
        pct: `${pct}%`,
      };
    }).sort((a, b) => b.count - a.count);
  }, [filteredLeads, totalLeads]);

  // City breakdown
  const cityStats = useMemo(() => {
    const activeCities = Array.from(new Set(filteredLeads.map((l) => l.city)));
    const allCitiesToUse = activeCities.length > 0 ? activeCities : CITIES_LIST.slice(0, 6);

    return allCitiesToUse
      .map((cityName) => {
        const cLeads = filteredLeads.filter((l) => l.city === cityName);
        const cClosing = cLeads.filter((l) => l.status === 'Closing').length;
        const rate = cLeads.length > 0 ? (cClosing / cLeads.length) * 100 : 0;
        return {
          city: cityName,
          leads: cLeads.length,
          closing: cClosing,
          rate: `${rate.toFixed(1).replace('.', ',')}%`,
        };
      })
      .sort((a, b) => b.leads - a.leads);
  }, [filteredLeads]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert('Tidak ada data lead untuk diekspor.');
      return;
    }

    const headers = ['ID', 'Nama', 'Nilai Deal (Rp)', 'Nomor WA', 'Kota', 'Sumber', 'Produk', 'Status', 'Catatan', 'Tanggal Dibuat', 'Follow Up Terakhir', 'Jadwal Berikutnya'];
    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.value || 0}"`,
      `"${l.phone}"`,
      `"${l.city}"`,
      `"${l.source}"`,
      `"${l.product.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.initialNotes || '').replace(/"/g, '""')}"`,
      `"${l.createdAt}"`,
      `"${l.lastFollowUpDate || '-'}"`,
      `"${l.nextFollowUpDate ? `${l.nextFollowUpDate} ${l.nextFollowUpTime || ''}` : '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_lead_sales_${period}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E9E4] rounded-xl px-3 py-1.5 text-xs text-[#17221C]">
            <Calendar className="w-3.5 h-3.5 text-[#00A651]" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-[#17221C] focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">Semua Waktu</option>
              <option value="this_month">Bulan Ini</option>
              <option value="last_month">Bulan Lalu</option>
              <option value="this_quarter">Kuartal Ini</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4FBF7] text-[#006B3C] border border-[#A7F3D0] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

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

      {/* REVENUE HIGHLIGHT BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-white to-[#F0FDF4] border border-[#A7F3D0] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#66736B] uppercase tracking-wider block">Potensi Pipeline Periode Ini</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#17221C] mt-1 block font-mono">
              {formatRupiah(totalPipelineRevenue)}
            </span>
            <span className="text-[11px] text-[#006B3C] font-semibold mt-0.5 block">{coldCount + warmCount + hotCount} Prospek Aktif</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F7EF] border border-[#A7F3D0] flex items-center justify-center text-[#006B3C]">
            <TrendingUp className="w-6 h-6 text-[#00A651]" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-[#E8F7EF] border border-[#00A651]/40 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#66736B] uppercase tracking-wider block">Realisasi Closing Periode Ini</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#006B3C] mt-1 block font-mono">
              {formatRupiah(totalClosingRevenue)}
            </span>
            <span className="text-[11px] text-[#006B3C] font-semibold mt-0.5 block">{closingCount} Transaksi Sukses ({closingRate}%)</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#00A651] flex items-center justify-center text-white shadow-xs">
            <Wallet className="w-6 h-6" />
          </div>
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
          <div className="text-[11px] text-[#66736B] mt-1 font-medium">Periode {period}</div>
        </div>

        {/* Lead Closing */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#66736B]">
            <span>Deal Closing</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#006B3C] mt-2">{closingCount}</div>
          <div className="text-[11px] text-[#006B3C] mt-1 font-bold">Tingkat Closing: {closingRate}%</div>
        </div>

        {/* Lead Hot */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#66736B]">
            <span>Prospek Hot</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#17221C] mt-2">{hotCount}</div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">Peluang closing tertinggi</div>
        </div>

        {/* Lead Warm */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#66736B]">
            <span>Prospek Warm</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#17221C] mt-2">{warmCount}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">Tahap pertimbangan</div>
        </div>
      </div>

      {/* Middle Grid: Breakdown Saluran & Breakdown Produk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Breakdown Sumber Saluran */}
        <div className="lg:col-span-6 bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#E2E9E4] pb-3">
            <h3 className="text-base font-bold text-[#17221C] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00A651]" />
              <span>Efektivitas Sumber Lead</span>
            </h3>
            <span className="text-xs text-[#66736B]">{sourceStats.filter((s) => s.leads > 0).length} Saluran Aktif</span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-12 text-[11px] font-bold text-[#66736B] pb-1 border-b border-[#E2E9E4]">
              <span className="col-span-5">Saluran</span>
              <span className="col-span-2 text-center">Lead</span>
              <span className="col-span-2 text-center">Closing</span>
              <span className="col-span-3 text-right">Konversi</span>
            </div>

            {sourceStats.map((item) => (
              <div
                key={item.source}
                className="grid grid-cols-12 items-center py-1.5 text-xs hover:bg-[#F4FBF7] rounded-xl px-1 transition-colors"
              >
                <div className="col-span-5 flex items-center gap-2">
                  <SourceBadge source={item.source} size="sm" showText={true} />
                </div>
                <div className="col-span-2 text-center font-semibold text-[#17221C]">
                  {item.leads}
                </div>
                <div className="col-span-2 text-center font-bold text-[#006B3C]">
                  {item.closing}
                </div>
                <div className="col-span-3 text-right font-bold text-[#17221C]">
                  {item.rate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Produk */}
        <div className="lg:col-span-6 bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#E2E9E4] pb-3">
            <h3 className="text-base font-bold text-[#17221C] flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#00A651]" />
              <span>Peminatan Produk</span>
            </h3>
            <span className="text-xs text-[#66736B]">{PRODUCTS_LIST.length} Produk</span>
          </div>

          <div className="space-y-4">
            {productStats.map((prod) => (
              <div key={prod.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#17221C]">{prod.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#66736B]">{prod.count} Lead</span>
                    <span className="font-bold text-[#006B3C]">({prod.closing} Deal)</span>
                  </div>
                </div>
                <div className="w-full bg-[#F1F5F3] rounded-full h-2.5 overflow-hidden border border-[#E2E9E4]">
                  <div
                    className="bg-[#00A651] h-full rounded-full transition-all duration-300"
                    style={{ width: prod.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Breakdown Kota Domisili */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-[#E2E9E4] pb-3">
          <h3 className="text-base font-bold text-[#17221C] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00A651]" />
            <span>Performa Berdasarkan Kota Domisili</span>
          </h3>
          <span className="text-xs text-[#66736B]">Sebaran Geografis Calon Pelanggan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cityStats.slice(0, 6).map((c) => (
            <div
              key={c.city}
              className="p-3.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-2xl flex items-center justify-between hover:border-[#00A651]/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center font-bold text-xs">
                  {c.city.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#17221C]">{c.city}</h4>
                  <p className="text-[11px] text-[#66736B]">{c.leads} Calon Pelanggan</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#006B3C] block">{c.closing} Closing</span>
                <span className="text-[10px] text-[#66736B]">{c.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};