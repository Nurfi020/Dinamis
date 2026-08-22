'use client';

import React from 'react';
import { Modal } from './Modal';
import { Sparkles, MessageCircle, Flame, CheckCircle2, CalendarClock, MousePointer, ShieldCheck } from 'lucide-react';

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
        <div className="p-3.5 bg-[#06111F] rounded-xl border border-[#17324D] space-y-2">
          <span className="font-bold text-[#22D3EE] uppercase tracking-wider text-[11px] block">
            Alur Utama Sales:
          </span>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 overflow-x-auto py-1 gap-2">
            <span className="px-2 py-1 bg-[#0E233D] rounded border border-[#17324D]">1. Catat Lead</span>
            <span>→</span>
            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded border border-blue-500/30">2. Cold/Warm/Hot</span>
            <span>→</span>
            <span className="px-2 py-1 bg-amber-900/30 text-amber-300 rounded border border-amber-500/30">3. Follow Up</span>
            <span>→</span>
            <span className="px-2 py-1 bg-emerald-900/30 text-emerald-300 rounded border border-emerald-500/30">4. Closing Deal</span>
          </div>
        </div>

        {/* 5 Keunggulan Aplikasi matching mockup */}
        <div className="space-y-2">
          <span className="font-bold text-[#F8FAFC]">Keunggulan Aplikasi:</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#06111F] border border-[#17324D] space-y-1">
              <div className="flex items-center gap-2 text-[#168BFF] font-bold">
                <MousePointer className="w-4 h-4" />
                <span>Perbanyak Klik</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Semua pilihan kota, status, dan respon follow up cukup dengan 1 klik.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#06111F] border border-[#17324D] space-y-1">
              <div className="flex items-center gap-2 text-[#22D3EE] font-bold">
                <MessageCircle className="w-4 h-4" />
                <span>Minim Input Text</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Pilih dari daftar cepat tanpa repot mengetik panjang di HP.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#06111F] border border-[#17324D] space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CalendarClock className="w-4 h-4" />
                <span>Pengingat Jadwal</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Lead terbagi menjadi Terlambat, Hari Ini, dan Mendatang agar tidak ada yang terlewat.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#06111F] border border-[#17324D] space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Bahasa Sederhana</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Istilah mudah dipahami tanpa jargon CRM rumit.
              </p>
            </div>
          </div>
        </div>

        {/* Status explanation */}
        <div className="p-3 bg-[#06111F] rounded-xl border border-[#17324D] space-y-2">
          <span className="font-bold text-[#F8FAFC]">Arti Status Calon Pelanggan:</span>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li><b className="text-blue-400">Cold:</b> Belum menunjukkan ketertarikan cukup.</li>
            <li><b className="text-amber-400">Warm:</b> Sudah tertarik dan menanyakan detail / harga.</li>
            <li><b className="text-red-400">Hot:</b> Peluang beli sangat tinggi, siap transaksi.</li>
            <li><b className="text-emerald-400">Closing:</b> Berhasil menjadi pelanggan resmi.</li>
            <li><b className="text-slate-400">Tidak Berhasil:</b> Batal / tidak melanjutkan.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
