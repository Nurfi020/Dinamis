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
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  followUpCount: number;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddLead,
  followUpCount,
  onOpenHelp,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'leads' as ActiveTab,
      label: 'Semua Lead',
      icon: Users,
    },
    {
      id: 'add_lead_action',
      label: 'Tambah Lead',
      icon: PlusCircle,
      isAction: true,
    },
    {
      id: 'followup' as ActiveTab,
      label: 'Follow Up',
      icon: CalendarClock,
      badge: followUpCount > 0 ? followUpCount : undefined,
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Laporan',
      icon: BarChart3,
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Pengaturan & Profil',
      icon: UserCircle2,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0B1B2E] border-r border-[#17324D] h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#17324D]/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#168BFF] to-[#22D3EE] flex items-center justify-center text-white shadow-[0_0_15px_rgba(22,139,255,0.4)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[#F8FAFC] tracking-tight leading-tight">
            Kelola Lead
          </h1>
          <span className="text-xs font-semibold text-[#168BFF] tracking-wider uppercase">
            Sales CRM
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={onOpenAddLead}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#168BFF] bg-[#168BFF]/10 hover:bg-[#168BFF]/20 border border-[#168BFF]/30 transition-all duration-150 my-2 group shadow-[0_0_12px_rgba(22,139,255,0.1)] active:scale-[0.98]"
              >
                <Icon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                <span>+ Tambah Lead</span>
              </button>
            );
          }

          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#168BFF] text-white font-semibold shadow-[0_0_20px_rgba(22,139,255,0.35)]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E233D]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-[#168BFF] text-white shadow-[0_0_10px_rgba(22,139,255,0.4)]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Help */}
      <div className="p-3 border-t border-[#17324D]/60 space-y-2">
        <button
          type="button"
          onClick={onOpenHelp}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E233D] transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#94A3B8]" />
          <span>Panduan & Bantuan</span>
        </button>

        <div className="px-3 py-2 rounded-xl bg-[#06111F] border border-[#17324D] text-[11px] text-[#94A3B8]">
          <div className="flex items-center justify-between">
            <span className="text-[#F8FAFC] font-semibold">Mode Offline</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <span className="text-[10px] text-slate-400">Data tersimpan lokal</span>
        </div>
      </div>
    </aside>
  );
};
