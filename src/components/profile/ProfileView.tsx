import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  Target, 
  RotateCcw, 
  LogOut, 
  Edit3, 
  Check, 
  Sparkles, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../../types';
import { formatDisplayPhone } from '../../utils/helpers';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
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
    <div className="space-y-6 max-w-4xl mx-auto pb-24 md:pb-12">
      {/* User Header Profile Card */}
      <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#168BFF] to-[#22D3EE] flex items-center justify-center text-white text-2xl font-black shadow-[0_0_25px_rgba(22,139,255,0.5)] border-2 border-[#168BFF]/50 shrink-0">
            {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                {profile.name}
              </h2>
              <span className="px-3 py-1 rounded-full bg-[#168BFF]/20 text-[#22D3EE] border border-[#168BFF]/40 text-xs font-bold">
                {profile.role}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">{profile.email}</p>
            <p className="text-xs font-mono text-emerald-400">{formatDisplayPhone(profile.phone)}</p>
          </div>
        </div>
      </div>

      {/* Target Sales Progress Card */}
      <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#168BFF]" />
            <span className="font-bold text-[#F8FAFC]">Target Closing Bulan Agustus</span>
          </div>
          <span className="font-extrabold text-[#22D3EE] text-sm">{targetPct}% Tercapai</span>
        </div>

        <div className="w-full bg-[#06111F] rounded-full h-3 overflow-hidden border border-[#17324D] p-0.5">
          <div
            className="bg-gradient-to-r from-[#168BFF] to-[#22D3EE] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
            style={{ width: `${targetPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#94A3B8]">
          <span>Closing Saat Ini: <b className="text-emerald-400 font-bold">{profile.closingCount}</b></span>
          <span>Target: <b className="text-white font-bold">{profile.monthlyTarget} Closing</b></span>
        </div>
      </div>

      {/* Edit Form or Readonly Information */}
      <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#17324D] pb-3">
          <h3 className="text-base font-bold text-[#F8FAFC]">Informasi Akun Sales</h3>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E233D] hover:bg-[#168BFF] text-[#94A3B8] hover:text-white border border-[#17324D] text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-[#94A3B8] hover:text-white"
            >
              Batal
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#F8FAFC] mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#06111F] border border-[#17324D] rounded-xl text-xs text-white focus:outline-none focus:border-[#168BFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#F8FAFC] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#06111F] border border-[#17324D] rounded-xl text-xs text-white focus:outline-none focus:border-[#168BFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#F8FAFC] mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#06111F] border border-[#17324D] rounded-xl text-xs text-white focus:outline-none focus:border-[#168BFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#F8FAFC] mb-1">Target Closing Bulanan</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#06111F] border border-[#17324D] rounded-xl text-xs text-white focus:outline-none focus:border-[#168BFF]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#168BFF] text-white font-bold text-xs shadow-[0_0_15px_rgba(22,139,255,0.3)] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#06111F] rounded-xl border border-[#17324D]">
              <span className="text-[#94A3B8] block text-[11px]">Nama Sales</span>
              <span className="font-semibold text-[#F8FAFC] mt-0.5 block">{profile.name}</span>
            </div>
            <div className="p-3 bg-[#06111F] rounded-xl border border-[#17324D]">
              <span className="text-[#94A3B8] block text-[11px]">Alamat Email</span>
              <span className="font-semibold text-[#F8FAFC] mt-0.5 block">{profile.email}</span>
            </div>
            <div className="p-3 bg-[#06111F] rounded-xl border border-[#17324D]">
              <span className="text-[#94A3B8] block text-[11px]">WhatsApp</span>
              <span className="font-semibold text-emerald-400 font-mono mt-0.5 block">
                {formatDisplayPhone(profile.phone)}
              </span>
            </div>
            <div className="p-3 bg-[#06111F] rounded-xl border border-[#17324D]">
              <span className="text-[#94A3B8] block text-[11px]">Role & Jabatan</span>
              <span className="font-semibold text-[#22D3EE] mt-0.5 block">{profile.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Data Management Card */}
      <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#F8FAFC]">Reset Data Prototype</h4>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Kembalikan lead ke data awal contoh jika ingin mengulang simulasi CRM.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mereset seluruh lead ke data default awal?')) {
              onResetData();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-2 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Data Default</span>
        </button>
      </div>
    </div>
  );
};
