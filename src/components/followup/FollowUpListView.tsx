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
  Plus,
  Check
} from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
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
        className={`bg-white border rounded-xl p-4 transition-all duration-150 shadow-xs ${
          isOverdue
            ? 'border-rose-200 bg-rose-50/20'
            : isToday
            ? 'border-amber-200 bg-amber-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Lead identity & info */}
          <div
            onClick={() => onSelectLead(lead)}
            className="flex items-start gap-3 cursor-pointer flex-1 min-w-0"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-sm text-slate-900 hover:text-emerald-700 transition-colors truncate">
                  {lead.name}
                </h4>
                <StatusBadge status={lead.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {lead.product.split('—')[0].trim()} • {lead.city} • <span className="font-mono">{formatDisplayPhone(lead.phone)}</span>
              </p>
              {lead.initialNotes && (
                <p className="text-xs text-slate-600 italic mt-1 line-clamp-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block">
                  &quot;{lead.initialNotes}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Next follow-up info & action buttons */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
            <div className="text-left sm:text-right">
              <div
                className={`text-xs font-bold ${
                  isOverdue ? 'text-rose-600' : isToday ? 'text-amber-800' : 'text-slate-800'
                }`}
              >
                {formatIndonesianDate(lead.nextFollowUpDate)}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {lead.nextFollowUpTime || '10:00'} WIB
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                title="Chat WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenLogFollowUp(lead)}
                className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition-colors cursor-pointer active:scale-95 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Selesai</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectLead(lead)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
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
    <div className="space-y-5 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Follow Up Calon Pelanggan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau prioritas follow up prospek Anda hari ini.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddLead}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lead Baru</span>
        </button>
      </div>

      {/* Top Filter summary tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveGroup('all')}
          className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
            activeGroup === 'all'
              ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">Semua Jadwal</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{activeFollowUps.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('today')}
          className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
            activeGroup === 'today'
              ? 'bg-amber-50 border-amber-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Hari Ini</span>
          </div>
          <div className="text-xl font-bold text-amber-900 mt-0.5">{todayLeads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('overdue')}
          className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
            activeGroup === 'overdue'
              ? 'bg-rose-50 border-rose-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Terlambat</span>
          </div>
          <div className="text-xl font-bold text-rose-800 mt-0.5">{overdueLeads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('tomorrow')}
          className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
            activeGroup === 'tomorrow'
              ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Besok</span>
          </div>
          <div className="text-xl font-bold text-emerald-900 mt-0.5">{tomorrowLeads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('upcoming')}
          className={`col-span-2 sm:col-span-1 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
            activeGroup === 'upcoming'
              ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5 text-slate-500" />
            <span>Minggu Ini</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{upcomingLeads.length}</div>
        </button>
      </div>

      {/* 1. Hari Ini Section (Utama) */}
      {(activeGroup === 'all' || activeGroup === 'today') && todayLeads.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Hari Ini ({todayLeads.length})
            </h3>
            <span className="text-xs text-slate-500">— Prioritas follow up hari ini</span>
          </div>
          <div className="space-y-2.5">
            {todayLeads.map((lead) => renderLeadCard(lead, false, true))}
          </div>
        </div>
      )}

      {/* 2. Terlambat Section */}
      {(activeGroup === 'all' || activeGroup === 'overdue') && overdueLeads.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <h3 className="text-sm font-bold text-rose-800">
              Terlambat ({overdueLeads.length})
            </h3>
            <span className="text-xs text-slate-500">— Melewati tanggal jadwal yang ditentukan</span>
          </div>
          <div className="space-y-2.5">
            {overdueLeads.map((lead) => renderLeadCard(lead, true, false))}
          </div>
        </div>
      )}

      {/* 3. Besok Section */}
      {(activeGroup === 'all' || activeGroup === 'tomorrow') && tomorrowLeads.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Besok ({tomorrowLeads.length})
            </h3>
            <span className="text-xs text-slate-500">— Jadwal follow up untuk esok hari</span>
          </div>
          <div className="space-y-2.5">
            {tomorrowLeads.map((lead) => renderLeadCard(lead, false, false))}
          </div>
        </div>
      )}

      {/* 4. Minggu Ini / Mendatang Section */}
      {(activeGroup === 'all' || activeGroup === 'upcoming') && upcomingLeads.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">
              Mendatang / Minggu Ini ({upcomingLeads.length})
            </h3>
            <span className="text-xs text-slate-500">— Jadwal beberapa hari ke depan</span>
          </div>
          <div className="space-y-2.5">
            {upcomingLeads.map((lead) => renderLeadCard(lead, false, false))}
          </div>
        </div>
      )}

      {/* Empty States for specific tabs */}
      {activeGroup === 'today' && todayLeads.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs">
          <Clock className="w-7 h-7 text-amber-500 mx-auto mb-1.5 opacity-80" />
          <h4 className="text-xs font-bold text-slate-800 mb-0.5">Tidak ada follow up untuk hari ini</h4>
          <p className="text-xs text-slate-500">Semua jadwal follow up hari ini sudah selesai atau dijadwalkan di hari lain.</p>
        </div>
      )}

      {activeGroup === 'overdue' && overdueLeads.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1.5 opacity-80" />
          <h4 className="text-xs font-bold text-slate-800 mb-0.5">Tidak ada follow up yang terlambat</h4>
          <p className="text-xs text-slate-500">Luar biasa! Tidak ada lead yang melewati batas jadwal follow up.</p>
        </div>
      )}

      {activeGroup === 'tomorrow' && tomorrowLeads.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs">
          <Calendar className="w-7 h-7 text-emerald-600 mx-auto mb-1.5 opacity-80" />
          <h4 className="text-xs font-bold text-slate-800 mb-0.5">Tidak ada follow up untuk besok</h4>
          <p className="text-xs text-slate-500">Belum ada calon pelanggan yang dijadwalkan untuk esok hari.</p>
        </div>
      )}

      {activeGroup === 'upcoming' && upcomingLeads.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs">
          <CalendarClock className="w-7 h-7 text-slate-400 mx-auto mb-1.5 opacity-80" />
          <h4 className="text-xs font-bold text-slate-800 mb-0.5">Tidak ada follow up mendatang</h4>
          <p className="text-xs text-slate-500">Belum ada jadwal follow up untuk beberapa hari ke depan.</p>
        </div>
      )}

      {/* Empty State when no active follow-ups at all */}
      {activeFollowUps.length === 0 && activeGroup === 'all' && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-xl">
            🎉
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">Tidak ada jadwal follow up aktif</h4>
          <p className="text-xs text-slate-500 mb-4">Semua follow up Anda sudah selesai. Kerja luar biasa!</p>
          <button
            type="button"
            onClick={onOpenAddLead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Lead Baru</span>
          </button>
        </div>
      )}
    </div>
  );
};