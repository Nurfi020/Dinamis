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
  isDateToday
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
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4FBF7] text-[#66736B] hover:text-[#17221C] border border-[#E2E9E4] text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Lead</span>
        </button>

        <div className="flex items-center gap-2">
          {onEditLead && (
            <button
              type="button"
              onClick={() => onEditLead(lead)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4FBF7] text-[#66736B] hover:text-[#17221C] border border-[#E2E9E4] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Lead identity */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00A651] flex items-center justify-center text-white font-black text-xl shadow-sm shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
                  {lead.name}
                </h2>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusPicker(!showStatusPicker)}
                    className="focus:outline-none cursor-pointer"
                    title="Klik untuk ubah status"
                  >
                    <StatusBadge status={lead.status} size="lg" />
                  </button>

                  {/* Status Dropdown Picker */}
                  {showStatusPicker && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-[#E2E9E4] rounded-2xl shadow-xl p-2 z-30 space-y-1">
                      <div className="text-[10px] text-[#66736B] px-2 py-1 font-bold uppercase tracking-wider">
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
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            lead.status === s
                              ? 'bg-[#E8F7EF] text-[#006B3C]'
                              : 'text-[#66736B] hover:text-[#17221C] hover:bg-[#F4FBF7]'
                          }`}
                        >
                          <span>{s}</span>
                          {lead.status === s && <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#66736B] mt-2">
                <span className="flex items-center gap-1 font-semibold text-[#17221C]">
                  <Package className="w-3.5 h-3.5 text-[#00A651]" />
                  {lead.product}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00A651]" />
                  {lead.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#00A651]" />
                  {formatDisplayPhone(lead.phone)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {lead.status === 'Tidak Berhasil' && (
              <button
                type="button"
                onClick={onOpenLogFollowUp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Buka Kembali Prospek</span>
              </button>
            )}

            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8F7EF] hover:bg-[#00A651] text-[#006B3C] hover:text-white border border-[#A7F3D0] text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp</span>
            </a>

            {/* Catat Follow Up */}
            <button
              type="button"
              onClick={onOpenLogFollowUp}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
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
          <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#17221C] flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-[#00A651]" />
                <span>Jadwal Follow Up</span>
              </h3>
              {lead.nextFollowUpDate && lead.status !== 'Closing' && lead.status !== 'Tidak Berhasil' && (
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isOverdue
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : isToday
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isOverdue ? 'Terlambat' : isToday ? 'Hari Ini' : 'Mendatang'}
                </span>
              )}
            </div>

            {lead.nextFollowUpDate && lead.status !== 'Closing' && lead.status !== 'Tidak Berhasil' ? (
              <div className="p-4 bg-[#F7F9F8] rounded-2xl border border-[#E2E9E4] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold text-[#17221C]">
                    {formatFullIndonesianDate(lead.nextFollowUpDate)}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#006B3C]">
                    {lead.nextFollowUpTime || '10:00'} WIB
                  </span>
                </div>
                <p className="text-xs text-[#66736B]">
                  {isOverdue
                    ? '⚠️ Sudah melewati jadwal. Segera hubungi customer!'
                    : isToday
                    ? '🔔 Jadwal follow up hari ini. Hubungi via WhatsApp atau telepon.'
                    : '📅 Dijadwalkan untuk interaksi berikutnya.'}
                </p>

                <div className="pt-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Follow Up Sekarang</span>
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#66736B] italic">
                Tidak ada jadwal follow up aktif (Status: {lead.status}).
              </p>
            )}
          </div>

          {/* Informasi Calon Pelanggan Card */}
          <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-3.5">
            <h3 className="text-sm font-bold text-[#17221C] flex items-center gap-2 border-b border-[#E2E9E4] pb-2">
              <FileText className="w-4 h-4 text-[#00A651]" />
              <span>Informasi Calon Pelanggan</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#66736B]">Nama Lengkap</span>
                <span className="font-bold text-[#17221C]">{lead.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#66736B]">Nomor WhatsApp</span>
                <span className="font-mono font-semibold text-[#17221C]">
                  {formatDisplayPhone(lead.phone)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#66736B]">Kota Domisili</span>
                <span className="font-semibold text-[#17221C]">{lead.city}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#66736B]">Produk Peminatan</span>
                <span className="font-semibold text-[#17221C]">{lead.product}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#66736B]">Sumber Informasi</span>
                <SourceBadge source={lead.source} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#66736B]">Status Saat Ini</span>
                <StatusBadge status={lead.status} size="sm" />
              </div>

              {lead.lostReason && (
                <div className="flex items-center justify-between">
                  <span className="text-rose-600">Alasan Lost</span>
                  <span className="font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {lead.lostReason}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#66736B]">Follow Up Terakhir</span>
                <span className="font-medium text-[#17221C]">
                  {lead.lastFollowUpDate ? formatFullIndonesianDate(lead.lastFollowUpDate) : 'Belum ada'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#66736B]">Tanggal Masuk</span>
                <span className="font-medium text-[#17221C]">
                  {formatFullIndonesianDate(lead.createdAt)}
                </span>
              </div>
            </div>

            {/* Initial Notes */}
            {lead.initialNotes && (
              <div className="pt-2 border-t border-[#E2E9E4]">
                <span className="text-[11px] font-bold text-[#66736B] block mb-1">
                  Catatan Awal:
                </span>
                <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] text-xs text-[#17221C] leading-relaxed italic">
                  "{lead.initialNotes}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Riwayat Follow Up Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E9E4] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#17221C]">Riwayat Interaksi Follow Up</h3>
              <p className="text-xs text-[#66736B] mt-0.5">
                Total {lead.followUps.length} catatan aktivitas tersimpan
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenLogFollowUp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E8F7EF] hover:bg-[#00A651] text-[#006B3C] hover:text-white border border-[#A7F3D0] text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Catat Follow Up</span>
            </button>
          </div>

          {/* Timeline list */}
          {lead.followUps.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#66736B]">
              <Clock className="w-8 h-8 text-[#00A651] mx-auto mb-2" />
              <p className="font-bold text-[#17221C] mb-1">Belum ada riwayat follow up</p>
              <p>Klik tombol "+ Catat Follow Up" di atas untuk menambahkan hasil interaksi pertama.</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E9E4]">
              {lead.followUps
                .slice()
                .reverse()
                .map((log) => {
                  return (
                    <div key={log.id} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#00A651] ring-4 ring-white shadow-xs" />

                      <div className="bg-[#F7F9F8] border border-[#E2E9E4] group-hover:border-[#00A651]/50 group-hover:bg-white rounded-2xl p-4 space-y-2.5 transition-all">
                        {/* Header: Date + Time + Method */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#17221C]">
                              {formatFullIndonesianDate(log.date)}
                            </span>
                            <span className="text-xs font-mono text-[#66736B]">• {log.time} WIB</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-white text-[#17221C] border border-[#E2E9E4] font-semibold flex items-center gap-1.5">
                              <MessageCircle className="w-3 h-3 text-[#00A651]" />
                              {log.method}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#E8F7EF] text-[#006B3C] font-bold border border-[#A7F3D0]">
                              {log.result}
                            </span>
                          </div>
                        </div>

                        {/* Status Change Arrow */}
                        {log.oldStatus && log.oldStatus !== log.newStatus && (
                          <div className="flex items-center gap-2 text-xs font-semibold pt-1">
                            <span className="text-[#66736B]">Perubahan Status:</span>
                            <StatusBadge status={log.oldStatus} size="sm" />
                            <ArrowRight className="w-3.5 h-3.5 text-[#00A651]" />
                            <StatusBadge status={log.newStatus} size="sm" />
                          </div>
                        )}

                        {/* Lost reason */}
                        {log.lostReason && (
                          <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                            <b>Alasan Tidak Berhasil:</b> {log.lostReason}
                          </div>
                        )}

                        {/* Notes */}
                        {log.notes && (
                          <p className="text-xs text-[#17221C] leading-relaxed bg-white p-3 rounded-xl border border-[#E2E9E4]">
                            {log.notes}
                          </p>
                        )}

                        {/* Next Follow Up Scheduled */}
                        {log.nextFollowUpDate && (
                          <div className="text-[11px] text-[#66736B] flex items-center gap-1.5 pt-1">
                            <CalendarClock className="w-3.5 h-3.5 text-[#00A651]" />
                            <span>
                              Jadwal berikutnya:{' '}
                              <b className="text-[#17221C]">
                                {formatIndonesianDate(log.nextFollowUpDate)}
                              </b>
                              {log.nextFollowUpTime && ` pukul ${log.nextFollowUpTime} WIB`}
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