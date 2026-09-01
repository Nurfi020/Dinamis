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
  FileText, 
  RotateCcw, 
  Trash2 
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  formatIndonesianDate, 
  formatFullIndonesianDate, 
  formatDisplayPhone, 
  generateWhatsAppUrl, 
  isDateOverdue,
  isDateToday,
  formatRupiah
} from '../../utils/helpers';

interface LeadDetailViewProps {
  lead: Lead;
  onBack: () => void;
  onOpenLogFollowUp: () => void;
  onQuickStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (leadId: string) => void;
}

export const LeadDetailView: React.FC<LeadDetailViewProps> = ({
  lead,
  onBack,
  onOpenLogFollowUp,
  onQuickStatusChange,
  onEditLead,
  onDeleteLead,
}) => {
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
    <div className="space-y-5 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Lead</span>
        </button>

        <div className="flex items-center gap-2">
          {onEditLead && (
            <button
              type="button"
              onClick={() => onEditLead(lead)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Data</span>
            </button>
          )}
          {onDeleteLead && (
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Hapus Lead"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hapus</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Lead identity */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-2xs shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {lead.name}
                </h2>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusPicker(!showStatusPicker)}
                    className="focus:outline-none cursor-pointer"
                    title="Klik untuk ubah status"
                  >
                    <StatusBadge status={lead.status} size="md" />
                  </button>

                  {/* Status Dropdown Picker */}
                  {showStatusPicker && (
                    <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 space-y-0.5 animate-in fade-in duration-100">
                      <div className="text-[10px] text-slate-500 px-2 py-1 font-bold uppercase tracking-wider">
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
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            lead.status === s
                              ? 'bg-emerald-50 text-emerald-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{s}</span>
                          {lead.status === s && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-meta */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-1.5">
                <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                  {formatRupiah(lead.value)}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-medium text-slate-800">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  {lead.product}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {lead.city}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-mono text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {formatDisplayPhone(lead.phone)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {lead.status === 'Tidak Berhasil' && (
              <button
                type="button"
                onClick={onOpenLogFollowUp}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Buka Kembali</span>
              </button>
            )}

            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Catat Follow Up */}
            <button
              type="button"
              onClick={onOpenLogFollowUp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Follow Up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Detail Info & Follow Up Schedule (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Next Follow Up Schedule Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-emerald-600" />
                <span>Jadwal Follow Up</span>
              </h3>
              {lead.nextFollowUpDate && lead.status !== 'Closing' && lead.status !== 'Tidak Berhasil' && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${
                    isOverdue
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : isToday
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isOverdue ? 'Terlambat' : isToday ? 'Hari Ini' : 'Mendatang'}
                </span>
              )}
            </div>

            {lead.nextFollowUpDate && lead.status !== 'Closing' && lead.status !== 'Tidak Berhasil' ? (
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {formatFullIndonesianDate(lead.nextFollowUpDate)}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {lead.nextFollowUpTime || '10:00'} WIB
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {isOverdue
                    ? '⚠️ Sudah melewati jadwal. Segera hubungi customer!'
                    : isToday
                    ? '🔔 Jadwal follow up hari ini. Hubungi via WhatsApp atau telepon.'
                    : '📅 Dijadwalkan untuk interaksi berikutnya.'}
                </p>

                <div className="pt-1.5">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Follow Up Sekarang</span>
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Tidak ada jadwal follow up aktif (Status: {lead.status}).
              </p>
            )}
          </div>

          {/* Informasi Calon Pelanggan Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Informasi Calon Pelanggan</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-medium">Estimasi Nilai Deal</span>
                <span className="font-bold text-sm text-slate-900 font-mono">
                  {formatRupiah(lead.value)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nama Lengkap</span>
                <span className="font-semibold text-slate-900">{lead.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nomor WhatsApp</span>
                <span className="font-mono font-medium text-slate-900">
                  {formatDisplayPhone(lead.phone)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Kota Domisili</span>
                <span className="font-medium text-slate-800">{lead.city}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Produk Peminatan</span>
                <span className="font-medium text-slate-800">{lead.product}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sumber Informasi</span>
                <SourceBadge source={lead.source} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status Saat Ini</span>
                <StatusBadge status={lead.status} size="sm" />
              </div>

              {lead.lostReason && (
                <div className="flex items-center justify-between">
                  <span className="text-rose-600">Alasan Lost</span>
                  <span className="font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                    {lead.lostReason}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Follow Up Terakhir</span>
                <span className="font-medium text-slate-800">
                  {lead.lastFollowUpDate ? formatFullIndonesianDate(lead.lastFollowUpDate) : 'Belum ada'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tanggal Masuk</span>
                <span className="font-medium text-slate-800">
                  {formatFullIndonesianDate(lead.createdAt)}
                </span>
              </div>
            </div>

            {/* Initial Notes */}
            {lead.initialNotes && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Catatan Awal:
                </span>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                  &quot;{lead.initialNotes}&quot;
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Riwayat Follow Up Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Riwayat Interaksi Follow Up</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total {lead.followUps.length} catatan aktivitas tersimpan
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenLogFollowUp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Catat Follow Up</span>
            </button>
          </div>

          {/* Timeline list */}
          {lead.followUps.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              <Clock className="w-7 h-7 text-emerald-600 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-slate-800 mb-1">Belum ada riwayat follow up</p>
              <p>Klik tombol &quot;+ Catat Follow Up&quot; di atas untuk menambahkan hasil interaksi pertama.</p>
            </div>
          ) : (
            <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {lead.followUps
                .slice()
                .reverse()
                .map((log) => {
                  return (
                    <div key={log.id} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-5 top-2 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />

                      <div className="bg-slate-50/70 border border-slate-200 group-hover:border-slate-300 group-hover:bg-white rounded-xl p-3.5 space-y-2 transition-colors">
                        {/* Header: Date + Time + Method */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {formatFullIndonesianDate(log.date)}
                            </span>
                            <span className="text-xs font-mono text-slate-500">• {log.time} WIB</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium flex items-center gap-1">
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              {log.method}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                              {log.result}
                            </span>
                          </div>
                        </div>

                        {/* Status Change Arrow */}
                        {log.oldStatus && log.oldStatus !== log.newStatus && (
                          <div className="flex items-center gap-1.5 text-xs font-medium pt-0.5">
                            <span className="text-slate-500">Status:</span>
                            <StatusBadge status={log.oldStatus} size="sm" />
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <StatusBadge status={log.newStatus} size="sm" />
                          </div>
                        )}

                        {/* Lost reason */}
                        {log.lostReason && (
                          <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                            <b>Alasan:</b> {log.lostReason}
                          </div>
                        )}

                        {/* Notes */}
                        {log.notes && (
                          <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                            {log.notes}
                          </p>
                        )}

                        {/* Next Follow Up Scheduled */}
                        {log.nextFollowUpDate && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                            <CalendarClock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              Jadwal berikutnya:{' '}
                              <b className="text-slate-800">
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

      {/* Delete Lead Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (onDeleteLead) {
            onDeleteLead(lead.id);
          }
        }}
        title="Hapus Calon Pelanggan?"
        message={`Apakah Anda yakin ingin menghapus lead "${lead.name}"? Data ini akan dihapus dari sistem dan tidak dapat dikembalikan.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDestructive={true}
      />
    </div>
  );
};