'use client';

import React from 'react';
import { Calendar, ChevronDown, Bell, Search, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenFollowUps: () => void;
  followUpCount: number;
  selectedDateRange: string;
  onChangeDateRange: (range: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  profile,
  onOpenProfile,
  onOpenFollowUps,
  followUpCount,
  selectedDateRange,
  onChangeDateRange,
}) => {
  return (
    <header className="bg-[#06111F]/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-4 border-b border-[#17324D]/50 flex items-center justify-between gap-4">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Date Filter selector matching mockup */}
        <div className="hidden sm:flex items-center gap-2 bg-[#0B1B2E] border border-[#17324D] rounded-xl px-3 py-1.5 text-xs text-[#F8FAFC]">
          <Calendar className="w-3.5 h-3.5 text-[#168BFF]" />
          <select
            value={selectedDateRange}
            onChange={(e) => onChangeDateRange(e.target.value)}
            className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none cursor-pointer pr-1"
          >
            <option value="this_week" className="bg-[#0B1B2E] text-white">Minggu Ini (21 - 27 Agu)</option>
            <option value="today" className="bg-[#0B1B2E] text-white">Hari Ini</option>
            <option value="this_month" className="bg-[#0B1B2E] text-white">Bulan Ini (Agustus)</option>
            <option value="all" className="bg-[#0B1B2E] text-white">Semua Waktu</option>
          </select>
        </div>

        {/* Notification Bell with Follow Up Counter */}
        <button
          type="button"
          onClick={onOpenFollowUps}
          className="relative p-2.5 rounded-xl bg-[#0B1B2E] border border-[#17324D] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#168BFF]/40 transition-colors"
          title="Pengingat Follow Up"
          aria-label="Pengingat Follow Up"
        >
          <Bell className="w-4 h-4" />
          {followUpCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.6)]">
              {followUpCount}
            </span>
          )}
        </button>

        {/* User Badge matching mockup */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 bg-[#0B1B2E] hover:bg-[#0E233D] border border-[#17324D] hover:border-[#168BFF]/40 rounded-xl p-1.5 pr-3 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#168BFF] to-[#22D3EE] flex items-center justify-center text-white font-bold text-xs overflow-hidden border border-[#168BFF]/40">
            {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors leading-tight">
              {profile.name}
            </div>
            <div className="text-[10px] text-[#94A3B8] leading-tight">
              {profile.role.split(' ')[0]}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-white transition-colors" />
        </button>
      </div>
    </header>
  );
};
