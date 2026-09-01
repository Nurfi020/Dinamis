'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Bell, 
  Building2, 
  Sparkles, 
  UserCircle2, 
  Users, 
  ShieldCheck, 
  Briefcase, 
  Check, 
  Layers,
  MapPin
} from 'lucide-react';
import { UserProfile, DevModeInfo, DemoRole, DemoPersona } from '../../types';
import { DEMO_PERSONAS, ENTERPRISE_ORG_NAME } from '../../data/enterpriseDemoData';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  profile: UserProfile;
  currentRole: DemoRole;
  currentPersona: DemoPersona;
  onSwitchRole: (role: DemoRole) => void;
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
  currentRole,
  currentPersona,
  onSwitchRole,
  devModeInfo,
  onOpenProfile,
  onOpenFollowUps,
  followUpCount,
  selectedDateRange,
  onChangeDateRange,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeStyle = (role: DemoRole) => {
    switch (role) {
      case 'sales':
        return 'bg-[#E8F7EF] text-[#006B3C] border-[#A7F3D0]';
      case 'supervisor':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'manager':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'admin':
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const roleOptions: { role: DemoRole; label: string; desc: string; icon: any }[] = [
    {
      role: 'sales',
      label: DEMO_PERSONAS.sales.name,
      desc: DEMO_PERSONAS.sales.title,
      icon: UserCircle2,
    },
    {
      role: 'supervisor',
      label: DEMO_PERSONAS.supervisor.name,
      desc: DEMO_PERSONAS.supervisor.title,
      icon: Users,
    },
    {
      role: 'manager',
      label: DEMO_PERSONAS.manager.name,
      desc: DEMO_PERSONAS.manager.title,
      icon: Briefcase,
    },
    {
      role: 'admin',
      label: DEMO_PERSONAS.admin.name,
      desc: DEMO_PERSONAS.admin.title,
      icon: ShieldCheck,
    },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-3.5 border-b border-[#E2E9E4] flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* 1. Page Title, Subtitle & Organization Context */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17221C] tracking-tight">
            {title}
          </h1>

          {/* Organization & Branch Context Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F7F9F8] border border-[#E2E9E4] text-[11px] text-[#66736B]">
            <Building2 className="w-3.5 h-3.5 text-[#00A651]" />
            <span className="font-bold text-[#17221C]">{currentPersona.organization}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00A651]" />
              <span>{currentPersona.branch.split('(')[0].trim()}</span>
            </span>
          </div>

          {/* Enterprise Demo Label */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F7EF] border border-[#A7F3D0] text-[#006B3C] text-[10px] font-bold tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] animate-pulse" />
            <span>ENTERPRISE DEMO • Data Simulasi</span>
          </span>
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-[#66736B] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* 2. Right Controls: Role Switcher, Date, Notification, Profile */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* DEMO ROLE SWITCHER DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isRoleDropdownOpen ? 'ring-2 ring-[#00A651]/30 border-[#00A651]' : 'border-[#E2E9E4] bg-[#F7F9F8] hover:bg-white'
            }`}
            title="Ganti Peran Demo"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[#66736B] tracking-wider hidden sm:inline">Role:</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${getRoleBadgeStyle(currentRole)}`}>
                {currentRole}
              </span>
            </div>
            <span className="font-bold text-[#17221C] truncate max-w-[110px] sm:max-w-[140px]">
              {currentPersona.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#66736B] transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E2E9E4] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2 border-b border-[#E2E9E4]">
                <div className="text-[10px] font-extrabold uppercase text-[#66736B] tracking-wider flex items-center justify-between">
                  <span>PILIH DEMO ROLE</span>
                  <span className="text-[#00A651] font-bold">Simulasi Instan</span>
                </div>
                <div className="text-xs text-[#17221C] font-semibold mt-0.5">
                  Ubah sudut pandang portal tanpa login ulang
                </div>
              </div>

              <div className="p-1.5 space-y-1">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = currentRole === opt.role;

                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => {
                        onSwitchRole(opt.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]' 
                          : 'hover:bg-[#F7F9F8] text-[#17221C]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#00A651] text-white' : 'bg-[#F1F5F3] text-[#66736B]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs truncate text-[#17221C]">
                            {opt.label}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${getRoleBadgeStyle(opt.role)}`}>
                            {opt.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#66736B] truncate mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#00A651] shrink-0 self-center" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="px-3.5 py-2 border-t border-[#E2E9E4] bg-[#F7F9F8]/60 text-[10px] text-[#66736B]">
                Organisasi: <b className="text-[#17221C]">{currentPersona.organization}</b>
              </div>
            </div>
          )}
        </div>

        {/* Date Filter selector */}
        <div className="hidden sm:flex items-center gap-2 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl px-3 py-1.5 text-xs text-[#17221C]">
          <Calendar className="w-3.5 h-3.5 text-[#00A651]" />
          <select
            value={selectedDateRange}
            onChange={(e) => onChangeDateRange(e.target.value)}
            className="bg-transparent text-xs text-[#17221C] font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="this_week" className="bg-white text-[#17221C]">Minggu Ini</option>
            <option value="today" className="bg-white text-[#17221C]">Hari Ini</option>
            <option value="this_month" className="bg-white text-[#17221C]">Bulan Ini</option>
            <option value="all" className="bg-white text-[#17221C]">Semua Waktu</option>
          </select>
        </div>

        {/* Notification Bell */}
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

        {/* User Profile Badge */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 bg-[#F7F9F8] hover:bg-[#E8F7EF]/50 border border-[#E2E9E4] hover:border-[#00A651]/40 rounded-xl p-1.5 pr-3 transition-all cursor-pointer group"
          title="Buka Profil"
        >
          <div className="w-8 h-8 rounded-lg bg-[#00A651] flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-xs">
            {currentPersona.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-[#17221C] group-hover:text-[#006B3C] transition-colors leading-tight truncate max-w-[100px]">
              {currentPersona.name}
            </div>
            <div className="text-[10px] font-medium text-[#66736B] leading-tight">
              {currentPersona.title.split(' ')[0]}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#66736B] group-hover:text-[#17221C] transition-colors" />
        </button>
      </div>
    </header>
  );
};