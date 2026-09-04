'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users2,
  BadgeCheck,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import {
  DemoLead,
  DemoFollowUp,
  DemoDeal,
  LeadSource,
} from './types';

interface ReportViewProps {
  leads: DemoLead[];
  followups: DemoFollowUp[];
  deals: DemoDeal[];
}

const SOURCES: LeadSource[] = [
  'WhatsApp',
  'Instagram',
  'Facebook',
  'Google',
  'Referral',
  'Walk-in',
  'Marketplace',
  'Lainnya',
];

export function ReportView({ leads, followups, deals }: ReportViewProps) {
  // KPI Metrics
  const totalLeads = leads.length;
  const activeCustomers = leads.filter((l) => l.stage === 'Deal').length;
  const successfulDeals = deals.filter(
    (d) => d.status === 'Lunas' || d.status === 'DP Diterima'
  );
  const totalRevenue = successfulDeals.reduce((sum, d) => sum + d.dealValue, 0);
  const conversionRate =
    totalLeads > 0
      ? Math.round((successfulDeals.length / totalLeads) * 100)
      : 0;

  const completedFollowUps = followups.filter((f) => f.status === 'Selesai').length;
  const overdueFollowUps = followups.filter((f) => f.status === 'Terlambat').length;

  // Source performance breakdown
  const sourceStats = SOURCES.map((src) => {
    const srcLeads = leads.filter((l) => l.source === src);
    const srcDeals = deals.filter((d) => {
      const parentLead = leads.find((l) => l.id === d.leadId);
      return (
        parentLead?.source === src &&
        (d.status === 'Lunas' || d.status === 'DP Diterima')
      );
    });
    const srcRevenue = srcDeals.reduce((sum, d) => sum + d.dealValue, 0);

    return {
      source: src,
      leadCount: srcLeads.length,
      dealCount: srcDeals.length,
      revenue: srcRevenue,
      conversion:
        srcLeads.length > 0
          ? Math.round((srcDeals.length / srcLeads.length) * 100)
          : 0,
    };
  }).filter((s) => s.leadCount > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E]">
          Laporan & Ringkasan Performa Sales
        </h2>
        <p className="text-xs sm:text-sm text-[#64756D]">
          Evaluasi efektivitas sumber prospek, kedisiplinan follow-up, dan rasio konversi deal.
        </p>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#64756D]">Total Prospek Masuk</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E]">
            {totalLeads} Lead
          </div>
          <p className="text-[11px] text-[#64756D]">{activeCustomers} menjadi customer</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#64756D]">Win Conversion Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#16A36A]">
            {conversionRate}%
          </div>
          <p className="text-[11px] text-[#64756D]">{successfulDeals.length} deal berhasil</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#64756D]">Total Omset Closing</div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E] truncate">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#64756D]">Realisasi DP & pelunasan</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#64756D]">Kedisiplinan Follow-up</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E]">
            {completedFollowUps} Selesai
          </div>
          <p className="text-[11px] text-[#DC2626]">
            {overdueFollowUps > 0 ? `${overdueFollowUps} follow-up terlambat` : 'Semua tepat waktu'}
          </p>
        </div>
      </div>

      {/* Performance Sumber Lead Table */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-5 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#16A36A]" />
            <h3 className="text-sm font-extrabold text-[#0B3D2E] uppercase tracking-wider">
              Performa Sumber Prospek (Lead Source)
            </h3>
          </div>
          <span className="text-xs text-[#64756D]">Data terhitung otomatis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2EAE5] text-[#64756D] font-bold">
                <th className="pb-3 pr-4">Channel / Sumber</th>
                <th className="pb-3 px-4">Jumlah Lead</th>
                <th className="pb-3 px-4">Deal Closing</th>
                <th className="pb-3 px-4">Conversion Rate</th>
                <th className="pb-3 pl-4 text-right">Omset yang Dihasilkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE5]">
              {sourceStats.map((stat) => (
                <tr key={stat.source} className="hover:bg-[#F7FAF8] transition">
                  <td className="py-3.5 pr-4 font-bold text-[#10231B]">
                    {stat.source}
                  </td>
                  <td className="py-3.5 px-4 text-[#64756D]">
                    {stat.leadCount} prospek
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0B3D2E]">
                    {stat.dealCount} deal
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#16A36A]">
                    {stat.conversion}%
                  </td>
                  <td className="py-3.5 pl-4 text-right font-extrabold text-[#0B3D2E]">
                    Rp {stat.revenue.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
