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
  Plus,
  Check
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
  const [activeGroup, setActiveGroup] = useState<'all' | 'today' | 'overdue' | 'tomorrow' | 'upcoming'>('all');

  // Categorize leads with scheduled follow-ups
  const activeFollowUps = leads.filter(
    (l) => l.nextFollowUpDate && l.status !== 'Closing' && l.status !== 'Tidak Berhasil'
  );

  const overdueLeads = activeFollowUps.filter((l) => isDateOverdue(l.nextFollowUpDate));
  const todayLeads = activeFollowUps.filter((l) => isDateToday(l.nextFollowUpDate));
  
  // Check tomorrow vs future
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const tomorrowLeads = activeFollowUps.filter((l) => l.nextFollowUpDate === tomorrowStr);
  const upcomingLeads = activeFollowUps.filter((l) => isDateUpcoming(l.nextFollowUpDate) && l.nextFollowUpDate !== tomorrowStr);

  const renderLeadCard = (lead: Lead, isOverdue: boolean, isToday: boolean) => {
    const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
    const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);

    return (
      <div
        key={lead.id}
        className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md ${
          isOverdue
            ? 'border-rose-300 bg-rose-50/30'
            : isToday
            ? 'border-amber-300 bg-amber-50/30'
            : 'border-[#E2E9E4] hover:border-[#00A651]/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Lead identity & info */}
          <div
            onClick={() => onSelectLead(lead)}
            className="flex items-start gap-3.5 cursor-pointer flex-1 min-w-0"
          >
            <div className="w-11 h-11 rounded-xl bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-base text-[#17221C] hover:text-[#006B3C] transition-colors truncate">
                  {lead.name}
                </h4>
                <StatusBadge status={lead.status} size="sm" />
              </div>
              <p className="text-xs text-[#66736B] mt-0.5">
                {lead.product.split('—')[0].trim()} • {lead.city} • <span className="font-mono">{formatDisplayPhone(lead.phone)}</span>
              </p>
              {lead.initialNotes && (
                <p className="text-xs text-[#66736B] italic mt-1 line-clamp-1 bg-[#F7F9F8] px-2 py-0.5 rounded-lg inline-block border border-[#E2E9E4]">
                  "{lead.initialNotes}"
                </p>
              )}
            </div>
          </div>

          {/* Next follow-up info & action buttons */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E9E4] shrink-0">
            <div className="text-left sm:text-right">
              <div
                className={`text-xs font-bold ${
                  isOverdue ? 'text-rose-600' : isToday ? 'text-amber-800' : 'text-[#17221C]'
                }`}
              >
                {formatIndonesianDate(lead.nextFollowUpDate)}
              </div>
              <div className="text-[11px] font-mono text-[#66736B]">
                {lead.nextFollowUpTime || '10:00'} WIB
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E8F7EF] hover:bg-[#00A651] text-[#006B3C] hover:text-white border border-[#A7F3D0] text-xs font-bold transition-all shadow-xs"
                title="Chat WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenLogFollowUp(lead)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Sudah Follow Up</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectLead(lead)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-[#66736B] hover:text-[#17221C] border border-[#E2E9E4] transition-colors cursor-pointer"
                title="Lihat Detail"
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
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
            Jadwal Follow Up Calon Pelanggan
          </h2>
          <p className="text-xs sm:text-sm text-[#66736B] mt-0.5">
            Siapa yang harus Anda hubungi hari ini? Pantau prioritas prospek Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddLead}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lead Baru</span>
        </button>
      </div>

      {/* Top Filter summary tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setActiveGroup('all')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGroup === 'all'
              ? 'bg-[#E8F7EF] border-[#00A651] shadow-xs'
              : 'bg-white border-[#E2E9E4] hover:border-[#00A651]/40'
          }`}
        >
          <div className="text-xs font-semibold text-[#66736B]">Semua Jadwal</div>
          <div className="text-2xl font-bold text-[#17221C] mt-1">{activeFollowUps.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('today')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGroup === 'today'
              ? 'bg-amber-50 border-amber-400 shadow-xs'
              : 'bg-white border-[#E2E9E4] hover:border-amber-400'
          }`}
        >
          <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Hari Ini</span>
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-1">{todayLeads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('overdue')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGroup === 'overdue'
              ? 'bg-rose-50 border-rose-400 shadow-xs'
              : 'bg-white border-[#E2E9E4] hover:border-rose-400'
          }`}
        >
          <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Terlambat</span>
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{overdueLeads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('tomorrow')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGroup === 'tomorrow'
              ? 'bg-[#E8F7EF] border-[#00A651] shadow-xs'
              : 'bg-white border-[#E2E9E4] hover:border-[#00A651]/40'
          }`}
        >
          <div className="text-xs font-bold text-[#006B3C] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#00A651]" />
            <span>Besok</span>
          </div>
          <div className="text-2xl font-bold text-[#006B3C] mt-1">{tomorrowLeads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('upcoming')}
          className={`col-span-2 sm:col-span-1 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGroup === 'upcoming'
              ? 'bg-emerald-50 border-emerald-400 shadow-xs'
              : 'bg-white border-[#E2E9E4] hover:border-emerald-400'
          }`}
        >
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Minggu Ini</span>
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{upcomingLeads.length}</div>
        </button>
      </div>

      {/* 1. Hari Ini Section (Utama) */}
      {(activeGroup === 'all' || activeGroup === 'today') && todayLeads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <h3 className="text-base font-bold text-amber-800">
              Hari Ini ({todayLeads.length})
            </h3>
            <span className="text-xs text-[#66736B]">— Wajib dihubungi hari ini</span>
          </div>
          <div className="space-y-3">
            {todayLeads.map((lead) => renderLeadCard(lead, false, true))}
          </div>
        </div>
      )}

      {/* 2. Terlambat Section */}
      {(activeGroup === 'all' || activeGroup === 'overdue') && overdueLeads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <h3 className="text-base font-bold text-rose-700">
              Terlambat ({overdueLeads.length})
            </h3>
            <span className="text-xs text-[#66736B]">— Melewati tanggal jadwal yang ditentukan</span>
          </div>
          <div className="space-y-3">
            {overdueLeads.map((lead) => renderLeadCard(lead, true, false))}
          </div>
        </div>
      )}

      {/* 3. Besok Section */}
      {(activeGroup === 'all' || activeGroup === 'tomorrow') && tomorrowLeads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A651]" />
            <h3 className="text-base font-bold text-[#006B3C]">
              Besok ({tomorrowLeads.length})
            </h3>
            <span className="text-xs text-[#66736B]">— Jadwal follow up untuk esok hari</span>
          </div>
          <div className="space-y-3">
            {tomorrowLeads.map((lead) => renderLeadCard(lead, false, false))}
          </div>
        </div>
      )}

      {/* 4. Minggu Ini / Mendatang Section */}
      {(activeGroup === 'all' || activeGroup === 'upcoming') && upcomingLeads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-base font-bold text-emerald-800">
              Mendatang / Minggu Ini ({upcomingLeads.length})
            </h3>
            <span className="text-xs text-[#66736B]">— Jadwal beberapa hari ke depan</span>
          </div>
          <div className="space-y-3">
            {upcomingLeads.map((lead) => renderLeadCard(lead, false, false))}
          </div>
        </div>
      )}

      {/* Empty State when no follow-ups */}
      {activeFollowUps.length === 0 && (
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F7EF] text-[#00A651] border border-[#A7F3D0] flex items-center justify-center mx-auto mb-3 shadow-xs text-2xl">
            🎉
          </div>
          <h4 className="text-base font-bold text-[#17221C] mb-1">Tidak ada follow up hari ini 🎉</h4>
          <p className="text-sm text-[#66736B] mb-5">Semua follow up Anda sudah selesai. Kerja luar biasa!</p>
          <button
            type="button"
            onClick={onOpenAddLead}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00A651] hover:bg-[#006B3C] text-white rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Lead Baru</span>
          </button>
        </div>
      )}
    </div>
  );
};