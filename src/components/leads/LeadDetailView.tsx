'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Plus, 
  CalendarClock, 
  MapPin, 
  Package, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Share2, 
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
  FileText,
  RotateCcw,
  History,
  AlertTriangle
} from 'lucide-react';
import { Lead, LeadStatus, FollowUpLog } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { 
  formatIndonesianDate, 
  formatFullIndonesianDate, 
  formatDisplayPhone,
  generateWhatsAppUrl,
  isDateOverdue,
  isDateToday,
  getStatusTheme
} from '../../utils/helpers';

interface LeadDetailViewProps {
  lead: Lead;
  onBack: () => void;
  onOpenLogFollowUp: () => void;
  onQuickStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onEditLead?: (lead: Lead) => void;
}

export const LeadDetailView: React.FC<LeadDetailViewProps> = ({
  lead,
  onBack,
  onOpenLogFollowUp,
  onQuickStatusChange,
  onEditLead,
}) => {
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
  const isToday = isDateToday(lead.nextFollowUpDate);
  const isOverdue = isDateOverdue(lead.nextFollowUpDate);

  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const statuses: LeadStatus[] = ['Cold', 'Warm', 'Hot', 'Closing', 'Tidak Berhasil'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1B2E] hover:bg-[#0E233D] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#17324D] text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Lead</span>
        </button>

        <div className="flex items-center gap-2">
          {onEditLead && (
            <button
              type="button"
              onClick={() => onEditLead(lead)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1B2E] hover:bg-[#0E233D] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#17324D] text-xs font-medium transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#168BFF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Lead identity */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#168BFF] to-[#22D3EE] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(22,139,255,0.4)] shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
                  {lead.name}
                </h2>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusPicker(!showStatusPicker)}
                    className="focus:outline-none"
                    title="Klik untuk ubah status"
                  >
                    <StatusBadge status={lead.status} size="lg" />
                  </button>

                  {/* Status Dropdown Picker */}
                  {showStatusPicker && (
                    <div className="absolute left-0 mt-2 w-48 bg-[#0B1B2E] border border-[#17324D] rounded-xl shadow-2xl p-1.5 z-30 space-y-1">
                      <div className="text-[10px] text-[#94A3B8] px-2 py-1 font-semibold uppercase tracking-wider">
                        Ubah Status Langsung:
                      </div>
                      {statuses.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            onQuickStatusChange(lead.id, s);
                            setShowStatusPicker(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            lead.status === s
                              ? 'bg-[#168BFF] text-white'
                              : 'text-[#94A3B8] hover:text-white hover:bg-[#0E233D]'
                          }`}
                        >
                          <span>{s}</span>
                          {lead.status === s && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8] mt-2">
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <Package className="w-3.5 h-3.5 text-[#168BFF]" />
                  {lead.product}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                  {lead.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {formatDisplayPhone(lead.phone)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons matching specs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Reopen Button if status is Tidak Berhasil (Rule 9) */}
            {lead.status === 'Tidak Berhasil' && (
              <button
                type="button"
                onClick={onOpenLogFollowUp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Buka Kembali Prospek</span>
              </button>
            )}

            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp</span>
            </a>

            {/* Catat Follow Up */}
            <button
              type="button"
              onClick={onOpenLogFollowUp}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white text-xs font-bold shadow-[0_0_20px_rgba(22,139,255,0.4)] active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Catat Follow Up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Detail Info & Follow Up Schedule (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Next Follow Up Schedule Card */}
          <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-[#168BFF]" />
                <span>Jadwal Follow Up</span>
              </h3>
              {lead.nextFollowUpDate && lead.status !== 'Closing' && lead.status !== 'Tidak Berhasil' && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOverdue
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : isToday
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                      : 'bg-[#0E233D] text-[#94A3B8]'
                  }`}
                >
                  {isOverdue ? 'Terlambat' : isToday ? 'Hari Ini' : 'Mendatang'}
                </span>
              )}
            </div>

            {lead.nextFollowUpDate && lead.status !== 'Closing' && lead.status !== 'Tidak Berhasil' ? (
              <div className="p-3.5 bg-[#06111F] rounded-xl border border-[#17324D] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-extrabold text-[#F8FAFC]">
                    {formatFullIndonesianDate(lead.nextFollowUpDate)}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#22D3EE]">
                    {lead.nextFollowUpTime || '10:00'}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  {isOverdue
                    ? '⚠️ Sudah melewati jadwal. Segera hubungi customer!'
                    : isToday
                    ? '🎯 Jadwal follow up hari ini. Hubungi via WhatsApp atau telepon.'
                    : '📅 Dijadwalkan untuk follow up berikutnya.'}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Follow Up Sekarang</span>
                  </a>
                  <button
                    type="button"
                    onClick={onOpenLogFollowUp}
                    className="px-3 py-2 rounded-lg bg-[#0E233D] hover:bg-[#168BFF] text-[#F8FAFC] border border-[#17324D] text-xs font-semibold"
                  >
                    Hasil
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#06111F] rounded-xl border border-[#17324D] text-center text-xs text-[#94A3B8]">
                <p>
                  {lead.status === 'Closing'
                    ? '🎉 Prospek sudah closing (deal).'
                    : lead.status === 'Tidak Berhasil'
                    ? 'Prospek status tidak berhasil.'
                    : 'Belum ada jadwal follow up berikutnya.'}
                </p>
                {lead.status !== 'Closing' && (
                  <button
                    type="button"
                    onClick={onOpenLogFollowUp}
                    className="mt-2 text-xs text-[#168BFF] hover:underline font-semibold"
                  >
                    + Jadwalkan Sekarang
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Full Lead Information Card */}
          <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-[#F8FAFC] border-b border-[#17324D] pb-3">
              Informasi Calon Pelanggan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Nama Lengkap</span>
                <span className="font-semibold text-[#F8FAFC]">{lead.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Nomor WhatsApp</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {formatDisplayPhone(lead.phone)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Kota Domisili</span>
                <span className="font-semibold text-[#F8FAFC]">{lead.city}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Produk Peminatan</span>
                <span className="font-semibold text-[#F8FAFC]">{lead.product}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Sumber Informasi</span>
                <SourceBadge source={lead.source} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Status Saat Ini</span>
                <StatusBadge status={lead.status} size="sm" />
              </div>

              {lead.lostReason && (
                <div className="flex items-center justify-between">
                  <span className="text-red-400">Alasan Lost</span>
                  <span className="font-medium text-red-300 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
                    {lead.lostReason}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Follow Up Terakhir</span>
                <span className="font-medium text-slate-300">
                  {lead.lastFollowUpDate ? formatFullIndonesianDate(lead.lastFollowUpDate) : 'Belum ada'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Tanggal Lead Masuk</span>
                <span className="font-medium text-slate-300">
                  {formatFullIndonesianDate(lead.createdAt)}
                </span>
              </div>
            </div>

            {/* Initial Notes */}
            {lead.initialNotes && (
              <div className="pt-2 border-t border-[#17324D]">
                <span className="text-[11px] font-semibold text-[#94A3B8] block mb-1">
                  Catatan Awal:
                </span>
                <div className="p-3 bg-[#06111F] rounded-xl border border-[#17324D] text-xs text-slate-300 leading-relaxed italic">
                  "{lead.initialNotes}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Riwayat Follow Up Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 sm:p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-[#17324D] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Riwayat Follow Up</h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Total {lead.followUps.length} interaksi tercatat
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenLogFollowUp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#168BFF]/20 hover:bg-[#168BFF]/30 text-[#22D3EE] border border-[#168BFF]/40 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Riwayat</span>
            </button>
          </div>

          {/* Timeline list */}
          {lead.followUps.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              <Clock className="w-8 h-8 text-[#168BFF]/40 mx-auto mb-2" />
              <p className="font-semibold text-[#F8FAFC] mb-1">Belum ada riwayat follow up</p>
              <p>Klik tombol "+ Catat Follow Up" di atas untuk menambahkan hasil interaksi pertama.</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#17324D]">
              {lead.followUps
                .slice()
                .reverse()
                .map((log) => {
                  return (
                    <div key={log.id} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#168BFF] ring-4 ring-[#0B1B2E] shadow-[0_0_10px_rgba(22,139,255,0.6)]" />

                      <div className="bg-[#06111F] border border-[#17324D] group-hover:border-[#168BFF]/40 rounded-xl p-4 space-y-2.5 transition-all">
                        {/* Header: Date + Time + Method */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#F8FAFC]">
                              {formatFullIndonesianDate(log.date)}
                            </span>
                            <span className="text-xs font-mono text-[#94A3B8]">· {log.time}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#0E233D] text-[#22D3EE] border border-[#17324D] font-medium flex items-center gap-1.5">
                              <MessageCircle className="w-3 h-3" />
                              {log.method}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-[#168BFF]/10 text-[#168BFF] font-semibold">
                              {log.result}
                            </span>
                          </div>
                        </div>

                        {/* Status Change Arrow if any */}
                        {log.oldStatus && log.oldStatus !== log.newStatus && (
                          <div className="flex items-center gap-2 text-xs font-medium pt-1">
                            <span className="text-[#94A3B8]">Perubahan Status:</span>
                            <StatusBadge status={log.oldStatus} size="sm" />
                            <ArrowRight className="w-3 h-3 text-[#22D3EE]" />
                            <StatusBadge status={log.newStatus} size="sm" />
                          </div>
                        )}

                        {/* Lost reason in log */}
                        {log.lostReason && (
                          <div className="text-xs text-red-400 bg-red-950/20 p-2 rounded border border-red-500/30">
                            <b>Alasan Tidak Berhasil:</b> {log.lostReason}
                          </div>
                        )}

                        {/* Notes */}
                        {log.notes && (
                          <p className="text-xs text-slate-300 leading-relaxed bg-[#0B1B2E]/60 p-2.5 rounded-lg border border-[#17324D]/60">
                            {log.notes}
                          </p>
                        )}

                        {/* Next Follow Up Scheduled */}
                        {log.nextFollowUpDate && (
                          <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5 pt-1">
                            <CalendarClock className="w-3 h-3 text-[#168BFF]" />
                            <span>
                              Jadwal berikutnya:{' '}
                              <b className="text-slate-200">
                                {formatIndonesianDate(log.nextFollowUpDate)}
                              </b>
                              {log.nextFollowUpTime && ` pukul ${log.nextFollowUpTime}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
