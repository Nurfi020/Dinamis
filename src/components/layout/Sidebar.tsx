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
  Code2
} from 'lucide-react';
import { ActiveTab, DevModeInfo } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  followUpCount: number;
  onOpenHelp: () => void;
  devModeInfo?: DevModeInfo | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddLead,
  followUpCount,
  onOpenHelp,
  devModeInfo,
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
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E9E4] h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E2E9E4] flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#00A651] flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-[#17221C] tracking-tight leading-tight">
            Kelola Lead
          </h1>
          <span className="text-xs font-bold text-[#00A651] tracking-wider uppercase">
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
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#00A651] hover:bg-[#006B3C] transition-all duration-150 my-2.5 shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Icon className="w-4 h-4" />
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#E8F7EF] text-[#006B3C] font-bold'
                  : 'text-[#66736B] hover:text-[#17221C] hover:bg-[#F4FBF7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00A651]' : 'text-[#66736B]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#00A651] text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Help & Status */}
      <div className="p-3 border-t border-[#E2E9E4] space-y-2">

        <button
          type="button"
          onClick={onOpenHelp}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#66736B] hover:text-[#17221C] hover:bg-[#F4FBF7] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#00A651]" />
          <span>Panduan & Bantuan</span>
        </button>

        <div className="px-3.5 py-2.5 rounded-xl bg-[#F7F9F8] border border-[#E2E9E4] text-[11px] text-[#66736B]">
          <div className="flex items-center justify-between">
            <span className="text-[#17221C] font-bold">Mode Offline</span>
            <span className="w-2 h-2 rounded-full bg-[#00A651] animate-pulse"></span>
          </div>
          <span className="text-[10px] text-[#66736B]">Data tersimpan lokal otomatis</span>
        </div>
      </div>
    </aside>
  );
};