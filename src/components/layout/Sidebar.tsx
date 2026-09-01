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
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, DevModeInfo, DemoRole, DemoPersona } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  followUpCount: number;
  onOpenHelp: () => void;
  currentRole: DemoRole;
  currentPersona: DemoPersona;
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
  devModeInfo,
}) => {
  // Navigation matrix dynamically tailored to active demo role
  const getNavItems = () => {
    switch (currentRole) {
      case 'sales':
        return [
          {
            id: 'dashboard' as ActiveTab,
            label: 'Dashboard Saya',
            icon: LayoutDashboard,
          },
          {
            id: 'leads' as ActiveTab,
            label: 'Semua Lead',
            icon: Users,
          },
          {
            id: 'add_lead_action' as ActiveTab,
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
            label: 'Laporan Performa',
            icon: BarChart3,
          },
          {
            id: 'profile' as ActiveTab,
            label: 'Pengaturan & Profil',
            icon: UserCircle2,
          },
        ];

      case 'supervisor':
        return [
          {
            id: 'dashboard' as ActiveTab,
            label: 'Dashboard Tim',
            icon: LayoutDashboard,
          },
          {
            id: 'leads' as ActiveTab,
            label: 'Lead Anggota Tim',
            icon: Users,
          },
          {
            id: 'add_lead_action' as ActiveTab,
            label: 'Tambah Lead Tim',
            icon: PlusCircle,
            isAction: true,
          },
          {
            id: 'followup' as ActiveTab,
            label: 'Follow Up Tim',
            icon: CalendarClock,
            badge: followUpCount > 0 ? followUpCount : undefined,
          },
          {
            id: 'team_performance' as ActiveTab,
            label: 'Kinerja Sales Tim',
            icon: Award,
          },
          {
            id: 'reports' as ActiveTab,
            label: 'Laporan Tim',
            icon: BarChart3,
          },
          {
            id: 'profile' as ActiveTab,
            label: 'Profil Supervisor',
            icon: UserCircle2,
          },
        ];

      case 'manager':
        return [
          {
            id: 'dashboard' as ActiveTab,
            label: 'Dashboard Eksekutif',
            icon: LayoutDashboard,
          },
          {
            id: 'branches' as ActiveTab,
            label: 'Kinerja Cabang',
            icon: Building2,
          },
          {
            id: 'teams' as ActiveTab,
            label: 'Kinerja Tim Unit',
            icon: Users,
          },
          {
            id: 'leads' as ActiveTab,
            label: 'Semua Pipeline Lead',
            icon: Layers,
          },
          {
            id: 'reports' as ActiveTab,
            label: 'Laporan Manajemen',
            icon: BarChart3,
          },
          {
            id: 'profile' as ActiveTab,
            label: 'Profil Manager',
            icon: UserCircle2,
          },
        ];

      case 'admin':
        return [
          {
            id: 'dashboard' as ActiveTab,
            label: 'Dashboard Sistem',
            icon: LayoutDashboard,
          },
          {
            id: 'users' as ActiveTab,
            label: 'Manajemen Pengguna',
            icon: Users,
          },
          {
            id: 'branches' as ActiveTab,
            label: 'Master Cabang & Tim',
            icon: Building2,
          },
          {
            id: 'admin_licenses' as ActiveTab,
            label: 'Manajemen Lisensi',
            icon: KeyRound,
          },
          {
            id: 'audit_log' as ActiveTab,
            label: 'Audit & Activity Log',
            icon: Activity,
          },
          {
            id: 'settings' as ActiveTab,
            label: 'Pengaturan Sistem',
            icon: Settings,
          },
          {
            id: 'profile' as ActiveTab,
            label: 'Profil Admin',
            icon: UserCircle2,
          },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleHeaderBadge = () => {
    switch (currentRole) {
      case 'sales':
        return { text: 'Sales Portal', color: 'text-[#00A651] bg-[#E8F7EF]' };
      case 'supervisor':
        return { text: 'Supervisor Portal', color: 'text-amber-800 bg-amber-50' };
      case 'manager':
        return { text: 'Management Portal', color: 'text-indigo-800 bg-indigo-50' };
      case 'admin':
        return { text: 'Admin Portal', color: 'text-slate-800 bg-slate-100' };
    }
  };

  const roleBadge = getRoleHeaderBadge();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E9E4] h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E2E9E4] flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00A651] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#17221C] tracking-tight leading-tight">
              Kelola Lead
            </h1>
            <span className="text-xs font-bold text-[#00A651] tracking-wider uppercase">
              Enterprise CRM
            </span>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border border-current ${roleBadge.color}`}>
          {currentRole}
        </span>
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

      {/* Footer / User Profile Context & Status */}
      <div className="p-3 border-t border-[#E2E9E4] space-y-2">
        <div className="p-2.5 rounded-xl bg-[#F7F9F8] border border-[#E2E9E4] text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00A651] text-white font-bold text-xs flex items-center justify-center">
              {currentPersona.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[#17221C] truncate text-xs">{currentPersona.name}</div>
              <div className="text-[10px] text-[#66736B] truncate">{currentPersona.title}</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenHelp}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#66736B] hover:text-[#17221C] hover:bg-[#F4FBF7] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#00A651]" />
          <span>Panduan Enterprise Demo</span>
        </button>
      </div>
    </aside>
  );
};