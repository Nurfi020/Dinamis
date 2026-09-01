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
  MapPin, 
  Lock,
  Hammer,
  Store,
  LayoutGrid
} from 'lucide-react';
import { 
  UserProfile, 
  DevModeInfo, 
  DemoRole, 
  DemoPersona, 
  DemoPackage, 
  DemoIndustry 
} from '../../types';
import { DEMO_PERSONAS } from '../../data/enterpriseDemoData';
import { DEMO_PACKAGES } from '../../data/packageDemoData';
import { DEMO_INDUSTRIES } from '../../data/contractorDemoData';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  profile: UserProfile;
  currentRole: DemoRole;
  currentPersona: DemoPersona;
  currentPackage: DemoPackage;
  currentIndustry: DemoIndustry;
  onSwitchRole: (role: DemoRole) => void;
  onSwitchPackage: (pkg: DemoPackage) => void;
  onSwitchIndustry: (industry: DemoIndustry) => void;
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
  currentIndustry,
  onSwitchRole,
  onSwitchPackage,
  onSwitchIndustry,
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'supervisor':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'manager':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'admin':
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const roleOptions: { role: DemoRole; label: string; desc: string; icon: any; minPackage: DemoPackage }[] = [
    {
      role: 'sales',
      label: currentIndustry === 'contractor' 
        ? 'Budi Estimator' 
        : currentIndustry === 'umkm'
        ? 'Budi Sales UMKM'
        : DEMO_PERSONAS.sales.name,
      desc: currentIndustry === 'contractor' 
        ? 'Project Sales & Estimator' 
        : currentIndustry === 'umkm'
        ? 'Staff Penjualan & Layanan Pelanggan'
        : DEMO_PERSONAS.sales.title,
      icon: UserCircle2,
      minPackage: 'basic',
    },
    {
      role: 'supervisor',
      label: currentIndustry === 'contractor' 
        ? 'Dimas SPV Proyek' 
        : currentIndustry === 'umkm'
        ? 'Dimas SPV Toko'
        : DEMO_PERSONAS.supervisor.name,
      desc: currentIndustry === 'contractor' 
        ? 'Project Team Supervisor' 
        : currentIndustry === 'umkm'
        ? 'Supervisor Tim Penjualan UMKM'
        : DEMO_PERSONAS.supervisor.title,
      icon: Users,
      minPackage: 'business',
    },
    {
      role: 'manager',
      label: currentIndustry === 'contractor' 
        ? 'Ir. Hendra (Dir. Proyek)' 
        : currentIndustry === 'umkm'
        ? 'Ibu Ratna (Owner Bisnis)'
        : DEMO_PERSONAS.manager.name,
      desc: currentIndustry === 'contractor' 
        ? 'Project Director / Branch Manager' 
        : currentIndustry === 'umkm'
        ? 'Owner & Pengelola Bisnis'
        : DEMO_PERSONAS.manager.title,
      icon: Briefcase,
      minPackage: 'enterprise',
    },
    {
      role: 'admin',
      label: currentIndustry === 'contractor' 
        ? 'Fauzan (Admin Kontrak)' 
        : currentIndustry === 'umkm'
        ? 'Fauzan (Admin Sistem)'
        : DEMO_PERSONAS.admin.name,
      desc: currentIndustry === 'contractor' 
        ? 'Contract & System Administrator' 
        : currentIndustry === 'umkm'
        ? 'Administrator Sistem & Pengguna'
        : DEMO_PERSONAS.admin.title,
      icon: ShieldCheck,
      minPackage: 'enterprise',
    },
  ];

  const currentPkgConfig = DEMO_PACKAGES[currentPackage];
  const currentIndConfig = DEMO_INDUSTRIES[currentIndustry];

  // Organization context label according to active package & active industry
  const getOrgContext = () => {
    if (currentIndustry === 'contractor') {
      switch (currentPackage) {
        case 'basic':
          return {
            org: 'CV Karya Bersama — Kontraktor Renovasi',
            branch: 'Jakarta Barat',
            badge: 'CONTRACTOR • Basic',
            badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          };
        case 'business':
          return {
            org: 'PT Konstruksi Prima Mandiri — General Contractor',
            branch: 'Jakarta Pusat',
            badge: 'CONTRACTOR • Business Team',
            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          };
        case 'enterprise':
          return {
            org: 'PT Nusantara Megakonstruksi Tbk — Enterprise EPC',
            branch: 'Divisi Commercial & Infra',
            badge: 'CONTRACTOR • Enterprise EPC',
            badgeClass: 'bg-slate-900 text-amber-300 border-slate-700',
          };
      }
    }

    if (currentIndustry === 'umkm') {
      switch (currentPackage) {
        case 'basic':
          return {
            org: 'Toko Barokah — Retail & Kuliner UMKM',
            branch: 'Jakarta Barat',
            badge: 'UMKM • Usaha Mandiri',
            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          };
        case 'business':
          return {
            org: 'CV Usaha Maju Bersama — Distributor & Retail',
            branch: 'Jakarta Pusat',
            badge: 'UMKM • Tim Penjualan',
            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          };
        case 'enterprise':
          return {
            org: 'PT Sentra Niaga Nusantara — Multi-Store Network',
            branch: 'KC Sudirman',
            badge: 'UMKM • Multi-Outlet',
            badgeClass: 'bg-slate-900 text-emerald-300 border-slate-700',
          };
      }
    }

    // General CRM
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
          badge: 'ENTERPRISE • Corporate Demo',
          badgeClass: 'bg-slate-900 text-emerald-300 border-slate-700',
        };
    }
  };

  const orgContext = getOrgContext();

  return (
    <header className="bg-white sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-2xs">
      {/* 1. Left: Page Title, Subtitle & Organization Context */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>

          {/* Organization & Branch Context Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            {currentIndustry === 'contractor' ? (
              <Hammer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            ) : currentIndustry === 'umkm' ? (
              <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">{orgContext.org}</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{orgContext.branch}</span>
            </span>
          </div>

          {/* Package / Industry Status Tag */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold tracking-tight ${orgContext.badgeClass}`}>
            <span>{orgContext.badge}</span>
          </span>
        </div>

        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>

      {/* 2. Right Controls: INDUSTRY + PACKAGE + ROLE + Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* A. INDUSTRY SWITCHER CONTROL (Clean Segmented) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-2xs">
          {(['general', 'umkm', 'contractor'] as DemoIndustry[]).map((indKey) => {
            const indConfig = DEMO_INDUSTRIES[indKey];
            const isActive = currentIndustry === indKey;
            return (
              <button
                key={indKey}
                type="button"
                onClick={() => onSwitchIndustry(indKey)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title={`Ganti mode industri: ${indConfig.name}`}
              >
                {indKey === 'contractor' ? (
                  <Hammer className={`w-3 h-3 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                ) : indKey === 'umkm' ? (
                  <Store className={`w-3 h-3 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                ) : (
                  <LayoutGrid className={`w-3 h-3 ${isActive ? 'text-slate-800' : 'text-slate-400'}`} />
                )}
                <span>
                  {indKey === 'general' ? 'General' : indKey === 'umkm' ? 'UMKM' : 'Kontraktor'}
                </span>
              </button>
            );
          })}
        </div>

        {/* B. PACKAGE SWITCHER SEGMENTED CONTROL */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-2xs">
          {(['basic', 'business', 'enterprise'] as DemoPackage[]).map((pkgKey) => {
            const pkgConfig = DEMO_PACKAGES[pkgKey];
            const isActive = currentPackage === pkgKey;
            return (
              <button
                key={pkgKey}
                type="button"
                onClick={() => onSwitchPackage(pkgKey)}
                className={`relative px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title={`Beralih ke demo paket ${pkgConfig.name}`}
              >
                <span className="capitalize">{pkgKey}</span>
                {pkgConfig.badge && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold tracking-tight ${
                      isActive
                        ? pkgKey === 'business'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-800'
                        : 'bg-slate-200/60 text-slate-600'
                    }`}
                  >
                    {pkgConfig.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* C. DEMO ROLE SWITCHER DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              isRoleDropdownOpen 
                ? 'ring-2 ring-emerald-600/15 border-emerald-600 bg-white' 
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
            }`}
            title="Ganti Peran Demo"
          >
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase border ${getRoleBadgeStyle(currentRole)}`}>
              {currentRole}
            </span>
            <span className="truncate max-w-[85px] sm:max-w-[110px]">
              {roleOptions.find((r) => r.role === currentRole)?.label.split(' ')[0] || currentPersona.name.split(' ')[0]}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center justify-between">
                  <span>PILIH ROLE DEMO</span>
                  <span className="text-emerald-700 font-semibold">Simulasi Instan</span>
                </div>
                <div className="text-xs text-slate-700 font-medium mt-0.5">
                  Ubah sudut pandang portal tanpa login ulang
                </div>
              </div>

              <div className="p-1 space-y-0.5">
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
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : isLocked
                          ? 'text-slate-400 hover:bg-slate-50'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : isLocked ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs flex items-center gap-1.5">
                            <span className="truncate">{opt.label}</span>
                            <span className={`text-[9px] px-1 py-0.2 rounded uppercase font-bold border ${getRoleBadgeStyle(opt.role)}`}>
                              {opt.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{opt.desc}</div>
                        </div>
                      </div>

                      {isSelected ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {currentPackage !== 'enterprise' && (
                <div className="p-2 border-t border-slate-100 bg-slate-50 mx-1 rounded-lg mt-1">
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pilih <b>Enterprise</b> untuk membuka seluruh portal (Manager & Admin).</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* D. Filter Date Range */}
        <div className="hidden xl:flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
          <select
            value={selectedDateRange}
            onChange={(e) => onChangeDateRange(e.target.value)}
            className="bg-transparent font-medium focus:outline-none cursor-pointer text-xs"
            aria-label="Filter Rentang Waktu"
          >
            <option value="today">Hari Ini</option>
            <option value="this_week">Minggu Ini</option>
            <option value="this_month">Bulan Ini</option>
            <option value="all">Semua Waktu</option>
          </select>
        </div>

        {/* E. Notification Bell (Follow Up Count) */}
        <button
          type="button"
          onClick={onOpenFollowUps}
          className="relative p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
          title={`${followUpCount} prospek perlu di-follow up`}
          aria-label="Notifikasi Follow Up"
        >
          <Bell className="w-4 h-4" />
          {followUpCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {followUpCount > 9 ? '9+' : followUpCount}
            </span>
          )}
        </button>

        {/* F. Profile Avatar Pill */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          title="Buka Pengaturan & Profil"
        >
          <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
            {currentPersona.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="hidden 2xl:block text-left">
            <span className="block text-xs font-semibold text-slate-900 truncate max-w-[90px]">
              {currentPersona.name.split(' ')[0]}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};