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
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react';
import { Lead, LeadStatus, ActiveTab } from '../../types';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { generateWhatsAppUrl, getStatusTheme } from '../../utils/helpers';

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
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Dynamic statistics calculated from current leads
  const totalLeadsCount = leads.length > 0 ? leads.length + 228 : 248; // baseline mock + real adds
  const hotLeads = leads.filter((l) => l.status === 'Hot').length + 23;
  const warmLeads = leads.filter((l) => l.status === 'Warm').length + 61;
  const coldLeads = leads.filter((l) => l.status === 'Cold').length + 115;
  const closingLeads = leads.filter((l) => l.status === 'Closing').length + 9;
  const lostLeads = leads.filter((l) => l.status === 'Tidak Berhasil').length + 17;
  
  const todayFollowUps = leads.filter((l) => {
    // Has next follow up today or is in today's list
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

  // Donut chart calculations
  const statusDistribution = [
    { status: 'Cold' as LeadStatus, count: 120, pct: '48%', color: '#3B82F6', arcColor: '#3B82F6' },
    { status: 'Warm' as LeadStatus, count: 68, pct: '27%', color: '#EAB308', arcColor: '#EAB308' },
    { status: 'Hot' as LeadStatus, count: 27, pct: '11%', color: '#EF4444', arcColor: '#EF4444' },
    { status: 'Closing' as LeadStatus, count: 14, pct: '6%', color: '#10B981', arcColor: '#10B981' },
    { status: 'Tidak Berhasil' as LeadStatus, count: 19, pct: '8%', color: '#64748B', arcColor: '#64748B' },
  ];

  // Best sources ranked
  const bestSources = [
    { source: 'WhatsApp' as const, leads: 80, closing: 8, rate: '10%' },
    { source: 'Facebook' as const, leads: 60, closing: 3, rate: '5%' },
    { source: 'Instagram' as const, leads: 45, closing: 2, rate: '4%' },
    { source: 'Referral' as const, leads: 30, closing: 1, rate: '3%' },
    { source: 'Website' as const, leads: 20, closing: 0, rate: '0%' },
  ];

  // Leads for Follow Up Hari Ini
  const displayTodayFollowUps = leads
    .filter((l) => l.status === 'Hot' || l.status === 'Warm')
    .slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* 5 Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Lead"
          value={totalLeadsCount}
          subtitle="Semua waktu"
          icon={Users}
          iconColor="text-[#168BFF]"
          iconBg="bg-[#168BFF]/10"
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title="Lead Baru"
          value="32"
          subtitle="Minggu ini"
          icon={UserPlus}
          iconColor="text-[#22D3EE]"
          iconBg="bg-[#22D3EE]/10"
          onClick={() => onNavigateToTab('leads')}
        />
        <StatCard
          title="Perlu Follow Up"
          value={followUpCount}
          subtitle="Hari ini"
          icon={Bell}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          glowColor="hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          onClick={onFilterFollowUp}
        />
        <StatCard
          title="Lead Hot"
          value={hotLeads}
          subtitle="Potensi tinggi"
          icon={Flame}
          iconColor="text-red-400"
          iconBg="bg-red-500/10"
          glowColor="hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          onClick={() => onFilterByStatus('Hot')}
        />
        <StatCard
          title="Closing"
          value={closingLeads}
          subtitle="Berhasil"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          glowColor="hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          onClick={() => onFilterByStatus('Closing')}
        />
      </div>

      {/* Middle Row: Perkembangan Lead + Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Perkembangan Lead (Line Chart) */}
        <div className="lg:col-span-7 bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC]">Perkembangan Lead</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Pertumbuhan lead baru masuk</p>
            </div>
            <div className="flex items-center gap-1 bg-[#0E233D] p-1 rounded-xl border border-[#17324D] text-xs">
              <button
                type="button"
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  chartPeriod === 'weekly'
                    ? 'bg-[#168BFF] text-white shadow-[0_0_10px_rgba(22,139,255,0.3)]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Per Minggu
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('daily')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  chartPeriod === 'daily'
                    ? 'bg-[#168BFF] text-white shadow-[0_0_10px_rgba(22,139,255,0.3)]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Harian
              </button>
            </div>
          </div>

          {/* Interactive Line Chart SVG */}
          <div className="relative w-full h-56 pt-2 pb-4 select-none">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 text-[10px] text-[#94A3B8]">
              <div className="border-b border-[#17324D] w-full flex justify-between"><span>80</span></div>
              <div className="border-b border-[#17324D] w-full flex justify-between"><span>60</span></div>
              <div className="border-b border-[#17324D] w-full flex justify-between"><span>40</span></div>
              <div className="border-b border-[#17324D] w-full flex justify-between"><span>20</span></div>
              <div className="border-b border-[#17324D] w-full flex justify-between"><span>0</span></div>
            </div>

            {/* SVG Path */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="leadAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#168BFF" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#168BFF" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Gradient Area */}
              <polygon
                points="20,130 120,105 220,85 340,40 460,70 460,170 20,170"
                fill="url(#leadAreaGradient)"
              />

              {/* Glowing Line */}
              <polyline
                points="20,130 120,105 220,85 340,40 460,70"
                fill="none"
                stroke="#168BFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />

              {/* Data points */}
              {[
                { x: 20, y: 130, val: 25, label: 'Minggu 1' },
                { x: 120, y: 105, val: 38, label: 'Minggu 2' },
                { x: 220, y: 85, val: 47, label: 'Minggu 3' },
                { x: 340, y: 40, val: 65, label: 'Minggu 4' },
                { x: 460, y: 70, val: 52, label: 'Minggu ini' },
              ].map((pt, i) => (
                <g key={i} className="group/dot cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5.5"
                    className="fill-[#22D3EE] stroke-[#06111F] stroke-2 shadow-lg transition-transform duration-200 group-hover/dot:scale-150"
                  />
                  {/* Tooltip on hover */}
                  <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity">
                    <rect
                      x={pt.x - 24}
                      y={pt.y - 32}
                      width="48"
                      height="22"
                      rx="6"
                      fill="#0E233D"
                      stroke="#168BFF"
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 18}
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {pt.val} lead
                    </text>
                  </g>
                </g>
              ))}
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-xs text-[#94A3B8] font-medium pt-2">
              {chartDataWeekly.map((item, idx) => (
                <span key={idx} className="text-center">{item.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Berdasarkan Status (Donut Chart) */}
        <div className="lg:col-span-5 bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC]">Lead Berdasarkan Status</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Distribusi tahapan calon pelanggan</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Cold: 48% -> dasharray: 48 * 2.512 = 120.57, offset 0 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="14"
                  strokeDasharray="115 239"
                  strokeDashoffset="0"
                  className="transition-all hover:opacity-80 cursor-pointer"
                  onClick={() => onFilterByStatus('Cold')}
                />
                {/* Warm: 27% -> dasharray: 64.5, offset -115 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#EAB308"
                  strokeWidth="14"
                  strokeDasharray="64.5 239"
                  strokeDashoffset="-115"
                  className="transition-all hover:opacity-80 cursor-pointer"
                  onClick={() => onFilterByStatus('Warm')}
                />
                {/* Hot: 11% -> dasharray: 26.3, offset -179.5 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="14"
                  strokeDasharray="26.3 239"
                  strokeDashoffset="-179.5"
                  className="transition-all hover:opacity-80 cursor-pointer"
                  onClick={() => onFilterByStatus('Hot')}
                />
                {/* Closing: 6% -> dasharray: 14.3, offset -205.8 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="14"
                  strokeDasharray="14.3 239"
                  strokeDashoffset="-205.8"
                  className="transition-all hover:opacity-80 cursor-pointer"
                  onClick={() => onFilterByStatus('Closing')}
                />
                {/* Tidak Berhasil: 8% -> dasharray: 19.1, offset -220.1 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#64748B"
                  strokeWidth="14"
                  strokeDasharray="19.1 239"
                  strokeDashoffset="-220.1"
                  className="transition-all hover:opacity-80 cursor-pointer"
                  onClick={() => onFilterByStatus('Tidak Berhasil')}
                />
              </svg>
              {/* Donut Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">{totalLeadsCount}</span>
                <span className="text-[10px] text-[#94A3B8]">Total Lead</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 w-full max-w-xs text-xs">
              {statusDistribution.map((item) => (
                <button
                  key={item.status}
                  type="button"
                  onClick={() => onFilterByStatus(item.status)}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-[#0E233D] transition-colors group text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#94A3B8] group-hover:text-[#F8FAFC] font-medium">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F8FAFC]">{item.count}</span>
                    <span className="text-[#94A3B8] text-[11px]">({item.pct})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Sumber Lead Terbaik + Follow Up Hari Ini */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sumber Lead Terbaik */}
        <div className="lg:col-span-6 bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC]">Sumber Lead Terbaik</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Saluran dengan konversi tertinggi</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('reports')}
              className="text-xs font-semibold text-[#168BFF] hover:text-[#22D3EE] flex items-center gap-1 transition-colors"
            >
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-12 text-[11px] font-semibold text-[#94A3B8] pb-1 border-b border-[#17324D]">
              <span className="col-span-5">Sumber</span>
              <span className="col-span-2 text-center">Lead</span>
              <span className="col-span-2 text-center">Closing</span>
              <span className="col-span-3 text-right">Tingkat Closing</span>
            </div>

            {bestSources.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center py-1.5 text-xs hover:bg-[#0E233D]/60 rounded-lg px-1 transition-colors"
              >
                <div className="col-span-5 flex items-center gap-2">
                  <SourceBadge source={item.source} size="sm" showText={true} />
                </div>
                <div className="col-span-2 text-center font-semibold text-[#F8FAFC]">
                  {item.leads}
                </div>
                <div className="col-span-2 text-center font-bold text-emerald-400">
                  {item.closing}
                </div>
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <div className="w-12 bg-[#06111F] rounded-full h-1.5 overflow-hidden border border-[#17324D]">
                    <div
                      className="bg-gradient-to-r from-[#168BFF] to-[#22D3EE] h-full rounded-full"
                      style={{ width: `${Math.min(parseFloat(item.rate) * 8, 100)}%` }}
                    />
                  </div>
                  <span className="font-bold text-[#F8FAFC] w-7 text-right">{item.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow Up Hari Ini matching mockup */}
        <div className="lg:col-span-6 bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC]">Follow Up Hari Ini</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Jadwal follow up yang harus dihubungi</p>
            </div>
            <button
              type="button"
              onClick={onFilterFollowUp}
              className="text-xs font-semibold text-[#168BFF] hover:text-[#22D3EE] flex items-center gap-1 transition-colors"
            >
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
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
                  className="flex items-center justify-between p-3 rounded-xl bg-[#06111F]/60 border border-[#17324D] hover:border-[#168BFF]/50 transition-all group"
                >
                  {/* Lead Info */}
                  <div
                    onClick={() => onSelectLead(lead)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#168BFF]/30 to-[#0E233D] border border-[#168BFF]/30 flex items-center justify-center text-xs font-bold text-[#22D3EE] shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors truncate">
                          {lead.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate mt-0.5">
                        {lead.product.split('—')[0].trim()} · {lead.city}
                      </p>
                    </div>
                  </div>

                  {/* Right side controls: Status, Time, WhatsApp, Detail */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <StatusBadge status={lead.status} size="sm" />
                    <span className="text-xs font-mono font-medium text-[#94A3B8]">
                      {lead.nextFollowUpTime || '09:00'}
                    </span>

                    {/* WhatsApp button */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105"
                      title={`Chat WhatsApp ${lead.name}`}
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    {/* Detail button */}
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead)}
                      className="p-2 rounded-lg bg-[#0E233D] hover:bg-[#168BFF] text-[#94A3B8] hover:text-white border border-[#17324D] transition-all"
                      title="Lihat Detail Lead"
                      aria-label="Detail"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
