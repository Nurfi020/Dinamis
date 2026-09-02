'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Edit3,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Calendar,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  MessageCircle,
  HardHat
} from 'lucide-react';
import { Quotation, QuotationStatus } from '../../../types';
import { formatRupiah, formatFullIndonesianDate, formatIndonesianDate } from '../../../utils/helpers';
import { EditQuotationModal } from './EditQuotationModal';
import { ConfirmModal } from '../../common/ConfirmModal';

interface QuotationDetailViewProps {
  quotation: Quotation;
  onBack: () => void;
  onUpdateQuotation: (id: string, updatedData: Partial<Quotation>) => void;
  onDeleteQuotation: (id: string) => void;
  onCreateProject?: (quotation: Quotation) => void;
}

export const QuotationDetailView: React.FC<QuotationDetailViewProps> = ({
  quotation,
  onBack,
  onUpdateQuotation,
  onDeleteQuotation,
  onCreateProject,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleQuickStatusChange = (newStatus: QuotationStatus) => {
    onUpdateQuotation(quotation.id, { status: newStatus });
  };

  // WhatsApp intent message generator
  const getWhatsAppUrl = () => {
    const cleanPhone = quotation.clientPhone?.replace(/\D/g, '');
    const cleanNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = `Halo Bpk/Ibu ${quotation.clientName}, perkenalkan kami dari ${quotation.companyName}. Menindaklanjuti rencana proyek "${quotation.projectName}", kami telah menerbitkan Surat Penawaran Harga resmi no: ${quotation.quotationNumber} dengan nilai penawaran sebesar ${formatRupiah(quotation.grandTotal)}. Dokumen penawaran dan rincian spesifikasi siap kami kirimkan. Mohon informasinya bila ada yang perlu kami diskusikan. Terima kasih.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* 1. Navigation & Action Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar SPH</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
            {(['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'] as QuotationStatus[]).map((st) => {
              const isActive = quotation.status === st;
              return (
                <button
                  key={st}
                  onClick={() => handleQuickStatusChange(st)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                    isActive
                      ? st === 'Accepted'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : st === 'Sent'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : st === 'Rejected'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : st === 'Expired'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'Accepted' ? 'Deal SPK' : st}
                </button>
              );
            })}
          </div>

          {/* Terbitkan Proyek SPK Action */}
          {onCreateProject && quotation.status === 'Accepted' && (
            <button
              onClick={() => onCreateProject(quotation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Terbitkan Proyek Konstruksi (SPK Masuk) dari SPH ini"
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Terbitkan Proyek SPK</span>
            </button>
          )}

          {/* WhatsApp Direct Link */}
          {quotation.clientPhone && (
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Kirim Pesan WhatsApp ke Klien"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Kirim WA</span>
            </a>
          )}

          {/* Print / PDF Trigger */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak / PDF</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit SPH</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="Hapus SPH"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Official SPH Document Sheet (A4 Proportion & High-Polish Presentation) */}
      <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-800 text-xs sm:text-sm print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Letterhead Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b-2 border-slate-900">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold font-mono text-sm shadow-xs print:border print:border-slate-800">
                DK
              </div>
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                {quotation.companyName}
              </h1>
            </div>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              {quotation.companyAddress}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
              <span>Telp: <b className="font-mono text-slate-700">{quotation.companyPhone}</b></span>
              <span>•</span>
              <span>Email: <b className="text-slate-700">{quotation.companyEmail}</b></span>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 inline-block">
              {quotation.quotationNumber}
            </span>
            <p className="text-[11px] text-slate-500">
              Ref. RAB: <b className="font-mono text-slate-700">{quotation.rabNumber}</b>
            </p>
            <p className="text-xs font-semibold text-slate-700">
              {formatFullIndonesianDate(quotation.quotationDate)}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2 space-y-1">
          <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900 underline underline-offset-4 decoration-emerald-600">
            SURAT PENAWARAN HARGA (SPH)
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Nomor: {quotation.quotationNumber}
          </p>
        </div>

        {/* Client & Project Destination Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/90 rounded-xl border border-slate-200 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Kepada Yth. (Pemberi Tugas):
            </span>
            <p className="font-bold text-slate-900 text-sm">{quotation.clientName}</p>
            <div className="text-slate-600 space-y-0.5 text-[11px]">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span className="font-mono">{quotation.clientPhone}</span>
              </p>
              {quotation.clientEmail && (
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{quotation.clientEmail}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Informasi Proyek:
            </span>
            <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{quotation.projectName}</span>
            </p>
            <p className="text-slate-600 flex items-center gap-1.5 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{quotation.projectLocation} {quotation.buildingAreaM2 ? `(${quotation.buildingAreaM2} m²)` : ''}</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Masa Berlaku: <b className="text-slate-800">{quotation.validityDays} Hari Kalender</b> (s/d {formatIndonesianDate(quotation.validUntil)})
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
          <p>Dengan hormat,</p>
          <p>
            Sehubungan dengan rencana pelaksanaan pekerjaan proyek di atas, bersama surat ini kami dari <b>{quotation.companyName}</b> bermaksud mengajukan penawaran harga dan spesifikasi teknis pekerjaan konstruksi dengan rincian sebagai berikut:
          </p>
        </div>

        {/* Section 1: Scope of Work */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            1. Lingkup Pekerjaan
          </h3>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {quotation.workDescription}
          </div>
        </div>

        {/* Section 2: Financial Summary Breakdown */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            2. Rincian Nilai Penawaran Komersial
          </h3>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4">Komponen Biaya Konstruksi</th>
                  <th className="py-2.5 px-4 text-right">Nilai Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-400">1</td>
                  <td className="py-2.5 px-4 font-medium">Estimasi Pengadaan Material Konstruksi</td>
                  <td className="py-2.5 px-4 text-right font-mono">{formatRupiah(quotation.materialTotal)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-400">2</td>
                  <td className="py-2.5 px-4 font-medium">Estimasi Biaya Upah Tenaga Kerja & Tukang</td>
                  <td className="py-2.5 px-4 text-right font-mono">{formatRupiah(quotation.laborTotal)}</td>
                </tr>
                <tr className="bg-slate-50/70 font-semibold">
                  <td className="py-2.5 px-4 text-center font-mono text-slate-500"></td>
                  <td className="py-2.5 px-4 text-slate-900">Subtotal Biaya Pokok (HPP Riil)</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-900">{formatRupiah(quotation.subtotalCost)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-400">3</td>
                  <td className="py-2.5 px-4 font-medium">Biaya Overhead, Asuransi & Pengawasan ({quotation.overheadValue}%)</td>
                  <td className="py-2.5 px-4 text-right font-mono">+{formatRupiah(quotation.overheadAmount)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-400">4</td>
                  <td className="py-2.5 px-4 font-medium text-emerald-800">Margin Keuntungan & Pajak Kontraktor ({quotation.marginValue}%)</td>
                  <td className="py-2.5 px-4 text-right font-mono text-emerald-800 font-semibold">+{formatRupiah(quotation.marginAmount)}</td>
                </tr>
                {quotation.discountAmount > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-400">5</td>
                    <td className="py-2.5 px-4 font-medium text-rose-600">Potongan Diskon Khusus Proyek</td>
                    <td className="py-2.5 px-4 text-right font-mono text-rose-600 font-semibold">-{formatRupiah(quotation.discountAmount)}</td>
                  </tr>
                )}
                <tr className="bg-emerald-800 text-white font-bold text-xs sm:text-sm print:bg-slate-900 print:text-white">
                  <td className="py-3 px-4 text-center"></td>
                  <td className="py-3 px-4 uppercase tracking-wider">TOTAL NILAI PENAWARAN (GRAND TOTAL)</td>
                  <td className="py-3 px-4 text-right font-mono text-sm sm:text-base">
                    {formatRupiah(quotation.grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Payment Terms */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            3. Syarat & Tahapan Pembayaran
          </h3>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-line">
            {quotation.paymentTerms}
          </div>
        </div>

        {/* Section 4: Terms and Conditions */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            4. Ketentuan & Syarat Pelaksanaan
          </h3>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-line">
            {quotation.termsAndConditions}
          </div>
        </div>

        {/* Section 5: Notes if any */}
        {quotation.notes && (
          <div className="space-y-1 p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 text-xs text-amber-900">
            <span className="font-bold block">Catatan Khusus:</span>
            <p className="leading-relaxed">{quotation.notes}</p>
          </div>
        )}

        {/* Closing & Signatures */}
        <div className="pt-4 space-y-8 text-xs">
          <p className="text-slate-700 leading-relaxed">
            Demikian surat penawaran harga ini kami sampaikan. Besar harapan kami untuk dapat menjalin kerja sama yang baik dengan Bapak/Ibu dalam mewujudkan proyek konstruksi ini. Atas perhatian dan kepercayaannya, kami ucapkan terima kasih.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-4 text-center">
            <div className="space-y-16">
              <p className="font-semibold text-slate-700">
                Diajukan Oleh,<br />
                <b>{quotation.companyName}</b>
              </p>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 underline">Direktur / Commercial Lead</p>
                <p className="text-[10px] text-slate-500">Estimator & Project Commercial</p>
              </div>
            </div>

            <div className="space-y-16">
              <p className="font-semibold text-slate-700">
                Disetujui Oleh,<br />
                <b>{quotation.clientName}</b>
              </p>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 underline">( .................................................. )</p>
                <p className="text-[10px] text-slate-500">Pemberi Tugas / Klien</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditQuotationModal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          quotation={quotation}
          onSave={(id, updated) => {
            onUpdateQuotation(id, updated);
            setIsEditModalOpen(false);
          }}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Hapus Surat Penawaran Harga?"
          message={`Apakah Anda yakin ingin menghapus dokumen "${quotation.quotationNumber} — ${quotation.projectName}"? Dokumen sumber RAB tidak akan terpengaruh.`}
          confirmText="Ya, Hapus SPH"
          onConfirm={() => {
            onDeleteQuotation(quotation.id);
            setIsDeleteModalOpen(false);
            onBack();
          }}
        />
      )}
    </div>
  );
};
