'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Bell, 
  Flame, 
  CheckCircle2, 
  MessageCircle, 
  ChevronRight, 
  CalendarClock,
  Clock,
  TrendingUp,
  Wallet,
  Sparkles,
  Hammer,
  Store
} from 'lucide-react';
import { Lead, LeadStatus, ActiveTab, LeadSource, DemoIndustry } from '../../types';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { 
  generateWhatsAppUrl, 
  isDateToday, 
  isDateOverdue,
  formatRupiah 
} from '../../utils/helpers';
import { DEMO_INDUSTRIES } from '../../data/contractorDemoData';

interface DashboardViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onFilterByStatus: (status: LeadStatus) => void;
  onFilterFollowUp: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  currentIndustry?: DemoIndustry;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  onSelectLead,
  onFilterByStatus,
  onFilterFollowUp,
  onNavigateToTab,
  onOpenAddLead,
  currentIndustry = 'general',
}) => {
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'daily'>('weekly');
  const isContractor = currentIndustry === 'contractor';
  const isUmkm = currentIndustry === 'umkm';
  const indConfig = DEMO_INDUSTRIES[currentIndustry];

  // Dynamic statistics calculated directly from leads
  const totalLeadsCount = leads.length;
  const hotLeads = useMemo(() => leads.filter((l) => l.status === 'Hot').length, [leads]);
  const warmLeads = useMemo(() => leads.filter((l) => l.status === 'Warm').length, [leads]);
  const coldLeads = useMemo(() => leads.filter((l) => l.status === 'Cold').length, [leads]);
  const closingLeads = useMemo(() => leads.filter((l) => l.status === 'Closing').length, [leads]);
  const lostLeads = useMemo(() => leads.filter((l) => l.status === 'Tidak Berhasil').length, [leads]);

  // Total Pipeline Value (Active Leads: Cold + Warm + Hot)
  const totalPipelineRevenue = useMemo(() => {
    return leads
      .filter((l) => l.status === 'Cold' || l.status === 'Warm' || l.status === 'Hot')
      .reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [leads]);

  // Total Realized Closing Revenue
  const totalClosingRevenue = useMemo(() => {
    return leads
      .filter((l) => l.status === 'Closing')
      .reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [leads]);

  // Follow-ups requiring action (Active leads only)
  const activeFollowUps = useMemo(() => {
    return leads.filter(
      (l) => l.nextFollowUpDate && l.status !== 'Closing' && l.status !== 'Tidak Berhasil'
    );
  }, [leads]);

  const followUpCount = activeFollowUps.length;

  // Leads that need follow up TODAY
  const todayFollowUps = useMemo(() => {
    return activeFollowUps.filter((l) => isDateToday(l.nextFollowUpDate));
  }, [activeFollowUps]);

  // Overdue follow-ups
  const overdueFollowUps = useMemo(() => {
    return activeFollowUps.filter((l) => isDateOverdue(l.nextFollowUpDate));
  }, [activeFollowUps]);

  // Top urgent follow-ups (overdue first, then today)
  const displayTodayFollowUps = useMemo(() => {
    const combined = [...overdueFollowUps, ...todayFollowUps];
    return combined.slice(0, 3);
  }, [overdueFollowUps, todayFollowUps]);

  // New leads in last 7 days
  const newLeadsCount = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return leads.filter((l) => new Date(l.createdAt) >= sevenDaysAgo).length;
  }, [leads]);

  // Pipeline distribution percentages
  const statusDistribution = useMemo(() => {
    const total = totalLeadsCount || 1;
    return [
      { 
        status: isContractor 
          ? 'Konsultasi Awal (Cold)' 
          : isUmkm 
          ? 'Prospek Baru (Cold)' 
          : 'Cold', 
        rawStatus: 'Cold' as LeadStatus,
        count: coldLeads, 
        pct: `${Math.round((coldLeads / total) * 100)}%`, 
        color: '#64748B' 
      },
      { 
        status: isContractor 
          ? 'Survey & RAB (Warm)' 
          : isUmkm 
          ? 'Dihubungi & Berminat (Warm)' 
          : 'Warm', 
        rawStatus: 'Warm' as LeadStatus,
        count: warmLeads, 
        pct: `${Math.round((warmLeads / total) * 100)}%`, 
        color: '#F59E0B' 
      },
      { 
        status: isContractor 
          ? 'Negosiasi SPK (Hot)' 
          : isUmkm 
          ? 'Penawaran & Promo (Hot)' 
          : 'Hot', 
        rawStatus: 'Hot' as LeadStatus,
        count: hotLeads, 
        pct: `${Math.round((hotLeads / total) * 100)}%`, 
        color: '#E11D48' 
      },
      { 
        status: isContractor 
          ? 'SPK Signed (Deal)' 
          : isUmkm 
          ? 'Penjualan Berhasil (Deal)' 
          : 'Closing', 
        rawStatus: 'Closing' as LeadStatus,
        count: closingLeads, 
        pct: `${Math.round((closingLeads / total) * 100)}%`, 
        color: '#059669' 
      },
      { 
        status: isContractor 
          ? 'Proyek Batal / Hold' 
          : isUmkm 
          ? 'Batal / Belum Sesuai' 
          : 'Tidak Berhasil', 
        rawStatus: 'Tidak Berhasil' as LeadStatus,
        count: lostLeads, 
        pct: `${Math.round((lostLeads / total) * 100)}%`, 
        color: '#94A3B8' 
      },
    ];
  }, [totalLeadsCount, coldLeads, warmLeads, hotLeads, closingLeads, lostLeads, isContractor, isUmkm]);

  // Weekly lead growth simulation (last 4 weeks)
  const weeklyData = [
    { label: 'Minggu 1', value: Math.max(1, Math.round(totalLeadsCount * 0.15)) },
    { label: 'Minggu 2', value: Math.max(2, Math.round(totalLeadsCount * 0.25)) },
    { label: 'Minggu 3', value: Math.max(2, Math.round(totalLeadsCount * 0.35)) },
    { label: 'Minggu 4 (Kini)', value: Math.max(3, Math.round(totalLeadsCount * 0.25)) },
  ];

  // Daily lead acquisition (last 7 days)
  const dailyData = [
    { label: 'Sen', value: 2 },
    { label: 'Sel', value: 4 },
    { label: 'Rab', value: 3 },
    { label: 'Kam', value: 5 },
    { label: 'Jum', value: 6 },
    { label: 'Sab', value: 2 },
    { label: 'Min', value: 1 },
  ];

  const activeChartData = chartPeriod === 'weekly' ? weeklyData : dailyData;
  const maxChartValue = Math.max(...activeChartData.map((d) => d.value), 5);

  // Best acquisition channels
  const bestSources = useMemo(() => {
    const sources: LeadSource[] = ['WhatsApp', 'Instagram', 'Facebook', 'Website', 'Referral', 'TikTok', 'Marketplace'];
    return sources.map((src) => {
      const srcLeads = leads.filter((l) => l.source === src);
      const srcClosings = srcLeads.filter((l) => l.status === 'Closing').length;
      const count = srcLeads.length;
      const rate = count > 0 ? Math.round((srcClosings / count) * 100) : 0;
      return {
        source: src,
        leads: count,
        closing: srcClosings,
        rate: `${rate}%`,
      };
    }).sort((a, b) => b.leads - a.leads);
  }, [leads]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Greeting & Industry Tag */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isContractor 
                ? 'Selamat datang di CRM Kontraktor 👋' 
                : isUmkm
                ? 'Selamat datang di CRM Usaha & UMKM 👋'
                : 'Selamat datang 👋'}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
              isContractor 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : isUmkm
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {isContractor ? (
                <Hammer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              ) : isUmkm ? (
                <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
              {isContractor 
                ? 'Mode Kontraktor • Prospek Proyek' 
                : isUmkm
                ? 'Mode UMKM • Calon Pelanggan'
                : 'Demo Produk • Data Simulasi'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isContractor 
              ? 'Pantau pipeline survey, estimasi RAB, dan percepat penandatanganan SPK proyek Anda hari ini.'
              : isUmkm
              ? 'Pantau prospek pelanggan, percepat follow-up WhatsApp, dan capai target omset penjualan Anda hari ini.'
              : 'Pantau pertumbuhan prospek dan percepat follow up sales Anda hari ini.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenAddLead}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer ${
              isContractor ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <span>
              {isContractor 
                ? '+ Tambah Proyek' 
                : isUmkm 
                ? '+ Tambah Pelanggan' 
                : '+ Tambah Lead'}
            </span>
          </button>
        </div>
      </div>

      {/* HIGHLIGHT REVENUE & PIPELINE VALUE CARDS (Calm SaaS Cards, No Loud Gradients) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Total Potensi Pipeline */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {isContractor 
                    ? 'Total Pipeline Nilai Kontrak Proyek' 
                    : isUmkm
                    ? 'Total Potensi Pipeline Penjualan'
                    : 'Total Potensi Pipeline'}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {isContractor 
                    ? 'Estimasi Nilai RAB Proyek Aktif' 
                    : isUmkm
                    ? 'Estimasi Omset Prospek Aktif'
                    : 'Prospek Aktif (Cold + Warm + Hot)'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {coldLeads + warmLeads + hotLeads} {isContractor ? 'Proyek' : isUmkm ? 'Pelanggan' : 'Lead'}
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-slate-100">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {formatRupiah(totalPipelineRevenue)}
            </h3>
            <span className="text-xs font-medium text-slate-500">
              {isContractor 
                ? 'Estimasi Kontrak' 
                : isUmkm
                ? 'Potensi Omset'
                : 'Estimasi Nilai Deal'}
            </span>
          </div>
        </div>

        {/* Card 2: Total Closing Revenue */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {isContractor 
                    ? 'Realisasi Deal SPK Ditandatangani' 
                    : isUmkm
                    ? 'Total Penjualan Berhasil (Closing)'
                    : 'Total Nilai Closing'}
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  {isContractor 
                    ? 'Kontrak Disepakati & DP Masuk' 
                    : isUmkm
                    ? 'Transaksi Lunas & Order Diproses'
                    : 'Transaksi Berhasil'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {closingLeads} {isContractor ? 'Deal SPK' : isUmkm ? 'Transaksi' : 'Deal'}
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-slate-100">
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-800 tracking-tight font-mono">
              {formatRupiah(totalClosingRevenue)}
            </h3>
            <span className="text-xs font-semibold text-emerald-700">
              {isContractor 
                ? 'Kontrak Terkunci' 
                : isUmkm
                ? 'Omset Masuk'
                : 'Revenue Terkunci'}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title={isContractor ? 'Total Prospek' : isUmkm ? 'Total Pelanggan' : 'Total Lead'}
          value={totalLeadsCount}
          subtitle="Semua waktu"
          icon={isContractor ? Hammer : isUmkm ? Store : Users}
          iconColor={isContractor ? 'text-amber-700' : 'text-slate-700'}
          iconBg={isContractor ? 'bg-amber-50 border border-amber-200' : 'bg-slate-100 border border-slate-200'}
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title={isContractor ? 'Proyek Baru' : isUmkm ? 'Pelanggan Baru' : 'Lead Baru'}
          value={newLeadsCount}
          subtitle="7 hari terakhir"
          icon={UserPlus}
          iconColor="text-sky-700"
          iconBg="bg-sky-50 border border-sky-200"
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title={isContractor ? 'Survey / Follow Up' : 'Perlu Follow Up'}
          value={followUpCount}
          subtitle="Jadwal aktif"
          icon={Bell}
          iconColor="text-amber-700"
          iconBg="bg-amber-50 border border-amber-200"
          onClick={onFilterFollowUp}
        />
        <StatCard
          title={isContractor ? 'Negosiasi SPK' : isUmkm ? 'Prospek Hot' : 'Lead Hot'}
          value={hotLeads}
          subtitle="Peluang tinggi"
          icon={Flame}
          iconColor="text-rose-700"
          iconBg="bg-rose-50 border border-rose-200"
          onClick={() => onFilterByStatus('Hot')}
        />
        <StatCard
          title={isContractor ? 'SPK Signed' : isUmkm ? 'Penjualan Closing' : 'Closing'}
          value={closingLeads}
          subtitle="Deal sukses"
          icon={CheckCircle2}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50 border border-emerald-200"
          onClick={() => onFilterByStatus('Closing')}
        />
      </div>

      {/* MAIN PRIORITY: Follow Up / Survey Hari Ini Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                {isContractor 
                  ? 'Jadwal Survey & Follow Up Prioritas Hari Ini' 
                  : isUmkm
                  ? 'Follow-up Pelanggan Prioritas Hari Ini'
                  : 'Follow Up Prioritas Hari Ini'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isContractor 
                ? 'Calon klien dan jadwal survey site yang memerlukan tindakan hari ini'
                : isUmkm
                ? 'Calon pelanggan potensial yang perlu segera dihubungi via WhatsApp hari ini'
                : 'Calon pelanggan prioritas yang memerlukan tindakan follow up'}
            </p>
          </div>
          <button
            type="button"
            onClick={onFilterFollowUp}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            Lihat Semua Jadwal <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {displayTodayFollowUps.length === 0 ? (
          <div className="py-7 text-center bg-slate-50 rounded-lg border border-slate-200 p-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1.5 opacity-80" />
            <p className="text-xs font-bold text-slate-800">Semua Jadwal Selesai!</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Tidak ada {isContractor ? 'survey atau follow-up' : isUmkm ? 'follow-up pelanggan' : 'lead'} yang mendesak hari ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {displayTodayFollowUps.map((lead) => {
              const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
              const isOverdue = isDateOverdue(lead.nextFollowUpDate);

              return (
                <div
                  key={lead.id}
                  className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between gap-3 ${
                    isOverdue 
                      ? 'bg-rose-50/30 border-rose-200' 
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={lead.status} size="sm" />
                      <span className={`text-[11px] font-semibold px-2 py-0.2 rounded flex items-center gap-1 ${
                        isOverdue 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {isOverdue ? 'Terlambat' : 'Hari Ini'} • {lead.nextFollowUpTime || '10:00'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs hover:text-emerald-700 cursor-pointer transition-colors" onClick={() => onSelectLead(lead)}>
                        {lead.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{lead.product}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/80">
                      <span className="font-medium text-slate-700">{lead.city}</span>
                      <span className="font-bold text-slate-900 font-mono">{formatRupiah(lead.value)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors cursor-pointer active:scale-95"
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Middle Row: Perkembangan Lead & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Perkembangan Lead (Bar Chart) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isContractor 
                  ? 'Perkembangan Prospek Proyek Masuk' 
                  : isUmkm
                  ? 'Perkembangan Calon Pelanggan Baru'
                  : 'Perkembangan Lead Masuk'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tren akuisisi prospek baru ({chartPeriod === 'weekly' ? 'Mingguan' : 'Harian'})
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setChartPeriod('weekly')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  chartPeriod === 'weekly'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mingguan
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('daily')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  chartPeriod === 'daily'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Harian
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-40 flex items-end justify-between gap-3 pt-4 pb-1 px-2">
            {activeChartData.map((item, idx) => {
              const heightPct = Math.max(12, Math.round((item.value / maxChartValue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden max-w-[44px]">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isContractor 
                          ? 'bg-amber-600 group-hover:bg-amber-500' 
                          : 'bg-emerald-600 group-hover:bg-emerald-500'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 text-center truncate w-full">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isContractor 
                  ? 'Distribusi Pipeline Proyek' 
                  : isUmkm
                  ? 'Distribusi Pipeline Penjualan'
                  : 'Distribusi Pipeline'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isContractor 
                  ? 'Tahapan negosiasi SPK proyek saat ini' 
                  : isUmkm
                  ? 'Komposisi tahapan prospek pelanggan saat ini'
                  : 'Komposisi status prospek saat ini'}
              </p>
            </div>
          </div>

          {/* Status Breakdown List */}
          <div className="space-y-2">
            {statusDistribution.map((item) => (
              <div
                key={item.status}
                onClick={() => onFilterByStatus(item.rawStatus)}
                className="p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-800">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{item.count}</span>
                    <span className="text-[11px] text-slate-500 font-mono">({item.pct})</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: item.pct, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Saluran Terbaik & Quick Stats */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {isUmkm ? 'Efektivitas Kanal Pemasaran UMKM' : 'Efektivitas Saluran Pemasaran'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isContractor 
                ? 'Performa closing SPK berdasarkan sumber kontak proyek' 
                : isUmkm
                ? 'Performa konversi penjualan dari media sosial & marketplace'
                : 'Performa konversi berdasarkan sumber lead'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('reports')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            Laporan Lengkap <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {bestSources.map((s) => (
            <div
              key={s.source}
              className="p-3 rounded-lg bg-slate-50/70 border border-slate-200 flex flex-col justify-between gap-1.5"
            >
              <div className="flex items-center justify-between">
                <SourceBadge source={s.source} size="sm" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{s.leads}</p>
                <p className="text-[10px] text-slate-500">{isContractor ? 'Proyek' : isUmkm ? 'Pelanggan' : 'Lead'}</p>
              </div>
              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{isContractor ? 'SPK:' : 'Closing:'}</span>
                <span className="font-bold text-emerald-700">{s.closing} ({s.rate})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};