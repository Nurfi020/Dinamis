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
  HardHat,
  FileSpreadsheet,
  Building
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
        status: isContractor ? 'Konsultasi Awal (Cold)' : 'Cold', 
        rawStatus: 'Cold' as LeadStatus,
        count: coldLeads, 
        pct: `${Math.round((coldLeads / total) * 100)}%`, 
        color: '#64748B' 
      },
      { 
        status: isContractor ? 'Survey & RAB (Warm)' : 'Warm', 
        rawStatus: 'Warm' as LeadStatus,
        count: warmLeads, 
        pct: `${Math.round((warmLeads / total) * 100)}%`, 
        color: '#F59E0B' 
      },
      { 
        status: isContractor ? 'Negosiasi SPK (Hot)' : 'Hot', 
        rawStatus: 'Hot' as LeadStatus,
        count: hotLeads, 
        pct: `${Math.round((hotLeads / total) * 100)}%`, 
        color: '#EF4444' 
      },
      { 
        status: isContractor ? 'SPK Signed (Deal)' : 'Closing', 
        rawStatus: 'Closing' as LeadStatus,
        count: closingLeads, 
        pct: `${Math.round((closingLeads / total) * 100)}%`, 
        color: '#10B981' 
      },
      { 
        status: isContractor ? 'Proyek Batal / Hold' : 'Tidak Berhasil', 
        rawStatus: 'Tidak Berhasil' as LeadStatus,
        count: lostLeads, 
        pct: `${Math.round((lostLeads / total) * 100)}%`, 
        color: '#9CA3AF' 
      },
    ];
  }, [totalLeadsCount, coldLeads, warmLeads, hotLeads, closingLeads, lostLeads, isContractor]);

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
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Greeting & Industry Tag */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
              {isContractor ? 'Selamat datang di CRM Kontraktor 👋' : 'Selamat datang 👋'}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              isContractor ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-[#E8F7EF] text-[#006B3C] border-[#A7F3D0]'
            }`}>
              {isContractor ? <Hammer className="w-3 h-3 text-amber-600" /> : <Sparkles className="w-3 h-3 text-[#00A651]" />}
              {isContractor ? 'Mode Kontraktor • Prospek Proyek' : 'Demo Produk • Data Simulasi'}
            </span>
          </div>
          <p className="text-sm text-[#66736B] mt-1">
            {isContractor 
              ? 'Pantau pipeline survey, estimasi RAB, dan percepat penandatanganan SPK proyek Anda hari ini.'
              : 'Pantau pertumbuhan prospek dan percepat follow up sales Anda hari ini.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAddLead}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer ${
              isContractor ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#00A651] hover:bg-[#006B3C]'
            }`}
          >
            <span>{isContractor ? '+ Tambah Proyek' : '+ Tambah Lead'}</span>
          </button>
        </div>
      </div>

      {/* HIGHLIGHT REVENUE & PIPELINE VALUE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Total Potensi Pipeline */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-[#F0FDF4] border border-[#A7F3D0] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#00A651]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#66736B] uppercase tracking-wider">
                  {isContractor ? 'Total Pipeline Nilai Kontrak Proyek' : 'Total Potensi Pipeline'}
                </p>
                <p className="text-[11px] text-[#006B3C] font-semibold">
                  {isContractor ? 'Estimasi Nilai RAB Proyek Aktif' : 'Prospek Aktif (Cold + Warm + Hot)'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              {coldLeads + warmLeads + hotLeads} {isContractor ? 'Proyek' : 'Lead Aktif'}
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17221C] tracking-tight font-mono">
              {formatRupiah(totalPipelineRevenue)}
            </h3>
            <span className="text-xs font-medium text-[#66736B]">
              {isContractor ? 'Total Nilai Kontrak' : 'Estimasi Nilai Deal'}
            </span>
          </div>
        </div>

        {/* Card 2: Total Closing Revenue */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-[#E8F7EF] border border-[#00A651]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#00A651] text-white flex items-center justify-center shadow-xs">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#66736B] uppercase tracking-wider">
                  {isContractor ? 'Realisasi Deal SPK Ditandatangani' : 'Total Nilai Closing'}
                </p>
                <p className="text-[11px] text-[#006B3C] font-semibold">
                  {isContractor ? 'Kontrak Disepakati & DP Masuk' : 'Transaksi Berhasil'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#00A651] text-white">
              {closingLeads} {isContractor ? 'Deal SPK' : 'Deal Sukses'}
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#006B3C] tracking-tight font-mono">
              {formatRupiah(totalClosingRevenue)}
            </h3>
            <span className="text-xs font-medium text-[#006B3C] font-bold">
              {isContractor ? 'Nilai Kontrak Terkunci' : 'Revenue Terkunci'}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title={isContractor ? 'Total Prospek' : 'Total Lead'}
          value={totalLeadsCount}
          subtitle="Semua waktu"
          icon={isContractor ? Hammer : Users}
          iconColor={isContractor ? 'text-amber-600' : 'text-[#00A651]'}
          iconBg={isContractor ? 'bg-amber-50' : 'bg-[#E8F7EF]'}
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title={isContractor ? 'Proyek Baru' : 'Lead Baru'}
          value={newLeadsCount}
          subtitle="7 hari terakhir"
          icon={UserPlus}
          iconColor="text-[#10B981]"
          iconBg="bg-emerald-50"
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title={isContractor ? 'Survey / Follow Up' : 'Perlu Follow Up'}
          value={followUpCount}
          subtitle="Jadwal aktif"
          icon={Bell}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          onClick={onFilterFollowUp}
        />
        <StatCard
          title={isContractor ? 'Negosiasi SPK' : 'Lead Hot'}
          value={hotLeads}
          subtitle="Peluang tinggi"
          icon={Flame}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => onFilterByStatus('Hot')}
        />
        <StatCard
          title={isContractor ? 'SPK Signed' : 'Closing'}
          value={closingLeads}
          subtitle="Deal sukses"
          icon={CheckCircle2}
          iconColor="text-[#006B3C]"
          iconBg="bg-[#E8F7EF]"
          onClick={() => onFilterByStatus('Closing')}
        />
      </div>

      {/* MAIN PRIORITY: Follow Up / Survey Hari Ini Banner */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h2 className="text-lg font-bold text-[#17221C]">
                {isContractor ? 'Jadwal Survey & Follow Up Prioritas Hari Ini' : 'Follow Up Prioritas Hari Ini'}
              </h2>
            </div>
            <p className="text-xs text-[#66736B] mt-0.5">
              {isContractor 
                ? 'Calon klien dan jadwal survey site yang memerlukan tindakan hari ini'
                : 'Calon pelanggan prioritas yang memerlukan tindakan follow up'}
            </p>
          </div>
          <button
            type="button"
            onClick={onFilterFollowUp}
            className="text-xs font-bold text-[#006B3C] hover:text-[#00A651] flex items-center gap-1 transition-colors cursor-pointer"
          >
            Lihat Semua Jadwal <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {displayTodayFollowUps.length === 0 ? (
          <div className="py-8 text-center bg-[#F7F9F8] rounded-2xl border border-[#E2E9E4] p-4">
            <CheckCircle2 className="w-8 h-8 text-[#00A651] mx-auto mb-2 opacity-80" />
            <p className="text-sm font-bold text-[#17221C]">Semua Jadwal Selesai!</p>
            <p className="text-xs text-[#66736B] mt-0.5">
              Tidak ada {isContractor ? 'survey atau follow-up' : 'lead'} yang mendesak hari ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayTodayFollowUps.map((lead) => {
              const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
              const isOverdue = isDateOverdue(lead.nextFollowUpDate);

              return (
                <div
                  key={lead.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isOverdue 
                      ? 'bg-rose-50/40 border-rose-200' 
                      : 'bg-[#F7F9F8] border-[#E2E9E4]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={lead.status} size="sm" />
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isOverdue 
                          ? 'bg-rose-100 text-rose-700' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {isOverdue ? 'Terlambat' : 'Hari Ini'} • {lead.nextFollowUpTime || '10:00'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#17221C] text-sm hover:text-[#006B3C] cursor-pointer" onClick={() => onSelectLead(lead)}>
                        {lead.name}
                      </h4>
                      <p className="text-xs text-[#66736B] truncate">{lead.product}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E2E9E4]">
                      <span className="font-semibold text-[#17221C]">{lead.city}</span>
                      <span className="font-bold text-[#006B3C] font-mono">{formatRupiah(lead.value)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E2E9E4]">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] text-xs font-bold transition-all cursor-pointer active:scale-95"
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Middle Row: Perkembangan Lead & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Perkembangan Lead (Bar Chart) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#17221C]">
                {isContractor ? 'Perkembangan Prospek Proyek Masuk' : 'Perkembangan Lead Masuk'}
              </h2>
              <p className="text-xs text-[#66736B] mt-0.5">
                Tren akuisisi prospek baru ({chartPeriod === 'weekly' ? 'Mingguan' : 'Harian'})
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#F7F9F8] p-1 rounded-xl border border-[#E2E9E4] text-xs">
              <button
                type="button"
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartPeriod === 'weekly'
                    ? isContractor ? 'bg-amber-600 text-white shadow-xs' : 'bg-[#00A651] text-white shadow-xs'
                    : 'text-[#66736B] hover:text-[#17221C]'
                }`}
              >
                Mingguan
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('daily')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartPeriod === 'daily'
                    ? isContractor ? 'bg-amber-600 text-white shadow-xs' : 'bg-[#00A651] text-white shadow-xs'
                    : 'text-[#66736B] hover:text-[#17221C]'
                }`}
              >
                Harian
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {activeChartData.map((item, idx) => {
              const heightPct = Math.max(12, Math.round((item.value / maxChartValue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-[#17221C] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </span>
                  <div className="w-full bg-[#E8F7EF] rounded-t-xl h-full flex items-end overflow-hidden max-w-[48px]">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                        isContractor ? 'bg-gradient-to-t from-amber-600 to-amber-400' : 'bg-gradient-to-t from-[#00A651] to-[#10B981]'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#66736B] text-center truncate w-full">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-5 bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#17221C]">
                {isContractor ? 'Distribusi Pipeline Proyek' : 'Distribusi Pipeline'}
              </h2>
              <p className="text-xs text-[#66736B] mt-0.5">
                {isContractor ? 'Tahapan negosiasi SPK proyek saat ini' : 'Komposisi status prospek saat ini'}
              </p>
            </div>
          </div>

          {/* Status Breakdown List */}
          <div className="space-y-3">
            {statusDistribution.map((item) => (
              <div
                key={item.status}
                onClick={() => onFilterByStatus(item.rawStatus)}
                className="p-2.5 rounded-xl hover:bg-[#F7F9F8] transition-colors cursor-pointer border border-transparent hover:border-[#E2E9E4]"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-[#17221C]">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#17221C]">{item.count} {isContractor ? 'Proyek' : 'Lead'}</span>
                    <span className="text-[11px] text-[#66736B] font-mono">({item.pct})</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F7F9F8] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: item.pct, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Saluran Terbaik & Quick Stats */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#17221C]">Efektivitas Saluran Akuisisi Klien</h2>
            <p className="text-xs text-[#66736B] mt-0.5">
              {isContractor ? 'Performa closing SPK berdasarkan sumber kontak proyek' : 'Performa konversi berdasarkan sumber lead'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('reports')}
            className="text-xs font-bold text-[#006B3C] hover:text-[#00A651] flex items-center gap-1 transition-colors cursor-pointer"
          >
            Laporan Lengkap <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {bestSources.map((s) => (
            <div
              key={s.source}
              className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E2E9E4] flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <SourceBadge source={s.source} />
              </div>
              <div>
                <p className="text-lg font-extrabold text-[#17221C]">{s.leads}</p>
                <p className="text-[10px] text-[#66736B]">{isContractor ? 'Total Proyek' : 'Total Lead'}</p>
              </div>
              <div className="pt-2 border-t border-[#E2E9E4] flex items-center justify-between text-[11px]">
                <span className="text-[#66736B]">{isContractor ? 'SPK:' : 'Closing:'}</span>
                <span className="font-bold text-[#006B3C]">{s.closing} ({s.rate})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};