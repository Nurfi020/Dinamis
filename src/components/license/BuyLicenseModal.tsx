'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, ExternalLink, X } from 'lucide-react';

interface BuyLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyLicenseModal: React.FC<BuyLicenseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E2E9E4] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden text-left relative">
        {/* Header */}
        <div className="p-6 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A651] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221C]">Beli Lisensi Lifetime</h3>
              <p className="text-xs text-[#66736B]">Akses Penuh Seumur Hidup — 1 User, 1 Device</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#66736B] hover:text-[#17221C] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Price Box */}
          <div className="p-4 rounded-xl bg-[#E8F7EF] border border-[#A7F3D0] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#006B3C] uppercase tracking-wider block">
                Paket Lifetime Sales
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#17221C]">Rp 149.000</span>
                <span className="text-xs text-[#66736B] line-through">Rp 499.000</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white text-[#006B3C] border border-[#A7F3D0] text-xs font-bold shadow-xs">
              Sekali Bayar
            </span>
          </div>

          {/* Benefits */}
          <div className="space-y-2.5 text-xs text-[#17221C]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00A651] shrink-0 mt-0.5" />
              <span>Akses penuh semua fitur CRM, Pipeline Lead, Reminder Follow Up & Laporan.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00A651] shrink-0 mt-0.5" />
              <span>Penyimpanan data lokal cepat & aman dengan dukungan <b>Mode Offline</b>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00A651] shrink-0 mt-0.5" />
              <span>Dukungan Reset & Migrasi Perangkat jika ganti laptop/komputer.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00A651] shrink-0 mt-0.5" />
              <span>Format lisensi resmi instan: <code className="text-[#006B3C] font-mono font-bold">DINA-XXXX-XXXX-XXXX</code>.</span>
            </div>
          </div>

          {/* Notice info */}
          <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] text-[11px] text-[#66736B] flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00A651] shrink-0" />
            <span>Setelah konfirmasi, License Key akan dikirimkan secara langsung ke WhatsApp Anda.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#E2E9E4] bg-[#F7F9F8] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#66736B] hover:text-[#17221C] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <a
            href="https://wa.me/?text=Halo%20Admin,%20saya%20ingin%20membeli%20License%20Key%20Lifetime%20Kelola%20Lead%20Sales"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Hubungi Penjualan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};