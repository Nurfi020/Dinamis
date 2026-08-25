'use client';

import React from 'react';
import { Modal } from './Modal';
import { Sparkles, MessageCircle, CalendarClock, MousePointer, ShieldCheck } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Panduan Kelola Lead Sales"
      subtitle="Prinsip penggunaan CRM sederhana & minim mengetik"
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        {/* Concept flow */}
        <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#E2E9E4] space-y-2">
          <span className="font-bold text-[#006B3C] uppercase tracking-wider text-[11px] block">
            Alur Utama Sales:
          </span>
          <div className="flex items-center justify-between text-xs font-bold text-[#17221C] overflow-x-auto py-1 gap-2">
            <span className="px-2.5 py-1.5 bg-white rounded-xl border border-[#E2E9E4] shadow-xs">1. Catat Lead</span>
            <span className="text-[#00A651]">→</span>
            <span className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">2. Pilih Status</span>
            <span className="text-[#00A651]">→</span>
            <span className="px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">3. Follow Up</span>
            <span className="text-[#00A651]">→</span>
            <span className="px-2.5 py-1.5 bg-[#E8F7EF] text-[#006B3C] rounded-xl border border-[#A7F3D0]">4. Closing Deal</span>
          </div>
        </div>

        {/* 4 Keunggulan Aplikasi */}
        <div className="space-y-2">
          <span className="font-bold text-[#17221C]">Keunggulan CRM Kelola Lead:</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E9E4] space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-[#00A651] font-bold">
                <MousePointer className="w-4 h-4" />
                <span>Perbanyak Klik</span>
              </div>
              <p className="text-[#66736B] text-[11px] leading-relaxed">
                Semua pilihan kota, status, dan respon follow up cukup dengan 1 klik mudah.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E9E4] space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-[#006B3C] font-bold">
                <MessageCircle className="w-4 h-4" />
                <span>Minim Input Teks</span>
              </div>
              <p className="text-[#66736B] text-[11px] leading-relaxed">
                Cukup ketik Nama & WhatsApp. Sisanya gunakan chip dan tombol pilihan cepat.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E9E4] space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-[#10B981] font-bold">
                <CalendarClock className="w-4 h-4" />
                <span>Pengingat Jadwal</span>
              </div>
              <p className="text-[#66736B] text-[11px] leading-relaxed">
                Lead terbagi menjadi Terlambat, Hari Ini, dan Besok agar tidak ada prospek terlewat.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E9E4] space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-[#D97706] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Bahasa Sederhana</span>
              </div>
              <p className="text-[#66736B] text-[11px] leading-relaxed">
                Dirancang khusus untuk Sales Indonesia tanpa menu dan istilah yang rumit.
              </p>
            </div>
          </div>
        </div>

        {/* Status explanation */}
        <div className="p-4 bg-white rounded-2xl border border-[#E2E9E4] space-y-2 shadow-xs">
          <span className="font-bold text-[#17221C]">Arti Status Calon Pelanggan:</span>
          <ul className="space-y-1.5 text-[#17221C] text-[11px]">
            <li><b className="text-[#64748B] font-bold">● Cold (#64748B):</b> Belum menunjukkan ketertarikan cukup / baru tahap awal.</li>
            <li><b className="text-[#F59E0B] font-bold">● Warm (#F59E0B):</b> Sudah tertarik dan menanyakan detail produk / harga.</li>
            <li><b className="text-[#EF4444] font-bold">● Hot (#EF4444):</b> Peluang beli sangat tinggi, siap untuk penawaran akhir.</li>
            <li><b className="text-[#10B981] font-bold">● Closing (#10B981):</b> Berhasil melakukan transaksi dan pembayaran.</li>
            <li><b className="text-[#6B7280] font-bold">● Tidak Berhasil (#6B7280):</b> Batal membeli / tidak melanjutkan.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};