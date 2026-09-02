'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  CalendarClock,
  BarChart3,
  UserCircle2,
  HelpCircle,
  Sparkles,
  Building2,
  Award,
  Layers,
  KeyRound,
  Activity,
  Settings,
  Briefcase,
  ShieldCheck,
  Lock,
  Hammer,
  Store,
  FileSpreadsheet,
  FileText,
  HardHat,
  Wallet
} from 'lucide-react';
import { ActiveTab, DevModeInfo, DemoRole, DemoPersona, DemoPackage, DemoIndustry } from '../../types';
import { DEMO_PACKAGES } from '../../data/packageDemoData';
import { DEMO_INDUSTRIES } from '../../data/contractorDemoData';
import { getNavItems, getLockedTeasers } from '../../utils/navigation';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  followUpCount: number;
  onOpenHelp: () => void;
  currentRole: DemoRole;
  currentPersona: DemoPersona;
  currentPackage: DemoPackage;
  currentIndustry?: DemoIndustry;
  onOpenLockedFeature: (title: string, desc: string, reqPkg: DemoPackage) => void;
  devModeInfo?: DevModeInfo | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddLead,
  followUpCount,
  onOpenHelp,
  currentRole,
  currentPersona,
  currentPackage,
  currentIndustry = 'general',
  onOpenLockedFeature,
  devModeInfo,
}) => {
  const pkgConfig = DEMO_PACKAGES[currentPackage];
  const isContractor = currentIndustry === 'contractor';
  const isUmkm = currentIndustry === 'umkm';

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

  const getRoleHeaderBadge = () => {
    switch (currentRole) {
      case 'sales':
        return {
          text: isContractor ? 'Estimator' : isUmkm ? 'Sales UMKM' : 'Sales',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'supervisor':
        return {
          text: isContractor ? 'SPV Proyek' : isUmkm ? 'SPV Toko' : 'Supervisor',
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

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-2xs ${
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
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
              {isContractor ? 'Kelola Proyek' : isUmkm ? 'Kelola Usaha' : 'Kelola Lead'}
            </h1>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              {isContractor
                ? `Contractor ${pkgConfig.name.split(' ')[0]}`
                : isUmkm
                ? `UMKM ${pkgConfig.name.split(' ')[0]}`
                : pkgConfig.name}
            </span>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${roleBadge.color}`}>
          {roleBadge.text}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={onOpenAddLead}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors my-2 shadow-2xs active:scale-[0.98] cursor-pointer"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          }

          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border-l-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* LOCKED FEATURE TEASERS IN BASIC / BUSINESS */}
        {lockedTeasers.length > 0 && (
          <div className="pt-3 border-t border-slate-100 mt-2 space-y-0.5">
            <div className="px-3 text-[9px] font-bold uppercase text-slate-400 tracking-wider">
              {currentPackage === 'basic' ? 'Tersedia di Paket Atas' : 'Tersedia di Enterprise'}
            </div>
            {lockedTeasers.map((teaser) => {
              const TeaserIcon = teaser.icon;
              return (
                <button
                  key={teaser.id}
                  type="button"
                  onClick={() =>
                    onOpenLockedFeature(teaser.featureTitle, teaser.featureDesc, teaser.reqPackage)
                  }
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <TeaserIcon className="w-4 h-4 text-slate-400" />
                    <span>{teaser.label}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> {teaser.reqPackage === 'business' ? 'Business' : 'Enterprise'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Package & Persona Context */}
      <div className="p-3 border-t border-slate-200 space-y-1.5">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
              {currentPersona.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-900 truncate text-xs">{currentPersona.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{currentPersona.title}</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenHelp}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Panduan Demo</span>
        </button>
      </div>
    </aside>
  );
};