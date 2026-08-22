'use client';

import React, { useState } from 'react';
import { 
  CalendarClock, 
  AlertCircle, 
  Clock, 
  Calendar, 
  MessageCircle, 
  ChevronRight, 
  CheckCircle2, 
  Phone,
  Plus
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { 
  formatIndonesianDate, 
  formatDisplayPhone, 
  generateWhatsAppUrl,
  isDateOverdue,
  isDateToday,
  isDateUpcoming
} from '../../utils/helpers';

interface FollowUpListViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onOpenLogFollowUp: (lead: Lead) => void;
  onOpenAddLead: () => void;
}

export const FollowUpListView: React.FC<FollowUpListViewProps> = ({
  leads,
  onSelectLead,
  onOpenLogFollowUp,
  onOpenAddLead,
}) => {
  const [activeGroup, setActiveGroup] = useState<'all' | 'today' | 'overdue' | 'upcoming'>('all');

  // Categorize leads with scheduled follow-ups
  const activeFollowUps = leads.filter(
    (l) => l.nextFollowUpDate && l.status !== 'Closing' && l.status !== 'Tidak Berhasil'
  );

  const overdueLeads = activeFollowUps.filter((l) => isDateOverdue(l.nextFollowUpDate));
  const todayLeads = activeFollowUps.filter((l) => isDateToday(l.nextFollowUpDate));
  const upcomingLeads = activeFollowUps.filter((l) => isDateUpcoming(l.nextFollowUpDate));

  const renderLeadCard = (lead: Lead, isOverdue: boolean, isToday: boolean) => {
    const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
    const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);

    return (
      <div
        key={lead.id}
        className={`bg-[#0B1B2E] border rounded-2xl p-4 transition-all duration-200 shadow-md ${
          isOverdue
            ? 'border-red-500/40 bg-gradient-to-r from-red-950/20 to-[#0B1B2E]'
            : isToday
            ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 to-[#0B1B2E]'
            : 'border-[#17324D] hover:border-[#168BFF]/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Lead identity & info */}
          <div
            onClick={() => onSelectLead(lead)}
            className="flex items-start gap-3 cursor-pointer flex-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0E233D] border border-[#17324D] flex items-center justify-center font-bold text-sm text-[#22D3EE] shrink-0 mt-0.5">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-base text-[#F8FAFC] hover:text-[#22D3EE] transition-colors">
                  {lead.name}
                </h4>
                <StatusBadge status={lead.status} size="sm" />
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {lead.product} · {lead.city}
              </p>
              {lead.initialNotes && (
                <p className="text-xs text-slate-400 italic mt-1 line-clamp-1">
                  "{lead.initialNotes}"
                </p>
              )}
            </div>
          </div>

          {/* Time & Action buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#17324D]/60 shrink-0">
            <div className="text-left sm:text-right">
              <div
                className={`text-xs font-bold ${
                  isOverdue ? 'text-red-400' : isToday ? 'text-amber-400' : 'text-[#F8FAFC]'
                }`}
              >
                {formatIndonesianDate(lead.nextFollowUpDate)}
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8]">
                {lead.nextFollowUpTime || '10:00'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105"
                title="Chat WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => onOpenLogFollowUp(lead)}
                className="px-3 py-2 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white font-semibold text-xs transition-all shadow-[0_0_12px_rgba(22,139,255,0.3)]"
              >
                + Hasil
              </button>

              <button
                type="button"
                onClick={() => onSelectLead(lead)}
                className="p-2 rounded-xl bg-[#0E233D] hover:bg-[#17324D] text-[#94A3B8] hover:text-white border border-[#17324D]"
                title="Detail"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Filter summary tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveGroup('all')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            activeGroup === 'all'
              ? 'bg-[#168BFF]/20 border-[#168BFF] shadow-[0_0_15px_rgba(22,139,255,0.25)]'
              : 'bg-[#0B1B2E] border-[#17324D] hover:border-[#168BFF]/40'
          }`}
        >
          <div className="text-xs font-semibold text-[#94A3B8]">Semua Jadwal</div>
          <div className="text-2xl font-bold text-[#F8FAFC] mt-1">{activeFollowUps.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('overdue')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            activeGroup === 'overdue'
              ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              : 'bg-[#0B1B2E] border-[#17324D] hover:border-red-500/40'
          }`}
        >
          <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Terlambat</span>
          </div>
          <div className="text-2xl font-bold text-red-400 mt-1">{overdueLeads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('today')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            activeGroup === 'today'
              ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'bg-[#0B1B2E] border-[#17324D] hover:border-amber-500/40'
          }`}
        >
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Hari Ini</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{todayLeads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('upcoming')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            activeGroup === 'upcoming'
              ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              : 'bg-[#0B1B2E] border-[#17324D] hover:border-emerald-500/40'
          }`}
        >
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Mendatang</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{upcomingLeads.length}</div>
        </button>
      </div>

      {/* 1. Terlambat Section */}
      {(activeGroup === 'all' || activeGroup === 'overdue') && overdueLeads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-base font-bold text-red-400">
              Terlambat ({overdueLeads.length})
            </h3>
            <span className="text-xs text-[#94A3B8]">— Melewati tanggal yang dijadwalkan</span>
          </div>
          <div className="space-y-3">
            {overdueLeads.map((lead) => renderLeadCard(lead, true, false))}
          </div>
        </div>
      )}

      {/* 2. Hari Ini Section */}
      {(activeGroup === 'all' || activeGroup === 'today') && todayLeads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h3 className="text-base font-bold text-amber-400">
              Hari Ini ({todayLeads.length})
            </h3>
            <span className="text-xs text-[#94A3B8]">— Jadwal follow up untuk hari ini</span>
          </div>
          <div className="space-y-3">
            {todayLeads.map((lead) => renderLeadCard(lead, false, true))}
          </div>
        </div>
      )}

      {/* 3. Mendatang Section */}
      {(activeGroup === 'all' || activeGroup === 'upcoming') && upcomingLeads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-base font-bold text-emerald-400">
              Mendatang ({upcomingLeads.length})
            </h3>
            <span className="text-xs text-[#94A3B8]">— Jadwal beberapa hari ke depan</span>
          </div>
          <div className="space-y-3">
            {upcomingLeads.map((lead) => renderLeadCard(lead, false, false))}
          </div>
        </div>
      )}

      {activeFollowUps.length === 0 && (
        <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-8 text-center text-xs text-[#94A3B8]">
          <CalendarClock className="w-10 h-10 text-[#168BFF]/40 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#F8FAFC] mb-1">Semua follow up selesai!</h4>
          <p className="mb-4">Tidak ada calon pelanggan yang menunggu follow up saat ini.</p>
          <button
            type="button"
            onClick={onOpenAddLead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#168BFF] text-white rounded-xl font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Lead Baru</span>
          </button>
        </div>
      )}
    </div>
  );
};
