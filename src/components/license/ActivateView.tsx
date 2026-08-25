'use client';

import React, { useState } from 'react';
import { 
  KeyRound, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Laptop, 
  ShoppingBag,
  HelpCircle,
  Wrench
} from 'lucide-react';
import { LicenseClient } from '../../services/licenseClient';
import { LicenseInfo } from '../../types';
import { getClientDeviceMetadata } from '../../utils/device';
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

  const handleKeyChange = (val: string) => {
    let clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formatted = clean;

    if (clean.startsWith('DINA') || clean.startsWith('KLDN')) {
      const parts: string[] = [];
      parts.push(clean.slice(0, 4));
      if (clean.length > 4) parts.push(clean.slice(4, 8));
      if (clean.length > 8) parts.push(clean.slice(8, 12));
      if (clean.length > 12) parts.push(clean.slice(12, 16));
      formatted = parts.join('-');
    } else if (clean.length > 0) {
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
    <div className="min-h-screen bg-[#F7F9F8] text-[#17221C] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Soft Green Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E8F7EF] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E8F7EF] blur-[100px] pointer-events-none" />

      {/* Main Activation Card */}
      <div className="w-full max-w-md bg-white border border-[#E2E9E4] rounded-3xl p-6 sm:p-8 shadow-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#00A651] flex items-center justify-center text-white mx-auto shadow-sm animate-in zoom-in-90 duration-300">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#17221C] flex items-center justify-center gap-2">
              Kelola Lead Sales
            </h1>
            <p className="text-xs text-[#006B3C] font-bold uppercase tracking-wider mt-0.5">
              Aktivasi Lisensi Lifetime
            </p>
          </div>

          <p className="text-xs text-[#66736B] leading-relaxed max-w-xs mx-auto">
            Satu lisensi berlaku seumur hidup untuk 1 perangkat. Masukkan License Key untuk membuka dashboard CRM.
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-[#E8F7EF] border border-[#A7F3D0] text-[#006B3C] text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#00A651] shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug font-semibold">{successMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#17221C] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#00A651]" />
                <span>License Key</span>
              </label>
              <button
                type="button"
                onClick={handleUseTestKey}
                className="text-[11px] font-bold text-[#006B3C] hover:underline cursor-pointer"
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
                className="w-full px-4 py-3 bg-white border border-[#E2E9E4] focus:border-[#00A651] rounded-xl text-center font-mono font-bold text-sm tracking-wider text-[#17221C] placeholder-[#66736B] focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 transition-all uppercase"
              />
            </div>
            <p className="text-[10px] text-[#66736B] text-center">
              Format: <span className="font-mono text-[#17221C] font-semibold">DINA-XXXX-XXXX-XXXX</span> (Lifetime)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !licenseKey.trim()}
            className="w-full py-3 px-4 rounded-xl bg-[#00A651] hover:bg-[#006B3C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
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
        <div className="pt-2 border-t border-[#E2E9E4] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsBuyModalOpen(true)}
            className="flex items-center gap-1.5 text-[#006B3C] hover:text-[#00A651] font-bold transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Beli Lisensi Baru</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            className="flex items-center gap-1 text-[#66736B] hover:text-[#17221C] transition-colors text-[11px] cursor-pointer"
          >
            <Wrench className="w-3 h-3" />
            <span>Admin / Dev Keys</span>
          </button>
        </div>

        {/* Device Metadata Card */}
        <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] text-[11px] text-[#66736B] space-y-1">
          <div className="flex items-center justify-between text-[#17221C]">
            <span className="font-bold flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-[#00A651]" />
              <span>Perangkat Ini:</span>
            </span>
            <span className="text-[10px] text-[#006B3C] font-bold font-mono">1 Device Binding</span>
          </div>
          <p className="text-[10px] text-[#66736B] truncate">
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