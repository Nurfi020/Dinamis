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
  MapPin,
  Lock
} from 'lucide-react';
import { UserProfile, DevModeInfo, DemoRole, DemoPersona, DemoPackage } from '../../types';
import { DEMO_PERSONAS } from '../../data/enterpriseDemoData';
import { DEMO_PACKAGES } from '../../data/packageDemoData';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  profile: UserProfile;
  currentRole: DemoRole;
  currentPersona: DemoPersona;
  currentPackage: DemoPackage;
  onSwitchRole: (role: DemoRole) => void;
  onSwitchPackage: (pkg: DemoPackage) => void;
  onOpenLockedFeature: (title: string, desc: string, reqPkg: DemoPackage) => void;
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
  currentPackage,
  onSwitchRole,
  onSwitchPackage,
  onOpenLockedFeature,
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

  const roleOptions: { role: DemoRole; label: string; desc: string; icon: any; minPackage: DemoPackage }[] = [
    {
      role: 'sales',
      label: DEMO_PERSONAS.sales.name,
      desc: DEMO_PERSONAS.sales.title,
      icon: UserCircle2,
      minPackage: 'basic',
    },
    {
      role: 'supervisor',
      label: DEMO_PERSONAS.supervisor.name,
      desc: DEMO_PERSONAS.supervisor.title,
      icon: Users,
      minPackage: 'business',
    },
    {
      role: 'manager',
      label: DEMO_PERSONAS.manager.name,
      desc: DEMO_PERSONAS.manager.title,
      icon: Briefcase,
      minPackage: 'enterprise',
    },
    {
      role: 'admin',
      label: DEMO_PERSONAS.admin.name,
      desc: DEMO_PERSONAS.admin.title,
      icon: ShieldCheck,
      minPackage: 'enterprise',
    },
  ];

  const currentPkgConfig = DEMO_PACKAGES[currentPackage];

  // Organization context label according to active package
  const getOrgContext = () => {
    switch (currentPackage) {
      case 'basic':
        return {
          org: 'Toko Sejahtera — Retail & UMKM',
          branch: 'Jakarta Barat',
          badge: 'BASIC • Small Business',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'business':
        return {
          org: 'PT Sukses Mandiri — Sales Team',
          branch: 'Jakarta Pusat',
          badge: 'BUSINESS • Growing Team',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'enterprise':
        return {
          org: 'Bank Nusantara — Enterprise Demo',
          branch: 'KC Jakarta Sudirman',
          badge: 'ENTERPRISE • Data Simulasi',
          badgeClass: 'bg-[#E8F7EF] text-[#006B3C] border-[#A7F3D0]',
        };
    }
  };

  const orgContext = getOrgContext();

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-3 border-b border-[#E2E9E4] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* 1. Left: Page Title, Subtitle & Organization Context */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17221C] tracking-tight">
            {title}
          </h1>

          {/* Organization & Branch Context Pill */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F7F9F8] border border-[#E2E9E4] text-[11px] text-[#66736B]">
            <Building2 className="w-3.5 h-3.5 text-[#00A651]" />
            <span className="font-bold text-[#17221C]">{orgContext.org}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00A651]" />
              <span>{orgContext.branch}</span>
            </span>
          </div>

          {/* Package / Enterprise Demo Label */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-tight ${orgContext.badgeClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{orgContext.badge}</span>
          </span>
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-[#66736B] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* 2. Right Controls: PACKAGE SWITCHER + Role Switcher + Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* A. PACKAGE SWITCHER SEGMENTED CONTROL */}
        <div className="flex items-center bg-[#F1F5F3] p-1 rounded-xl border border-[#E2E9E4] shadow-2xs">
          <span className="text-[10px] uppercase font-extrabold text-[#66736B] px-1.5 hidden md:inline">
            Paket:
          </span>
          {(['basic', 'business', 'enterprise'] as DemoPackage[]).map((pkgKey) => {
            const pkgConfig = DEMO_PACKAGES[pkgKey];
            const isActive = currentPackage === pkgKey;
            return (
              <button
                key={pkgKey}
                type="button"
                onClick={() => onSwitchPackage(pkgKey)}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? pkgKey === 'basic'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : pkgKey === 'business'
                      ? 'bg-[#00A651] text-white shadow-xs'
                      : 'bg-slate-900 text-emerald-400 border border-slate-700 shadow-xs'
                    : 'text-[#66736B] hover:text-[#17221C] hover:bg-white/60'
                }`}
                title={`Beralih ke demo paket ${pkgConfig.name}`}
              >
                <span className="capitalize">{pkgKey}</span>
                {pkgConfig.badge && (
                  <span
                    className={`text-[8px] px-1 py-0.2 rounded-full font-extrabold tracking-tighter ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : pkgKey === 'business'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {pkgConfig.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* B. DEMO ROLE SWITCHER DROPDOWN */}
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
            <span className="font-bold text-[#17221C] truncate max-w-[100px] sm:max-w-[130px]">
              {currentPersona.name.split(' ')[0]}
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
                  const isLocked = (opt.minPackage === 'business' && currentPackage === 'basic') ||
                                   (opt.minPackage === 'enterprise' && currentPackage !== 'enterprise');

                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => {
                        if (isLocked) {
                          setIsRoleDropdownOpen(false);
                          onOpenLockedFeature(
                            `Portal ${opt.label} (${opt.desc})`,
                            `Akses portal manajemen ${opt.role.toUpperCase()} eksklusif tersedia pada Paket ${opt.minPackage.toUpperCase()}.`,
                            opt.minPackage
                          );
                        } else {
                          onSwitchRole(opt.role);
                          setIsRoleDropdownOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E8F7EF] text-[#006B3C]'
                          : isLocked
                          ? 'text-[#94A3B8] hover:bg-[#F8FAFC]'
                          : 'text-[#17221C] hover:bg-[#F4FBF7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00A651] text-white' : isLocked ? 'bg-slate-100 text-slate-400' : 'bg-[#F7F9F8] text-[#66736B]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            <span className="truncate">{opt.label}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-sm uppercase font-extrabold border ${getRoleBadgeStyle(opt.role)}`}>
                              {opt.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#66736B] truncate">{opt.desc}</div>
                        </div>
                      </div>

                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#00A651] shrink-0" />
                      ) : isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {currentPackage !== 'enterprise' && (
                <div className="p-2 border-t border-[#E2E9E4] bg-[#F7F9F8] mx-1.5 rounded-xl mt-1">
                  <div className="text-[11px] text-[#66736B] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00A651] shrink-0" />
                    <span>Pilih <b>Enterprise</b> untuk membuka seluruh portal (Manager & Admin).</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* C. Filter Date Range */}
        <div className="hidden sm:flex items-center bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl px-2.5 py-1.5 text-xs text-[#17221C]">
          <Calendar className="w-3.5 h-3.5 text-[#00A651] mr-1.5 shrink-0" />
          <select
            value={selectedDateRange}
            onChange={(e) => onChangeDateRange(e.target.value)}
            className="bg-transparent font-semibold focus:outline-none cursor-pointer text-xs"
            aria-label="Filter Rentang Waktu"
          >
            <option value="today">Hari Ini</option>
            <option value="this_week">Minggu Ini</option>
            <option value="this_month">Bulan Ini</option>
            <option value="all">Semua Waktu</option>
          </select>
        </div>

        {/* D. Notification Bell (Follow Up Count) */}
        <button
          type="button"
          onClick={onOpenFollowUps}
          className="relative p-2 rounded-xl border border-[#E2E9E4] bg-[#F7F9F8] hover:bg-white text-[#66736B] hover:text-[#17221C] transition-colors cursor-pointer"
          title={`${followUpCount} Lead perlu di-follow up`}
          aria-label="Notifikasi Follow Up"
        >
          <Bell className="w-4 h-4" />
          {followUpCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {followUpCount > 9 ? '9+' : followUpCount}
            </span>
          )}
        </button>

        {/* E. Profile Avatar Pill */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-[#E2E9E4] bg-[#F7F9F8] hover:bg-white transition-all cursor-pointer"
          title="Buka Pengaturan & Profil"
        >
          <div className="w-7 h-7 rounded-lg bg-[#00A651] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentPersona.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-[#17221C] truncate max-w-[90px]">
              {currentPersona.name.split(' ')[0]}
            </span>
            <span className="block text-[10px] text-[#66736B] truncate max-w-[90px]">
              {currentRole}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};