'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowUpRight, 
  Sparkles,
  Phone,
  MessageCircle,
  ChevronRight,
  Filter,
  BarChart3,
  CalendarClock,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { DEMO_TEAM_MEMBERS, DEMO_PERSONAS } from '../../data/enterpriseDemoData';
import { formatRupiah, formatDisplayPhone, isDateOverdue, isDateToday } from '../../utils/helpers';
import { StatusBadge } from '../common/StatusBadge';

interface SupervisorDashboardViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenAddLead?: () => void;
}

export const SupervisorDashboardView: React.FC<SupervisorDashboardViewProps> = ({
  leads,
  onSelectLead,
  onNavigateToTab,
}) => {
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');

  // Aggregated team numbers (from base leads + team simulation)
  const totalTeamLeads = leads.length + 18;
  const teamHotLeads = leads.filter((l) => l.status === 'Hot').length + 5;
  const teamPipelineValue = leads
    .filter((l) => l.status === 'Cold' || l.status === 'Warm' || l.status === 'Hot')
    .reduce((sum, l) => sum + (l.value || 0), 0) + 855000000;
  
  const teamClosingValue = leads
    .filter((l) => l.status === 'Closing')
    .reduce((sum, l) => sum + (l.value || 0), 0) + 565000000;

  const teamClosingCount = leads.filter((l) => l.status === 'Closing').length + 28;
  const teamConversionRate = ((teamClosingCount / totalTeamLeads) * 100).toFixed(1);

  // Active follow up summary for team
  const overdueTeamCount = leads.filter((l) => isDateOverdue(l.nextFollowUpDate)).length + 4;
  const todayTeamCount = leads.filter((l) => isDateToday(l.nextFollowUpDate)).length + 6;

  // Filtered members
  const displayMembers = selectedMemberFilter === 'all' 
    ? DEMO_TEAM_MEMBERS 
    : DEMO_TEAM_MEMBERS.filter((m) => m.id === selectedMemberFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* 1. Supervisor Welcome & Organization Banner */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
              Portal Supervisor — {DEMO_PERSONAS.supervisor.team}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              <Sparkles className="w-3 h-3 text-[#00A651]" />
              Team Management • Data Simulasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#66736B] mt-1">
            Monitoring performa {DEMO_TEAM_MEMBERS.length} sales representative, pipeline deals, dan SLA tindak lanjut nasabah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateToTab('leads')}
            className="px-4 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Lihat Semua Lead Tim</span>
          </button>
        </div>
      </div>

      {/* 2. Team Overview 6 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Leads Tim */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Total Lead Tim</span>
            <div className="p-1 rounded-lg bg-[#E8F7EF] text-[#006B3C]">
              <Users className="w-3.5 h-3.5 text-[#00A651]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17221C] mt-2">{totalTeamLeads}</div>
          <div className="text-[10px] text-[#006B3C] font-semibold mt-1">4 Sales Representative</div>
        </div>

        {/* Card 2: Hot Leads */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Prospek Hot</span>
            <div className="p-1 rounded-lg bg-rose-50 text-rose-600">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">{teamHotLeads}</div>
          <div className="text-[10px] text-rose-700 font-medium mt-1">Probabilitas &gt; 80%</div>
        </div>

        {/* Card 3: Team Pipeline Value */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Pipeline Tim</span>
            <div className="p-1 rounded-lg bg-emerald-50 text-[#006B3C]">
              <TrendingUp className="w-3.5 h-3.5 text-[#00A651]" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#17221C] mt-2 truncate font-mono">
            {formatRupiah(teamPipelineValue)}
          </div>
          <div className="text-[10px] text-[#66736B] font-medium mt-1">Estimasi Nilai Deal</div>
        </div>

        {/* Card 4: Team Closing Value */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Closing Tim</span>
            <div className="p-1 rounded-lg bg-[#E8F7EF] text-[#006B3C]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#006B3C] mt-2 truncate font-mono">
            {formatRupiah(teamClosingValue)}
          </div>
          <div className="text-[10px] text-[#006B3C] font-semibold mt-1">{teamClosingCount} Transaksi Sukses</div>
        </div>

        {/* Card 5: Overdue / Pending Follow-up */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Follow-up Terlambat</span>
            <div className="p-1 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{overdueTeamCount}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-1">Perlu Teguran / Support</div>
        </div>

        {/* Card 6: Team Conversion Rate */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Rasio Konversi</span>
            <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17221C] mt-2">{teamConversionRate}%</div>
          <div className="text-[10px] text-blue-700 font-medium mt-1">Target Tim: &gt; 30%</div>
        </div>
      </div>

      {/* 3. Sales Leaderboard & Performance Table */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#17221C] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#00A651]" />
              <span>Leaderboard & Kinerja Sales Representative Tim</span>
            </h3>
            <p className="text-xs text-[#66736B] mt-0.5">
              Peringkat pencapaian target closing, nilai pipeline, dan SLA kontak prospek
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMemberFilter}
              onChange={(e) => setSelectedMemberFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs font-semibold text-[#17221C] focus:outline-none focus:border-[#00A651] cursor-pointer"
            >
              <option value="all">Semua Anggota Tim (4)</option>
              {DEMO_TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#E2E9E4] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9F8] text-[#66736B] border-b border-[#E2E9E4] uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Sales Representative</th>
                <th className="px-4 py-3">Lead Aktif</th>
                <th className="px-4 py-3">Prospek Hot</th>
                <th className="px-4 py-3">Potensi Pipeline</th>
                <th className="px-4 py-3">Realisasi Closing</th>
                <th className="px-4 py-3">Target Bulanan</th>
                <th className="px-4 py-3 text-right">Status SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E4]">
              {displayMembers.map((member, idx) => (
                <tr key={member.id} className="hover:bg-[#F7F9F8] transition-colors">
                  {/* Name & Role */}
                  <td className="px-4 py-3 font-semibold text-[#17221C]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#E8F7EF] text-[#006B3C] font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-[#17221C]">{member.name}</div>
                        <div className="text-[10px] text-[#66736B]">{member.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Leads count */}
                  <td className="px-4 py-3 font-semibold text-[#17221C]">
                    {member.leadsCount} Lead
                  </td>

                  {/* Hot Leads */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {member.hotLeadsCount} Hot
                    </span>
                  </td>

                  {/* Pipeline */}
                  <td className="px-4 py-3 font-mono font-semibold text-[#17221C]">
                    {formatRupiah(member.pipelineValue)}
                  </td>

                  {/* Closing */}
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-[#006B3C]">
                      {formatRupiah(member.closingValue)}
                    </div>
                    <div className="text-[10px] text-[#66736B]">
                      {member.closingCount} Deals ({member.conversionRatePct}%)
                    </div>
                  </td>

                  {/* Target Achievement */}
                  <td className="px-4 py-3 min-w-[140px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#17221C]">{member.achievementPct}%</span>
                      <span className="text-[#66736B]">{member.closingCount}/{member.monthlyTarget}</span>
                    </div>
                    <div className="w-full bg-[#F1F5F3] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          member.achievementPct >= 80 ? 'bg-[#00A651]' : member.achievementPct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(member.achievementPct, 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* SLA */}
                  <td className="px-4 py-3 text-right">
                    {member.pendingFollowUps > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{member.pendingFollowUps} Follow Up</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006B3C] bg-[#E8F7EF] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SLA Terpenuhi</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Team Follow-up Monitoring & Action Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section A: Active Follow-up Overview */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17221C] flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#00A651]" />
              <span>Monitoring Jadwal Kontak Tim Hari Ini</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateToTab('followup')}
              className="text-xs font-bold text-[#006B3C] hover:underline"
            >
              Lihat Kalender →
            </button>
          </div>

          <div className="space-y-2.5">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="p-3 bg-[#F7F9F8] hover:bg-[#E8F7EF]/40 border border-[#E2E9E4] hover:border-[#00A651]/40 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#17221C] truncate">{lead.name}</span>
                    <StatusBadge status={lead.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-[#66736B] mt-0.5">
                    {lead.product.split('—')[0].trim()} • Nilai: <span className="font-mono font-semibold">{formatRupiah(lead.value)}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-[#006B3C]">{lead.nextFollowUpTime || '10:00'}</div>
                  <div className="text-[10px] text-[#66736B]">Assigned: Budi Sales</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Team Pipeline Funnel Distribution */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17221C] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00A651]" />
              <span>Distribusi Tahapan Pipeline Tim</span>
            </h3>
            <span className="text-[10px] text-[#66736B] font-semibold">Bulan Berjalan</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Stage 1: Inbound / Cold */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-[#66736B]">1. Prospek Baru (Cold)</span>
                <span className="font-bold text-[#17221C]">6 Lead • Rp 180 Juta</span>
              </div>
              <div className="w-full bg-[#F1F5F3] h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Stage 2: Contacted / Warm */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-[#66736B]">2. Dalam Penjajakan (Warm)</span>
                <span className="font-bold text-amber-600">8 Lead • Rp 340 Juta</span>
              </div>
              <div className="w-full bg-[#F1F5F3] h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Stage 3: Qualified / Hot */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-[#66736B]">3. Negosiasi SPK (Hot)</span>
                <span className="font-bold text-rose-600">5 Lead • Rp 480 Juta</span>
              </div>
              <div className="w-full bg-[#F1F5F3] h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            {/* Stage 4: Closed Won */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-[#66736B]">4. Closing / Realisasi (Won)</span>
                <span className="font-bold text-[#006B3C]">14 Deal • Rp 680 Juta</span>
              </div>
              <div className="w-full bg-[#F1F5F3] h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00A651] rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
