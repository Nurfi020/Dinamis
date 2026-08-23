import React from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, ExternalLink, X, Smartphone, Zap, Clock } from 'lucide-react';

interface BuyLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyLicenseModal: React.FC<BuyLicenseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-left relative">
        {/* Header */}
        <div className="p-6 border-b border-[#17324D] flex items-center justify-between bg-gradient-to-r from-[#0B1B2E] via-[#0E233D] to-[#0B1B2E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#168BFF] to-[#22D3EE] flex items-center justify-center text-white shadow-[0_0_15px_rgba(22,139,255,0.4)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Beli Lisensi Lifetime</h3>
              <p className="text-xs text-[#94A3B8]">Akses Penuh Seumur Hidup — 1 User, 1 Device</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#17324D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Price Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#168BFF]/15 to-[#22D3EE]/5 border border-[#168BFF]/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#168BFF] uppercase tracking-wider block">
                Paket Lifetime Sales
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#F8FAFC]">Rp 149.000</span>
                <span className="text-xs text-[#94A3B8] line-through">Rp 499.000</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
              Sekali Bayar
            </span>
          </div>

          {/* Benefits */}
          <div className="space-y-2.5 text-xs text-[#F8FAFC]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Akses penuh semua fitur CRM, Pipeline Lead, Reminder Follow Up & Laporan.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Penyimpanan data lokal cepat & aman dengan dukungan <b>Mode Offline 7 Hari</b>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Dukungan Reset & Migrasi Perangkat jika ganti laptop/komputer.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Format lisensi resmi instan: <code className="text-[#22D3EE] font-mono">KLDN-LIFE-XXXX-XXXX-XXXX</code>.</span>
            </div>
          </div>

          {/* Notice info */}
          <div className="p-3 bg-[#06111F] rounded-xl border border-[#17324D] text-[11px] text-[#94A3B8] flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#168BFF] shrink-0" />
            <span>Setelah pembayaran berhasil, License Key akan dikirimkan secara otomatis via WhatsApp/Email.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#17324D] bg-[#06111F] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#17324D] transition-colors"
          >
            Tutup
          </button>
          <a
            href="https://wa.me/?text=Halo%20Admin,%20saya%20ingin%20membeli%20License%20Key%20Lifetime%20Kelola%20Lead%20Sales"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white font-bold text-xs shadow-[0_0_15px_rgba(22,139,255,0.4)] flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Hubungi Penjualan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
