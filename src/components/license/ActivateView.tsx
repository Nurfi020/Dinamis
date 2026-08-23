import React, { useState } from 'react';
import { 
  Sparkles, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShoppingBag, 
  Laptop, 
  HelpCircle,
  Cpu,
  Wrench
} from 'lucide-react';
import { LicenseClient } from '../../services/licenseClient';
import { getClientDeviceMetadata } from '../../utils/device';
import { LicenseInfo } from '../../types';
import { BuyLicenseModal } from './BuyLicenseModal';
import { AdminLicensesModal } from './AdminLicensesModal';

interface ActivateViewProps {
  onActivationSuccess: (license: LicenseInfo) => void;
  onOpenHelp?: () => void;
}

export const ActivateView: React.FC<ActivateViewProps> = ({
  onActivationSuccess,
  onOpenHelp,
}) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const deviceMeta = getClientDeviceMetadata();

  // Auto-format key while typing (DINA-XXXX-XXXX-XXXX or KLDN-LIFE-XXXX-XXXX-XXXX)
  const handleKeyChange = (val: string) => {
    let clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    let formatted = clean;
    if (clean.startsWith('DINA')) {
      const remaining = clean.slice(4);
      const parts = ['DINA'];
      if (remaining.length > 0) parts.push(remaining.slice(0, 4));
      if (remaining.length > 4) parts.push(remaining.slice(4, 8));
      if (remaining.length > 8) parts.push(remaining.slice(8, 12));
      formatted = parts.join('-');
    } else if (clean.startsWith('KLDNLIFE')) {
      const remaining = clean.slice(8);
      const parts = ['KLDN', 'LIFE'];
      if (remaining.length > 0) parts.push(remaining.slice(0, 4));
      if (remaining.length > 4) parts.push(remaining.slice(4, 8));
      if (remaining.length > 8) parts.push(remaining.slice(8, 12));
      formatted = parts.join('-');
    } else if (clean.length > 0) {
      // Chunk into segments of 4
      const parts: string[] = [];
      for (let i = 0; i < clean.length; i += 4) {
        parts.push(clean.slice(i, i + 4));
      }
      formatted = parts.join('-');
    }

    setLicenseKey(formatted);
    if (errorMessage) setErrorMessage(null);
  };

  const handleUseTestKey = () => {
    setLicenseKey('DINA-TEST-TEST-0001');
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = licenseKey.trim();

    if (!trimmed) {
      setErrorMessage('Silakan masukkan License Key Anda.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await LicenseClient.activate(trimmed);

    setLoading(false);

    if (result.success && result.license) {
      setSuccessMessage('Lisensi Lifetime berhasil diaktifkan untuk perangkat ini!');
      setTimeout(() => {
        onActivationSuccess(result.license!);
      }, 1000);
    } else {
      setErrorMessage(result.error || 'Aktivasi gagal. Silakan periksa kembali License Key.');
    }
  };

  return (
    <div className="min-h-screen bg-[#06111F] text-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Subtle Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#168BFF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#22D3EE]/10 blur-[120px] pointer-events-none" />

      {/* Main Activation Card */}
      <div className="w-full max-w-md bg-[#0B1B2E] border border-[#17324D] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#168BFF] to-[#22D3EE] flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(22,139,255,0.4)] border border-[#168BFF]/40 animate-in zoom-in-90 duration-300">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              Kelola Lead Sales
            </h1>
            <p className="text-xs text-[#22D3EE] font-bold uppercase tracking-wider mt-0.5">
              Aktivasi Lisensi Lifetime
            </p>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xs mx-auto">
            Satu lisensi berlaku seumur hidup untuk 1 perangkat. Masukkan License Key untuk membuka dashboard CRM.
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug font-semibold">{successMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#168BFF]" />
                <span>License Key</span>
              </label>
              <button
                type="button"
                onClick={handleUseTestKey}
                className="text-[11px] font-semibold text-[#22D3EE] hover:underline"
              >
                Gunakan Test Key (Dev)
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="DINA-XXXX-XXXX-XXXX"
                autoComplete="off"
                spellCheck="false"
                className="w-full px-4 py-3 bg-[#06111F] border border-[#17324D] focus:border-[#168BFF] rounded-xl text-center font-mono font-bold text-sm tracking-wider text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/30 transition-all uppercase"
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Format: <span className="font-mono text-slate-300">DINA-XXXX-XXXX-XXXX</span> (Lifetime)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !licenseKey.trim()}
            className="w-full py-3 px-4 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-[0_0_20px_rgba(22,139,255,0.4)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memvalidasi Lisensi...</span>
              </span>
            ) : (
              <>
                <span>AKTIFKAN LISENSI</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Purchase & Help Actions */}
        <div className="pt-2 border-t border-[#17324D] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsBuyModalOpen(true)}
            className="flex items-center gap-1.5 text-[#168BFF] hover:text-[#22D3EE] font-bold transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Beli Lisensi Baru</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-[11px]"
          >
            <Wrench className="w-3 h-3" />
            <span>Admin / Dev Keys</span>
          </button>
        </div>

        {/* Device Metadata Card */}
        <div className="p-3 bg-[#06111F]/80 rounded-xl border border-[#17324D] text-[11px] text-[#94A3B8] space-y-1">
          <div className="flex items-center justify-between text-[#F8FAFC]">
            <span className="font-semibold flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Perangkat Ini:</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">1 Device Binding</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            {deviceMeta.deviceName} — <span className="font-mono">{deviceMeta.deviceId.slice(0, 16)}...</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      <BuyLicenseModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
      <AdminLicensesModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSelectKeyToActivate={(key) => {
          setLicenseKey(key);
        }}
      />
    </div>
  );
};
