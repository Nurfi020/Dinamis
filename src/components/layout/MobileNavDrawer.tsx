'use client';

import React, { useEffect } from 'react';
import {
  X,
  UserCircle2,
  HelpCircle,
  Sparkles,
  Hammer,
  Store,
  Lock,
} from 'lucide-react';
import { ActiveTab, DevModeInfo, DemoRole, DemoPersona, DemoPackage, DemoIndustry } from '../../types';
import { DEMO_PACKAGES } from '../../data/packageDemoData';
import { getNavItems, getLockedTeasers } from '../../utils/navigation';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  followUpCount: number;
  onOpenHelp: () => void;
  currentRole: DemoRole;
  currentPersona: DemoPersona;
  currentPackage: DemoPackage;
  currentIndustry?: DemoIndustry;
  onSwitchRole: (role: DemoRole) => void;
  onSwitchPackage: (pkg: DemoPackage) => void;
  onSwitchIndustry: (industry: DemoIndustry) => void;
  onOpenLockedFeature: (title: string, desc: string, reqPkg: DemoPackage) => void;
  devModeInfo?: DevModeInfo | null;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenAddLead,
  followUpCount,
  onOpenHelp,
  currentRole,
  currentPersona,
  currentPackage,
  currentIndustry = 'general',
  onSwitchRole,
  onSwitchPackage,
  onSwitchIndustry,
  onOpenLockedFeature,
  devModeInfo,
}) => {
  const pkgConfig = DEMO_PACKAGES[currentPackage];
  const isContractor = currentIndustry === 'contractor';
  const isUmkm = currentIndustry === 'umkm';

  // Body scroll lock and Escape key listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const getRoleHeaderBadge = () => {
    switch (currentRole) {
      case 'sales':
        return {
          text: isContractor ? 'Estimator' : isUmkm ? 'Sales Toko' : 'Sales Staff',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200'
        };
      case 'supervisor':
        return {
          text: isContractor ? 'SPV Proyek' : isUmkm ? 'SPV Penjualan' : 'Supervisor',
          color: 'text-amber-800 bg-amber-50 border-amber-200'
        };
      case 'manager':
        return {
          text: isContractor ? 'Director' : isUmkm ? 'Owner' : 'Manager',
          color: 'text-indigo-800 bg-indigo-50 border-indigo-200'
        };
      case 'admin':
        return { text: 'Admin', color: 'text-slate-700 bg-slate-100 border-slate-300' };
    }
  };

  const roleBadge = getRoleHeaderBadge();

  // Single Source of Truth Navigation Items & Locked Teasers
  const navItems = getNavItems({
    currentPackage,
    currentRole,
    currentIndustry,
    followUpCount,
  });

  const lockedTeasers = getLockedTeasers({
    currentPackage,
    currentIndustry,
  });

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" aria-modal="true" role="dialog">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-label="Tutup menu navigasi"
      />

      {/* Off-canvas Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-white text-slate-800 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200 select-none">

        {/* 1. Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2 bg-slate-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs ${
              isContractor
                ? 'bg-amber-600'
                : isUmkm
                ? 'bg-emerald-600'
                : currentPackage === 'basic'
                ? 'bg-blue-600'
                : currentPackage === 'business'
                ? 'bg-emerald-600'
                : 'bg-slate-900 text-emerald-300'
            }`}>
              {isContractor ? (
                <Hammer className="w-4 h-4" />
              ) : isUmkm ? (
                <Store className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {isContractor ? 'Kelola Proyek' : isUmkm ? 'Kelola Usaha' : 'Kelola Lead'}
              </h2>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
                {isContractor
                  ? `Contractor ${pkgConfig.name.split(' ')[0]}`
                  : isUmkm
                  ? `UMKM ${pkgConfig.name.split(' ')[0]}`
                  : pkgConfig.name}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">

          {/* A. Persona & Role Badge */}
          <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200/80">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {currentPersona.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{currentPersona.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{currentPersona.title}</div>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border shrink-0 ${roleBadge.color}`}>
                {roleBadge.text}
              </span>
            </div>
          </div>

          {/* B. Quick Industry Mode Switcher */}
          <div>
            <div className="px-1 mb-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Mode Industri
            </div>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              {(['general', 'umkm', 'contractor'] as DemoIndustry[]).map((indKey) => {
                const isActive = currentIndustry === indKey;
                return (
                  <button
                    key={indKey}
                    type="button"
                    onClick={() => onSwitchIndustry(indKey)}
                    className={`py-1.5 rounded-md text-[11px] font-bold transition-all text-center cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {indKey === 'general' ? 'General' : indKey === 'umkm' ? 'UMKM' : 'Kontraktor'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* C. Quick Role Switcher */}
          <div>
            <div className="px-1 mb-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Sudut Pandang Role
            </div>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-center">
              {(['sales', 'supervisor', 'manager', 'admin'] as DemoRole[]).map((rKey) => {
                const isActive = currentRole === rKey;
                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => onSwitchRole(rKey)}
                    className={`py-1.5 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {rKey}
                  </button>
                );
              })}
            </div>
          </div>

          {/* D. Authorized Navigation Items (Identical to Sidebar) */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Navigasi Menu
            </div>

            {navItems
              .filter((item) => item.id !== 'profile')
              .map((item) => {
                const Icon = item.icon;

                // Action button (e.g. + Tambah Lead / Tambah Proyek)
                if (item.isAction) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAction(onOpenAddLead)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* E. Locked Feature Teasers (Identical to Sidebar) */}
          {lockedTeasers.length > 0 && (
            <div className="pt-3 border-t border-slate-100 mt-2 space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                {currentPackage === 'basic' ? 'Tersedia di Paket Atas' : 'Tersedia di Enterprise'}
              </div>

              {lockedTeasers.map((teaser) => {
                const TeaserIcon = teaser.icon;
                return (
                  <button
                    key={teaser.id}
                    type="button"
                    onClick={() =>
                      handleAction(() =>
                        onOpenLockedFeature(teaser.featureTitle, teaser.featureDesc, teaser.reqPackage)
                      )
                    }
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <TeaserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{teaser.label}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200 flex items-center gap-1 shrink-0">
                      <Lock className="w-2.5 h-2.5" /> {teaser.reqPackage === 'business' ? 'Business' : 'Enterprise'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Drawer Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-1">
          <button
            type="button"
            onClick={() => handleNavigate('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            <UserCircle2 className="w-4 h-4 text-slate-500" />
            <span>Pengaturan Akun & Profil</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction(onOpenHelp)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Panduan Demo Aplikasi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
