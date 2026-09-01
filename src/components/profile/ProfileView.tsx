'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Target, 
  RotateCcw, 
  Edit3, 
  Check, 
  ShieldCheck
} from 'lucide-react';
import { UserProfile, LicenseInfo, DevModeInfo } from '../../types';
import { formatDisplayPhone } from '../../utils/helpers';

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
  onUpdateProfile,
  onResetData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [target, setTarget] = useState(profile.monthlyTarget);

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

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-24 md:pb-12">
      {/* User Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-2xs shrink-0">
            {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
                {profile.role}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Akun Sales Executive • Kelola Lead Sales CRM
            </p>

            <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile.email}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {formatDisplayPhone(profile.phone)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Account Info Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Akun Demo Kelola Lead CRM</h3>
              <p className="text-[11px] text-slate-500">Sistem Penjualan & Manajemen Prospek Sales</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium self-start sm:self-auto">
            Versi Demo Komersial
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Semua data prospek, riwayat WhatsApp, dan performa closing pada akun ini disimulasikan untuk kebutuhan demonstrasi alur kerja tim sales.
        </p>
      </div>

      {/* Target Sales Progress Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-900">Target Closing Bulan Ini</span>
          </div>
          <span className="font-bold text-emerald-700 text-xs">{targetPct}% Tercapai</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${targetPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Closing: <b className="text-emerald-700 font-semibold">{profile.closingCount} Deal</b></span>
          <span>Target: <b className="text-slate-900 font-semibold">{profile.monthlyTarget} Deal</b></span>
        </div>
      </div>

      {/* Edit Form or Readonly Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900">Informasi Profil Sales</h3>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Profil</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Closing Bulanan</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-medium">Nama Sales</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{profile.name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-medium">Alamat Email</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{profile.email}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-medium">WhatsApp</span>
              <span className="font-semibold text-slate-900 font-mono mt-0.5 block">
                {formatDisplayPhone(profile.phone)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-medium">Role & Jabatan</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{profile.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Data Management Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Reset Data Simulasi</h4>
          <p className="text-xs text-slate-500 mt-0.5">
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
          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data Awal</span>
        </button>
      </div>
    </div>
  );
};