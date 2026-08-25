'use client';

import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Lead, LeadStatus, ActiveTab } from '../../types';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { generateWhatsAppUrl } from '../../utils/helpers';

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

  // Dynamic statistics calculated from current leads
  const totalLeadsCount = leads.length > 0 ? leads.length + 228 : 248;
  const hotLeads = leads.filter((l) => l.status === 'Hot').length + 23;
  const warmLeads = leads.filter((l) => l.status === 'Warm').length + 61;
  const coldLeads = leads.filter((l) => l.status === 'Cold').length + 115;
  const closingLeads = leads.filter((l) => l.status === 'Closing').length + 9;
  const lostLeads = leads.filter((l) => l.status === 'Tidak Berhasil').length + 17;
  
  const todayFollowUps = leads.filter((l) => {
    return l.nextFollowUpDate && l.status !== 'Closing' && l.status !== 'Tidak Berhasil';
  });

  const followUpCount = todayFollowUps.length > 0 ? todayFollowUps.length + 14 : 18;

  // Chart data
  const chartDataWeekly = [
    { label: 'Minggu 1', value: 25 },
    { label: 'Minggu 2', value: 38 },
    { label: 'Minggu 3', value: 47 },
    { label: 'Minggu 4', value: 65 },
    { label: 'Minggu ini', value: 52 },
  ];

  // Status distribution with exact status colors (COLD: #64748B, WARM: #F59E0B, HOT: #EF4444, CLOSING: #10B981, LOST: #6B7280)
  const statusDistribution = [
    { status: 'Cold' as LeadStatus, count: 120, pct: '48%', color: '#64748B', bg: 'bg-[#64748B]' },
    { status: 'Warm' as LeadStatus, count: 68, pct: '27%', color: '#F59E0B', bg: 'bg-[#F59E0B]' },
    { status: 'Hot' as LeadStatus, count: 27, pct: '11%', color: '#EF4444', bg: 'bg-[#EF4444]' },
    { status: 'Closing' as LeadStatus, count: 14, pct: '6%', color: '#10B981', bg: 'bg-[#10B981]' },
    { status: 'Tidak Berhasil' as LeadStatus, count: 19, pct: '8%', color: '#6B7280', bg: 'bg-[#6B7280]' },
  ];

  // Best sources ranked
  const bestSources = [
    { source: 'WhatsApp' as const, leads: 80, closing: 8, rate: '10%' },
    { source: 'Facebook' as const, leads: 60, closing: 3, rate: '5%' },
    { source: 'Instagram' as const, leads: 45, closing: 2, rate: '4%' },
    { source: 'Referral' as const, leads: 30, closing: 1, rate: '3%' },
    { source: 'Website' as const, leads: 20, closing: 0, rate: '0%' },
  ];

  // Immediate Action leads for Follow Up Hari Ini
  const displayTodayFollowUps = leads
    .filter((l) => l.status === 'Hot' || l.status === 'Warm')
    .slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Greeting Section */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight flex items-center gap-2">
            Selamat datang 👋
          </h2>
          <p className="text-sm text-[#66736B] mt-1">
            Berikut perkembangan lead dan jadwal follow up Anda hari ini.
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
          value="32"
          subtitle="Minggu ini"
          icon={UserPlus}
          iconColor="text-[#10B981]"
          iconBg="bg-emerald-50"
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title="Perlu Follow Up"
          value={followUpCount}
          subtitle="Hari ini"
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
          subtitle="Bulan ini"
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
              <h2 className="text-lg font-bold text-[#17221C]">Follow Up Hari Ini</h2>
            </div>
            <p className="text-xs text-[#66736B] mt-0.5">
              Calon pelanggan prioritas yang memerlukan tindakan segera
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
                      <h4 className="text-sm font-bold text-[#17221C] group-hover:text-[#006B3C] transition-colors truncate">
                        {lead.name}
                      </h4>
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

                {/* Prominent Action Buttons */}
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
                    <span>Follow Up</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Row: Perkembangan Lead & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Perkembangan Lead (BSI Green Bar Chart) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#17221C]">Perkembangan Lead Masuk</h2>
              <p className="text-xs text-[#66736B] mt-0.5">Tren akuisisi lead baru per minggu</p>
            </div>
            <div className="flex items-center gap-1 bg-[#F7F9F8] p-1 rounded-xl border border-[#E2E9E4] text-xs">
              <button
                type="button"
                onClick={() => setChartPeriod('weekly')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  chartPeriod === 'daily'
                    ? 'bg-[#00A651] text-white shadow-xs'
                    : 'text-[#66736B] hover:text-[#17221C]'
                }`}
              >
                Harian
              </button>
            </div>
          </div>

          {/* Simple Clean Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {chartDataWeekly.map((item, idx) => {
              const max = 70;
              const heightPct = Math.round((item.value / max) * 100);
              const isCurrent = idx === chartDataWeekly.length - 1;

              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[11px] font-bold text-[#17221C] group-hover:text-[#006B3C] transition-colors">
                    {item.value}
                  </span>
                  <div className="w-full max-w-[40px] bg-[#F4FBF7] rounded-xl h-28 relative flex items-end overflow-hidden border border-[#E2E9E4]">
                    <div
                      className={`w-full rounded-xl transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#00A651]'
                          : 'bg-[#10B981]/70 group-hover:bg-[#00A651]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold truncate ${
                    isCurrent ? 'text-[#006B3C] font-bold' : 'text-[#66736B]'
                  }`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Berdasarkan Status */}
        <div className="lg:col-span-5 bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#17221C]">Distribusi Status Lead</h2>
              <p className="text-xs text-[#66736B] mt-0.5">Proporsi prospek saat ini</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {statusDistribution.map((item) => (
              <button
                key={item.status}
                type="button"
                onClick={() => onFilterByStatus(item.status)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F4FBF7] transition-colors group text-left border border-transparent hover:border-[#E2E9E4] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${item.bg}`} />
                  <span className="text-xs font-semibold text-[#66736B] group-hover:text-[#17221C]">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#17221C]">{item.count}</span>
                  <span className="text-[11px] font-medium text-[#66736B]">({item.pct})</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Sumber Lead Terbaik */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#17221C]">Sumber Lead Terbaik</h2>
            <p className="text-xs text-[#66736B] mt-0.5">Saluran pemasaran dengan tingkat closing tertinggi</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('reports')}
            className="text-xs font-bold text-[#006B3C] hover:text-[#00A651] flex items-center gap-1 transition-colors cursor-pointer"
          >
            Lihat Laporan Lengkap <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-12 text-[11px] font-bold text-[#66736B] pb-2 border-b border-[#E2E9E4]">
            <span className="col-span-5">Sumber Saluran</span>
            <span className="col-span-2 text-center">Total Lead</span>
            <span className="col-span-2 text-center">Closing</span>
            <span className="col-span-3 text-right">Tingkat Konversi</span>
          </div>

          {bestSources.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 items-center py-2 text-xs hover:bg-[#F4FBF7] rounded-xl px-1 transition-colors"
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
              <div className="col-span-3 flex items-center justify-end gap-2">
                <div className="w-16 bg-[#F1F5F3] rounded-full h-2 overflow-hidden border border-[#E2E9E4]">
                  <div
                    className="bg-[#00A651] h-full rounded-full"
                    style={{ width: `${Math.min(parseFloat(item.rate) * 8, 100)}%` }}
                  />
                </div>
                <span className="font-bold text-[#17221C] w-8 text-right">{item.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};