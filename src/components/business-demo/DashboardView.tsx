'use client';

import React from 'react';
import {
  Users2,
  UserCheck,
  Clock,
  BadgeCheck,
  CircleDollarSign,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Phone,
  AlertCircle,
} from 'lucide-react';
import {
  DemoLead,
  DemoFollowUp,
  DemoDeal,
  DemoActivity,
  BusinessTabKey,
} from './types';

interface DashboardViewProps {
  leads: DemoLead[];
  followups: DemoFollowUp[];
  deals: DemoDeal[];
  activities: DemoActivity[];
  onNavigate: (tab: BusinessTabKey) => void;
  onCompleteFollowUp: (id: string, note?: string) => void;
}

export function DashboardView({
  leads,
  followups,
  deals,
  activities,
  onNavigate,
  onCompleteFollowUp,
}: DashboardViewProps) {
  const todayStr = '2026-09-04';

  // 1. KPI Calculations derived strictly from state
  const totalLeads = leads.length;
  const activeCustomers = leads.filter((l) => l.stage === 'Deal').length;
  const todayFollowUps = followups.filter(
    (f) => f.dueDate === todayStr && f.status === 'Pending'
  );
  const overdueFollowUps = followups.filter((f) => f.status === 'Terlambat');
  const urgentFollowUps = [...overdueFollowUps, ...todayFollowUps];

  const successfulDeals = deals.filter(
    (d) => d.status === 'Lunas' || d.status === 'DP Diterima'
  );
  const totalRevenue = successfulDeals.reduce((sum, d) => sum + d.dealValue, 0);

  const conversionRate =
    totalLeads > 0
      ? Math.round((successfulDeals.length / totalLeads) * 100)
      : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Lead */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D]">
            <span className="text-xs font-semibold">Total Lead</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E]">
            {totalLeads}
          </div>
          <p className="text-[11px] text-[#64756D]">Database prospek masuk</p>
        </div>

        {/* Customer Aktif */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D]">
            <span className="text-xs font-semibold">Customer Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E]">
            {activeCustomers}
          </div>
          <p className="text-[11px] text-[#64756D]">Tahap closing / deal</p>
        </div>

        {/* Follow-up Hari Ini */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D]">
            <span className="text-xs font-semibold">Follow-up Perlu Aksi</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${urgentFollowUps.length > 0 ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#EAF8F1] text-[#16A36A]'}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E]">
            {urgentFollowUps.length}
          </div>
          <p className="text-[11px] text-[#64756D]">
            {overdueFollowUps.length > 0 ? `${overdueFollowUps.length} terlambat, ` : ''}
            {todayFollowUps.length} hari ini
          </p>
        </div>

        {/* Deal Berhasil */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D]">
            <span className="text-xs font-semibold">Deal Berhasil</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E]">
            {successfulDeals.length}
          </div>
          <p className="text-[11px] text-[#64756D]">DP diterima / lunas</p>
        </div>

        {/* Nilai Penjualan */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D]">
            <span className="text-xs font-semibold">Total Omset Closing</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E] truncate">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#64756D]">Total penjualan terverifikasi</p>
        </div>

        {/* Conversion Rate */}
        <div className="p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64756D]">
            <span className="text-xs font-semibold">Conversion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#16A36A]">
            {conversionRate}%
          </div>
          <p className="text-[11px] text-[#64756D]">Rasio lead ke closing</p>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2EAE5] flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider">
          Aksi Cepat Demo:
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('leads')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#16A36A] transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kelola Leads</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('pipeline')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-semibold hover:bg-white hover:border-[#16A36A] transition"
          >
            <span>Buka Pipeline</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('followup')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-semibold hover:bg-white hover:border-[#16A36A] transition"
          >
            <span>Jadwal Follow-up</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('deals')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7FAF8] border border-[#D1DDD6] text-[#0B3D2E] text-xs font-semibold hover:bg-white hover:border-[#16A36A] transition"
          >
            <span>Daftar Deal</span>
          </button>
        </div>
      </div>

      {/* 2-Column Section: Urgent Follow-up & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Follow-up Perlu Aksi */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2EAE5]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#16A36A]" />
              <h2 className="text-sm font-bold text-[#0B3D2E] uppercase tracking-wider">
                Follow-up Yang Perlu Dilakukan
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('followup')}
              className="text-xs font-bold text-[#16A36A] hover:text-[#0B3D2E] transition inline-flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {urgentFollowUps.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-[#E2EAE5] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#16A36A] mx-auto" />
              <div className="text-sm font-bold text-[#0B3D2E]">
                Semua Follow-up Beres!
              </div>
              <p className="text-xs text-[#64756D]">
                Tidak ada jadwal kontak tertunda untuk hari ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentFollowUps.slice(0, 4).map((fu) => {
                const isOverdue = fu.status === 'Terlambat';
                const cleanPhone = fu.leadPhone.replace(/\D/g, '');
                const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=Halo%20${encodeURIComponent(fu.leadName)},%20saya%20dari%20tim%20sales%20ingin%20follow-up%20terkait%20kebutuhan%20bisnis%20Anda.`;

                return (
                  <div
                    key={fu.id}
                    className="p-4 rounded-2xl bg-white border border-[#E2EAE5] hover:border-[#16A36A] transition shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#10231B]">
                            {fu.leadName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOverdue
                                ? 'bg-[#FEE2E2] text-[#DC2626]'
                                : 'bg-[#EAF8F1] text-[#16A36A]'
                            }`}
                          >
                            {isOverdue ? 'Terlambat' : 'Hari Ini'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#64756D]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#16A36A]" />
                            {fu.dueDate} {fu.dueTime ? `(${fu.dueTime})` : ''}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-[#0B3D2E]">{fu.type}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCompleteFollowUp(fu.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EAF8F1] hover:bg-[#16A36A] text-[#16A36A] hover:text-white transition text-xs font-bold shadow-2xs"
                        title="Tandai follow-up selesai"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selesai</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#64756D] bg-[#F7FAF8] p-2.5 rounded-xl border border-[#E2EAE5]">
                      {fu.notes}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[#64756D]">{fu.leadPhone}</span>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#16A36A] hover:text-[#0B3D2E] transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Aktivitas Terbaru */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2EAE5]">
            <h2 className="text-sm font-bold text-[#0B3D2E] uppercase tracking-wider">
              Aktivitas Terbaru
            </h2>
            <span className="text-xs text-[#64756D]">Live Timeline</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs">
            <div className="space-y-4">
              {activities.slice(0, 5).map((act, idx) => (
                <div key={act.id} className="relative pl-5 pb-4 last:pb-0 border-l border-[#E2EAE5]">
                  <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-[#16A36A] ring-4 ring-white" />
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#0B3D2E]">{act.title}</span>
                      <span className="text-[10px] text-[#64756D]">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#64756D] leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
