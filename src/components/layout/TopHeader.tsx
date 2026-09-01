'use client';

import React from 'react';
import { Calendar, ChevronDown, Bell } from 'lucide-react';
import { UserProfile, DevModeInfo } from '../../types';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  profile: UserProfile;
  devModeInfo?: DevModeInfo | null;
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
  devModeInfo,
  onOpenProfile,
  onOpenFollowUps,
  followUpCount,
  selectedDateRange,
  onChangeDateRange,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-4 border-b border-[#E2E9E4] flex items-center justify-between gap-4">
      {/* Page Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17221C] tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F7EF] border border-[#A7F3D0] text-[#006B3C] text-[10px] font-bold tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A651]" />
            <span>Demo Mode • Data Simulasi</span>
          </span>
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#66736B] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Date Filter selector */}
        <div className="hidden sm:flex items-center gap-2 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl px-3 py-1.5 text-xs text-[#17221C]">
          <Calendar className="w-3.5 h-3.5 text-[#00A651]" />
          <select
            value={selectedDateRange}
            onChange={(e) => onChangeDateRange(e.target.value)}
            className="bg-transparent text-xs text-[#17221C] font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="this_week" className="bg-white text-[#17221C]">Minggu Ini (21 - 27 Agu)</option>
            <option value="today" className="bg-white text-[#17221C]">Hari Ini</option>
            <option value="this_month" className="bg-white text-[#17221C]">Bulan Ini (Agustus)</option>
            <option value="all" className="bg-white text-[#17221C]">Semua Waktu</option>
          </select>
        </div>

        {/* Notification Bell with Follow Up Counter */}
        <button
          type="button"
          onClick={onOpenFollowUps}
          className="relative p-2.5 rounded-xl bg-[#F7F9F8] border border-[#E2E9E4] text-[#66736B] hover:text-[#17221C] hover:border-[#00A651]/50 transition-colors cursor-pointer"
          title="Pengingat Follow Up"
          aria-label="Pengingat Follow Up"
        >
          <Bell className="w-4 h-4" />
          {followUpCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {followUpCount}
            </span>
          )}
        </button>

        {/* User Badge */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 bg-[#F7F9F8] hover:bg-[#E8F7EF]/50 border border-[#E2E9E4] hover:border-[#00A651]/40 rounded-xl p-1.5 pr-3 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#00A651] flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-xs">
            {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-[#17221C] group-hover:text-[#006B3C] transition-colors leading-tight">
              {profile.name}
            </div>
            <div className="text-[10px] font-medium text-[#66736B] leading-tight">
              {profile.role.split(' ')[0]}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#66736B] group-hover:text-[#17221C] transition-colors" />
        </button>
      </div>
    </header>
  );
};