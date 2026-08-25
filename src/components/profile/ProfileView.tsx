'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Target, 
  RotateCcw, 
  Edit3, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Award,
  KeyRound,
  Laptop,
  Clock,
  Wrench,
  AlertTriangle,
  Code2,
  Calendar
} from 'lucide-react';
import { UserProfile, LicenseInfo, DevModeInfo } from '../../types';
import { formatDisplayPhone } from '../../utils/helpers';
import { getClientDeviceMetadata } from '../../utils/device';
import { AdminLicensesModal } from '../license/AdminLicensesModal';

interface ProfileViewProps {
  profile: UserProfile;
  license?: LicenseInfo | null;
  devModeInfo?: DevModeInfo | null;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
  onDeactivateLicense?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  license,
  devModeInfo,
  onUpdateProfile,
  onResetData,
  onDeactivateLicense,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [target, setTarget] = useState(profile.monthlyTarget);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const deviceMeta = getClientDeviceMetadata();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim() || profile.name,
      email: email.trim() || profile.email,
      phone: phone.trim() || profile.phone,
      monthlyTarget: Number(target) || 20,
    });
    setIsEditing(false);
  };

  const targetPct = Math.min(Math.round((profile.closingCount / profile.monthlyTarget) * 100), 100);

  const formattedDevExpires = devModeInfo?.expiresAt
    ? new Date(devModeInfo.expiresAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '25 September 2026';

  const formattedDevStart = devModeInfo?.startDate
    ? new Date(devModeInfo.startDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '26 Agustus 2026';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 md:pb-12">
      {/* User Header Profile Card */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-[#00A651] flex items-center justify-center text-white text-2xl font-black shadow-sm shrink-0">
            {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#17221C]">
                {profile.name}
              </h2>
              <span className="px-3 py-1 rounded-full bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] text-xs font-bold">
                {profile.role}
              </span>
            </div>
            <p className="text-xs text-[#66736B]">{profile.email}</p>
            <p className="text-xs font-mono text-[#00A651] font-semibold">{formatDisplayPhone(profile.phone)}</p>
          </div>
        </div>
      </div>

      {/* 1. If Development Mode is Active: Show Dev Mode Card */}
      {devModeInfo?.isDevMode && (
        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17221C]">Status: Mode Pengembangan (Development Mode)</h3>
                <p className="text-xs text-amber-800">Akses sementara untuk pengujian lokal (Bukan lisensi production)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>DEV MODE ({devModeInfo.remainingDays} Hari Tersisa)</span>
              </span>

              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                className="p-1.5 rounded-lg text-[#66736B] hover:text-[#17221C] hover:bg-slate-100 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Admin License Manager"
              >
                <Wrench className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] space-y-1">
              <div className="flex items-center gap-1.5 text-[#66736B]">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Mulai Sesi Dev</span>
              </div>
              <p className="font-semibold text-[#17221C]">{formattedDevStart}</p>
            </div>

            <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] space-y-1">
              <div className="flex items-center gap-1.5 text-[#66736B]">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Berakhir Pada</span>
              </div>
              <p className="font-bold text-[#17221C]">{formattedDevExpires}</p>
            </div>

            <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] space-y-1">
              <div className="flex items-center gap-1.5 text-[#66736B]">
                <Laptop className="w-3.5 h-3.5 text-[#00A651]" />
                <span>Host / Environment</span>
              </div>
              <p className="font-semibold text-[#17221C]">{devModeInfo.host || 'localhost'} (dev)</p>
            </div>
          </div>

          <p className="text-[11px] text-[#66736B] bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
            Catatan: Mode ini otomatis nonaktif setelah 30 hari atau bila aplikasi dijalankan di environment production (Vercel).
          </p>
        </div>
      )}

      {/* 2. If Regular License is Active: Show Production License Card */}
      {!devModeInfo?.isDevMode && license && (
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E9E4] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17221C]">Status Lisensi Aplikasi</h3>
                <p className="text-xs text-[#66736B]">Lisensi Lifetime (1 User, 1 Device)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00A651] animate-pulse" />
                <span>LISENSI AKTIF</span>
              </span>

              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                className="p-1.5 rounded-lg text-[#66736B] hover:text-[#17221C] hover:bg-slate-100 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Admin License Manager"
              >
                <Wrench className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] space-y-1">
              <div className="flex items-center gap-1.5 text-[#66736B]">
                <KeyRound className="w-3.5 h-3.5 text-[#00A651]" />
                <span>Kunci Lisensi Terdaftar</span>
              </div>
              <p className="font-mono font-bold text-[#17221C]">
                {license.fullKeyMasked || `••••-••••-••••-${license.licenseKeyLast4}`}
              </p>
            </div>

            <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] space-y-1">
              <div className="flex items-center gap-1.5 text-[#66736B]">
                <Laptop className="w-3.5 h-3.5 text-[#00A651]" />
                <span>Device Terikat (Terkunci)</span>
              </div>
              <p className="font-medium text-[#17221C] truncate">{deviceMeta.deviceName}</p>
            </div>
          </div>

          {onDeactivateLicense && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin melepaskan lisensi dari perangkat ini?')) {
                    onDeactivateLicense();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Lisensi Perangkat</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Target Sales Progress Card */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#00A651]" />
            <span className="font-bold text-[#17221C]">Target Closing Bulan Agustus</span>
          </div>
          <span className="font-extrabold text-[#006B3C] text-sm">{targetPct}% Tercapai</span>
        </div>

        <div className="w-full bg-[#F1F5F3] rounded-full h-3.5 overflow-hidden border border-[#E2E9E4] p-0.5">
          <div
            className="bg-[#00A651] h-full rounded-full transition-all duration-500"
            style={{ width: `${targetPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#66736B]">
          <span>Closing Saat Ini: <b className="text-[#006B3C] font-bold">{profile.closingCount} Deal</b></span>
          <span>Target Bulanan: <b className="text-[#17221C] font-bold">{profile.monthlyTarget} Deal</b></span>
        </div>
      </div>

      {/* Edit Form or Readonly Information */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E9E4] pb-3">
          <h3 className="text-base font-bold text-[#17221C]">Informasi Akun Sales</h3>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F7F9F8] hover:bg-[#E8F7EF] text-[#66736B] hover:text-[#006B3C] border border-[#E2E9E4] text-xs font-bold transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs font-semibold text-[#66736B] hover:text-[#17221C] cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#17221C] mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#17221C] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#17221C] mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#17221C] mb-1">Target Closing Bulanan</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4]">
              <span className="text-[#66736B] block text-[11px] font-semibold">Nama Sales</span>
              <span className="font-bold text-[#17221C] mt-0.5 block">{profile.name}</span>
            </div>
            <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4]">
              <span className="text-[#66736B] block text-[11px] font-semibold">Alamat Email</span>
              <span className="font-bold text-[#17221C] mt-0.5 block">{profile.email}</span>
            </div>
            <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4]">
              <span className="text-[#66736B] block text-[11px] font-semibold">WhatsApp</span>
              <span className="font-bold text-[#006B3C] font-mono mt-0.5 block">
                {formatDisplayPhone(profile.phone)}
              </span>
            </div>
            <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4]">
              <span className="text-[#66736B] block text-[11px] font-semibold">Role & Jabatan</span>
              <span className="font-bold text-[#17221C] mt-0.5 block">{profile.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Data Management Card */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#17221C]">Reset Data Simulasi</h4>
          <p className="text-xs text-[#66736B] mt-0.5">
            Kembalikan seluruh daftar lead ke data contoh awal bila ingin mengulang alur penjualan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mereset seluruh lead ke data default awal?')) {
              onResetData();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Data Awal</span>
        </button>
      </div>

      {/* Admin Modals */}
      <AdminLicensesModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};