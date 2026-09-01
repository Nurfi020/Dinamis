'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  Award, 
  Layers, 
  Sparkles, 
  MapPin, 
  BarChart3, 
  ArrowUpRight,
  Briefcase,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';
import { Lead } from '../../types';
import { DEMO_BRANCHES, DEMO_TEAMS, DEMO_PERSONAS } from '../../data/enterpriseDemoData';
import { formatRupiah } from '../../utils/helpers';

interface ManagerDashboardViewProps {
  leads: Lead[];
  onNavigateToTab: (tab: any) => void;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  leads,
  onNavigateToTab,
}) => {
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');

  // Aggregated Macro KPIs from 3 branches
  const totalLeadsOrg = DEMO_BRANCHES.reduce((sum, b) => sum + b.leadsCount, 0);
  const totalPipelineOrg = DEMO_BRANCHES.reduce((sum, b) => sum + b.pipelineValue, 0);
  const totalClosingOrg = DEMO_BRANCHES.reduce((sum, b) => sum + b.closingValue, 0);
  const totalClosingDeals = DEMO_BRANCHES.reduce((sum, b) => sum + b.closingCount, 0);
  const totalSalesReps = DEMO_BRANCHES.reduce((sum, b) => sum + b.salesCount, 0);
  const overallConversion = ((totalClosingDeals / totalLeadsOrg) * 100).toFixed(1);
  const totalTargetOrg = DEMO_BRANCHES.reduce((sum, b) => sum + b.monthlyTarget, 0);
  const targetAchievementOrg = Math.round((totalClosingDeals / totalTargetOrg) * 100);

  // Filtered branches & teams
  const filteredBranches = selectedBranchFilter === 'all' 
    ? DEMO_BRANCHES 
    : DEMO_BRANCHES.filter((b) => b.id === selectedBranchFilter);

  const filteredTeams = selectedBranchFilter === 'all'
    ? DEMO_TEAMS
    : DEMO_TEAMS.filter((t) => {
        if (selectedBranchFilter === 'branch-jkt') return t.branchName.includes('Jakarta');
        if (selectedBranchFilter === 'branch-bdg') return t.branchName.includes('Bandung');
        if (selectedBranchFilter === 'branch-sby') return t.branchName.includes('Surabaya');
        return true;
      });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* 1. Executive Welcome & Strategic Context */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
              Executive Management Portal — {DEMO_PERSONAS.manager.branch}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              <Sparkles className="w-3 h-3 text-[#00A651]" />
              Strategic Overview • Data Simulasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#66736B] mt-1">
            Ringkasan omset pipeline nasional, produktivitas cabang, dan rasio konversi deal perbankan korporasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateToTab('reports')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F4FBF7] text-[#006B3C] border border-[#A7F3D0] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Laporan Manajemen Lengkap</span>
          </button>
        </div>
      </div>

      {/* 2. 6 Executive Macro KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Leads Organisasi */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Total Lead Nasional</span>
            <div className="p-1 rounded-lg bg-[#E8F7EF] text-[#006B3C]">
              <Users className="w-3.5 h-3.5 text-[#00A651]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17221C] mt-2">{totalLeadsOrg}</div>
          <div className="text-[10px] text-[#006B3C] font-semibold mt-1">3 Kantor Cabang</div>
        </div>

        {/* Card 2: Total Pipeline Korporasi */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Total Pipeline</span>
            <div className="p-1 rounded-lg bg-emerald-50 text-[#006B3C]">
              <TrendingUp className="w-3.5 h-3.5 text-[#00A651]" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#17221C] mt-2 truncate font-mono">
            {formatRupiah(totalPipelineOrg)}
          </div>
          <div className="text-[10px] text-[#66736B] font-medium mt-1">Potensi Omset Aktif</div>
        </div>

        {/* Card 3: Realisasi Closing Korporasi */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Realisasi Closing</span>
            <div className="p-1 rounded-lg bg-[#E8F7EF] text-[#006B3C]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#006B3C] mt-2 truncate font-mono">
            {formatRupiah(totalClosingOrg)}
          </div>
          <div className="text-[10px] text-[#006B3C] font-semibold mt-1">{totalClosingDeals} Transaksi Berhasil</div>
        </div>

        {/* Card 4: Overall Conversion */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Rasio Konversi</span>
            <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17221C] mt-2">{overallConversion}%</div>
          <div className="text-[10px] text-blue-700 font-medium mt-1">Benchmarking Industri: 28%</div>
        </div>

        {/* Card 5: Target Achievement */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Capaian Target</span>
            <div className="p-1 rounded-lg bg-amber-50 text-amber-600">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{targetAchievementOrg}%</div>
          <div className="text-[10px] text-amber-700 font-medium mt-1">{totalClosingDeals} dari {totalTargetOrg} Deal Target</div>
        </div>

        {/* Card 6: Total Active Sales Reps */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Sales Produktif</span>
            <div className="p-1 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17221C] mt-2">{totalSalesReps}</div>
          <div className="text-[10px] text-purple-700 font-medium mt-1">Rata-rata 4.5 Deal / Sales</div>
        </div>
      </div>

      {/* 3. Branch Performance Matrix Table */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#17221C] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#00A651]" />
              <span>Kinerja & Komparasi Antar-Kantor Cabang</span>
            </h3>
            <p className="text-xs text-[#66736B] mt-0.5">
              Evaluasi target closing bulanan, pipeline volume, dan konversi per kantor cabang
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs font-semibold text-[#17221C] focus:outline-none focus:border-[#00A651] cursor-pointer"
            >
              <option value="all">Semua Cabang (3)</option>
              {DEMO_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#E2E9E4] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9F8] text-[#66736B] border-b border-[#E2E9E4] uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Kantor Cabang</th>
                <th className="px-4 py-3">Kepala Cabang</th>
                <th className="px-4 py-3">Jumlah Tim / Sales</th>
                <th className="px-4 py-3">Total Leads</th>
                <th className="px-4 py-3">Potensi Pipeline</th>
                <th className="px-4 py-3">Realisasi Closing</th>
                <th className="px-4 py-3">Target Bulanan</th>
                <th className="px-4 py-3 text-right">Rasio Konversi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E4]">
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="hover:bg-[#F7F9F8] transition-colors">
                  {/* Branch Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center font-bold text-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#00A651]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#17221C]">{branch.name}</div>
                        <div className="text-[10px] text-[#66736B]">{branch.city}</div>
                      </div>
                    </div>
                  </td>

                  {/* Head Name */}
                  <td className="px-4 py-3 font-semibold text-[#17221C]">
                    {branch.headName}
                  </td>

                  {/* Teams & Sales */}
                  <td className="px-4 py-3 text-[#66736B]">
                    <span className="font-semibold text-[#17221C]">{branch.teamsCount} Tim</span> • {branch.salesCount} Sales Reps
                  </td>

                  {/* Leads count */}
                  <td className="px-4 py-3 font-semibold text-[#17221C]">
                    {branch.leadsCount} Lead
                  </td>

                  {/* Pipeline */}
                  <td className="px-4 py-3 font-mono font-semibold text-[#17221C]">
                    {formatRupiah(branch.pipelineValue)}
                  </td>

                  {/* Closing */}
                  <td className="px-4 py-3 font-mono font-bold text-[#006B3C]">
                    {formatRupiah(branch.closingValue)}
                  </td>

                  {/* Target Achievement */}
                  <td className="px-4 py-3 min-w-[130px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#17221C]">{branch.achievementPct}%</span>
                      <span className="text-[#66736B]">{branch.closingCount}/{branch.monthlyTarget}</span>
                    </div>
                    <div className="w-full bg-[#F1F5F3] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          branch.achievementPct >= 80 ? 'bg-[#00A651]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(branch.achievementPct, 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* Conversion */}
                  <td className="px-4 py-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
                      {branch.conversionRatePct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Team Performance Breakdown & Strategic Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Teams Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17221C] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00A651]" />
              <span>Rincian Produktivitas Sales Team Unit</span>
            </h3>
            <span className="text-xs text-[#66736B]">{filteredTeams.length} Tim Aktif</span>
          </div>

          <div className="overflow-x-auto border border-[#E2E9E4] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F9F8] text-[#66736B] border-b border-[#E2E9E4] uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-3 py-2.5">Unit Tim</th>
                  <th className="px-3 py-2.5">Supervisor</th>
                  <th className="px-3 py-2.5">Pipeline (Rp)</th>
                  <th className="px-3 py-2.5">Closing (Rp)</th>
                  <th className="px-3 py-2.5 text-right">Konversi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E9E4]">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-[#F7F9F8] transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="font-bold text-[#17221C]">{team.name}</div>
                      <div className="text-[10px] text-[#66736B]">{team.branchName} • {team.salesCount} Sales</div>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-[#17221C]">{team.supervisorName}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold">{formatRupiah(team.pipelineValue)}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-[#006B3C]">{formatRupiah(team.closingValue)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-[#006B3C]">{team.conversionRatePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategic Monthly Revenue Trend (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#17221C] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00A651]" />
                <span>Tren Pertumbuhan Omset</span>
              </h3>
              <span className="text-[10px] text-[#66736B] font-semibold">Q2 - Q3 2026</span>
            </div>
            <p className="text-xs text-[#66736B] mt-1">
              Realisasi closing deal 4 bulan terakhir di seluruh jaringan cabang.
            </p>
          </div>

          <div className="space-y-3 my-auto">
            {/* Mei */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#66736B]">Mei 2026</span>
                <span className="font-mono font-bold text-[#17221C]">Rp 1,65 M</span>
              </div>
              <div className="w-full bg-[#F1F5F3] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Juni */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#66736B]">Juni 2026</span>
                <span className="font-mono font-bold text-[#17221C]">Rp 1,92 M</span>
              </div>
              <div className="w-full bg-[#F1F5F3] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            {/* Juli */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#66736B]">Juli 2026</span>
                <span className="font-mono font-bold text-[#17221C]">Rp 2,24 M</span>
              </div>
              <div className="w-full bg-[#F1F5F3] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            {/* Agustus (Current) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#006B3C] font-bold">Agustus 2026 (Aktif)</span>
                <span className="font-mono font-bold text-[#006B3C]">Rp 2,58 M</span>
              </div>
              <div className="w-full bg-[#F1F5F3] h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00A651] rounded-full" style={{ width: '96%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#E8F7EF] rounded-xl border border-[#A7F3D0] text-[11px] text-[#006B3C]">
            <span className="font-bold">Insight:</span> Pertumbuhan deal closing korporasi konsisten naik +15.2% MoM didorong oleh produk Payroll Enterprise & KMK B2B.
          </div>
        </div>
      </div>
    </div>
  );
};
