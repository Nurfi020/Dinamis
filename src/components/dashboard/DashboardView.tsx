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
  Sparkles
} from 'lucide-react';
import { Lead, LeadStatus, ActiveTab, LeadSource } from '../../types';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { 
  generateWhatsAppUrl, 
  isDateToday, 
  isDateOverdue,
  formatRupiah 
} from '../../utils/helpers';

interface DashboardViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onFilterByStatus: (status: LeadStatus) => void;
  onFilterFollowUp: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  onSelectLead,
  onFilterByStatus,
  onFilterFollowUp,
  onNavigateToTab,
  onOpenAddLead,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'daily'>('weekly');

  // Dynamic statistics calculated directly from leads
  const totalLeadsCount = leads.length;
  const hotLeads = useMemo(() => leads.filter((l) => l.status === 'Hot').length, [leads]);
  const warmLeads = useMemo(() => leads.filter((l) => l.status === 'Warm').length, [leads]);
  const coldLeads = useMemo(() => leads.filter((l) => l.status === 'Cold').length, [leads]);
  const closingLeads = useMemo(() => leads.filter((l) => l.status === 'Closing').length, [leads]);
  const lostLeads = useMemo(() => leads.filter((l) => l.status === 'Tidak Berhasil').length, [leads]);

  // Financial metrics: Pipeline Revenue & Closing Revenue
  const totalPipelineRevenue = useMemo(() => {
    return leads
      .filter((l) => l.status === 'Cold' || l.status === 'Warm' || l.status === 'Hot')
      .reduce((sum, l) => sum + (l.value || 0), 0);
  }, [leads]);

  const totalClosingRevenue = useMemo(() => {
    return leads
      .filter((l) => l.status === 'Closing')
      .reduce((sum, l) => sum + (l.value || 0), 0);
  }, [leads]);

  // Leads created in the last 7 days
  const newLeadsCount = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return leads.filter((l) => new Date(l.createdAt) >= oneWeekAgo).length;
  }, [leads]);
  
  // Leads with scheduled active follow-ups
  const activeFollowUps = useMemo(() => {
    return leads.filter(
      (l) => l.nextFollowUpDate && l.status !== 'Closing' && l.status !== 'Tidak Berhasil'
    );
  }, [leads]);

  const followUpCount = activeFollowUps.length;

  // Immediate action leads for Follow Up Hari Ini / Overdue
  const displayTodayFollowUps = useMemo(() => {
    const priority = activeFollowUps.filter(
      (l) => isDateToday(l.nextFollowUpDate) || isDateOverdue(l.nextFollowUpDate)
    );
    if (priority.length > 0) return priority.slice(0, 4);
    return activeFollowUps.slice(0, 4);
  }, [activeFollowUps]);

  // Status distribution dynamically calculated
  const statusDistribution = useMemo(() => {
    const total = leads.length > 0 ? leads.length : 1;
    return [
      { 
        status: 'Cold' as LeadStatus, 
        count: coldLeads, 
        pct: `${leads.length > 0 ? Math.round((coldLeads / total) * 100) : 0}%`, 
        color: '#64748B', 
        bg: 'bg-[#64748B]' 
      },
      { 
        status: 'Warm' as LeadStatus, 
        count: warmLeads, 
        pct: `${leads.length > 0 ? Math.round((warmLeads / total) * 100) : 0}%`, 
        color: '#F59E0B', 
        bg: 'bg-[#F59E0B]' 
      },
      { 
        status: 'Hot' as LeadStatus, 
        count: hotLeads, 
        pct: `${leads.length > 0 ? Math.round((hotLeads / total) * 100) : 0}%`, 
        color: '#EF4444', 
        bg: 'bg-[#EF4444]' 
      },
      { 
        status: 'Closing' as LeadStatus, 
        count: closingLeads, 
        pct: `${leads.length > 0 ? Math.round((closingLeads / total) * 100) : 0}%`, 
        color: '#10B981', 
        bg: 'bg-[#10B981]' 
      },
      { 
        status: 'Tidak Berhasil' as LeadStatus, 
        count: lostLeads, 
        pct: `${leads.length > 0 ? Math.round((lostLeads / total) * 100) : 0}%`, 
        color: '#6B7280', 
        bg: 'bg-[#6B7280]' 
      },
    ];
  }, [leads, coldLeads, warmLeads, hotLeads, closingLeads, lostLeads]);

  // Sources dynamically grouped and ranked
  const bestSources = useMemo(() => {
    const sources: LeadSource[] = ['WhatsApp', 'Instagram', 'Facebook', 'Website', 'Referral', 'TikTok', 'Lainnya'];
    const list = sources.map((s) => {
      const sourceLeads = leads.filter((l) => l.source === s);
      const closing = sourceLeads.filter((l) => l.status === 'Closing').length;
      const rateNum = sourceLeads.length > 0 ? (closing / sourceLeads.length) * 100 : 0;
      return {
        source: s,
        leads: sourceLeads.length,
        closing,
        rate: `${rateNum.toFixed(1).replace('.', ',')}%`,
        rateNum,
      };
    });
    return list.sort((a, b) => b.leads - a.leads);
  }, [leads]);

  // Chart data weekly & daily
  const chartDataWeekly = useMemo(() => {
    const now = new Date();
    const weeks = [
      { label: '3 Mgg Lalu', daysAgo: 21 },
      { label: '2 Mgg Lalu', daysAgo: 14 },
      { label: 'Mgg Lalu', daysAgo: 7 },
      { label: 'Mgg Ini', daysAgo: 0 },
    ];

    return weeks.map((w, idx) => {
      const start = new Date(now);
      start.setDate(now.getDate() - w.daysAgo - 7);
      const end = new Date(now);
      end.setDate(now.getDate() - w.daysAgo);

      const count = leads.filter((l) => {
        const d = new Date(l.createdAt);
        return idx === 3 ? d >= start : (d >= start && d < end);
      }).length;

      return { label: w.label, value: count };
    });
  }, [leads]);

  const chartDataDaily = useMemo(() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const now = new Date();
    const result = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = leads.filter((l) => l.createdAt.startsWith(dateStr)).length;
      result.push({
        label: i === 0 ? 'Hari Ini' : days[d.getDay()],
        value: count,
      });
    }
    return result;
  }, [leads]);

  const activeChartData = chartPeriod === 'weekly' ? chartDataWeekly : chartDataDaily;
  const maxChartValue = Math.max(...activeChartData.map((d) => d.value), 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Greeting & Demo Mode Tag */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
              Selamat datang 👋
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              <Sparkles className="w-3 h-3 text-[#00A651]" />
              Demo Produk • Data Simulasi
            </span>
          </div>
          <p className="text-sm text-[#66736B] mt-1">
            Pantau pertumbuhan prospek dan percepat follow up sales Anda hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAddLead}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span>+ Tambah Lead</span>
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
                <p className="text-xs font-bold text-[#66736B] uppercase tracking-wider">Total Potensi Pipeline</p>
                <p className="text-[11px] text-[#006B3C] font-semibold">Prospek Aktif (Cold + Warm + Hot)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              {coldLeads + warmLeads + hotLeads} Lead Aktif
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17221C] tracking-tight">
              {formatRupiah(totalPipelineRevenue)}
            </h3>
            <span className="text-xs font-medium text-[#66736B]">Estimasi Nilai Deal</span>
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
                <p className="text-xs font-bold text-[#66736B] uppercase tracking-wider">Total Nilai Closing</p>
                <p className="text-[11px] text-[#006B3C] font-semibold">Transaksi Berhasil</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#00A651] text-white">
              {closingLeads} Deal Sukses
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#006B3C] tracking-tight">
              {formatRupiah(totalClosingRevenue)}
            </h3>
            <span className="text-xs font-medium text-[#006B3C] font-bold">Revenue Terkunci</span>
          </div>
        </div>
      </div>

      {/* 5 Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Lead"
          value={totalLeadsCount}
          subtitle="Semua waktu"
          icon={Users}
          iconColor="text-[#00A651]"
          iconBg="bg-[#E8F7EF]"
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title="Lead Baru"
          value={newLeadsCount}
          subtitle="7 hari terakhir"
          icon={UserPlus}
          iconColor="text-[#10B981]"
          iconBg="bg-emerald-50"
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title="Perlu Follow Up"
          value={followUpCount}
          subtitle="Jadwal aktif"
          icon={Bell}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          onClick={onFilterFollowUp}
        />
        <StatCard
          title="Lead Hot"
          value={hotLeads}
          subtitle="Peluang tinggi"
          icon={Flame}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => onFilterByStatus('Hot')}
        />
        <StatCard
          title="Closing"
          value={closingLeads}
          subtitle="Deal sukses"
          icon={CheckCircle2}
          iconColor="text-[#006B3C]"
          iconBg="bg-[#E8F7EF]"
          onClick={() => onFilterByStatus('Closing')}
        />
      </div>

      {/* MAIN PRIORITY: Follow Up Hari Ini Banner */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h2 className="text-lg font-bold text-[#17221C]">Follow Up Prioritas Hari Ini</h2>
            </div>
            <p className="text-xs text-[#66736B] mt-0.5">
              Calon pelanggan prioritas yang memerlukan tindakan follow up
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
            <span className="text-2xl mb-1 block">🎉</span>
            <p className="text-xs font-bold text-[#17221C]">Semua jadwal follow up telah selesai</p>
            <p className="text-[11px] text-[#66736B] mt-0.5">Tidak ada lead yang mendesak untuk dihubungi saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayTodayFollowUps.map((lead) => {
              const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
              const initials = lead.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

              return (
                <div
                  key={lead.id}
                  className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#E2E9E4] hover:border-[#00A651]/50 hover:bg-white transition-all flex flex-col justify-between gap-3 group"
                >
                  {/* Lead Info */}
                  <div
                    onClick={() => onSelectLead(lead)}
                    className="flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#17221C] group-hover:text-[#006B3C] transition-colors truncate">
                            {lead.name}
                          </h4>
                          <span className="text-xs font-bold text-[#006B3C] bg-[#E8F7EF] px-2 py-0.5 rounded-md border border-[#A7F3D0]/60 shrink-0">
                            {formatRupiah(lead.value)}
                          </span>
                        </div>
                        <p className="text-xs text-[#66736B] truncate mt-0.5">
                          {lead.product.split('—')[0].trim()} • {lead.city}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-[#66736B] flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#00A651]" />
                            {lead.nextFollowUpTime || '10:00'} WIB
                          </span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={lead.status} size="sm" />
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
              <h2 className="text-base font-bold text-[#17221C]">Perkembangan Lead Masuk</h2>
              <p className="text-xs text-[#66736B] mt-0.5">Tren akuisisi lead baru ({chartPeriod === 'weekly' ? 'Mingguan' : 'Harian'})</p>
            </div>
            <div className="flex items-center gap-1 bg-[#F7F9F8] p-1 rounded-xl border border-[#E2E9E4] text-xs">
              <button
                type="button"
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartPeriod === 'weekly'
                    ? 'bg-[#00A651] text-white shadow-xs'
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
                    ? 'bg-[#00A651] text-white shadow-xs'
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
                      className="w-full bg-gradient-to-t from-[#00A651] to-[#10B981] rounded-t-xl transition-all duration-500 group-hover:brightness-110"
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
              <h2 className="text-base font-bold text-[#17221C]">Distribusi Pipeline</h2>
              <p className="text-xs text-[#66736B] mt-0.5">Komposisi status prospek saat ini</p>
            </div>
          </div>

          {/* Status Breakdown List */}
          <div className="space-y-3">
            {statusDistribution.map((item) => (
              <div
                key={item.status}
                onClick={() => onFilterByStatus(item.status)}
                className="p-2.5 rounded-xl hover:bg-[#F7F9F8] transition-colors cursor-pointer border border-transparent hover:border-[#E2E9E4]"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-[#17221C]">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#17221C]">{item.count} Lead</span>
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
            <h2 className="text-base font-bold text-[#17221C]">Efektivitas Saluran Pemasaran</h2>
            <p className="text-xs text-[#66736B] mt-0.5">Performa konversi berdasarkan sumber lead</p>
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
                <p className="text-[10px] text-[#66736B]">Total Lead</p>
              </div>
              <div className="pt-2 border-t border-[#E2E9E4] flex items-center justify-between text-[11px]">
                <span className="text-[#66736B]">Closing:</span>
                <span className="font-bold text-[#006B3C]">{s.closing} ({s.rate})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};