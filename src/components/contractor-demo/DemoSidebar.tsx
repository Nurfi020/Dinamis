'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users2,
  MapPin,
  FileSpreadsheet,
  FolderKanban,
  FileCheck2,
  ShoppingCart,
  Users,
  Clock,
  BarChart3,
} from 'lucide-react';

export type DemoTabKey =
  | 'dashboard'
  | 'leads'
  | 'survey'
  | 'rab'
  | 'projects'
  | 'spk'
  | 'material'
  | 'team'
  | 'activity'
  | 'reports';

interface DemoSidebarProps {
  activeTab: DemoTabKey;
  onSelectTab: (tab: DemoTabKey) => void;
  leadCount: number;
  projectCount: number;
  surveyCount: number;
}

const MENU_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'leads', label: 'Leads & Prospek', icon: Users2, badgeKey: 'leads' },
  { key: 'survey', label: 'Survei Lokasi', icon: MapPin, badgeKey: 'surveys' },
  { key: 'rab', label: 'Estimasi RAB', icon: FileSpreadsheet },
  { key: 'projects', label: 'Pipeline Proyek', icon: FolderKanban, badgeKey: 'projects' },
  { key: 'spk', label: 'Kontrak SPK', icon: FileCheck2 },
  { key: 'material', label: 'Kontrol Material', icon: ShoppingCart },
  { key: 'team', label: 'Manajemen Tim', icon: Users },
  { key: 'activity', label: 'Aktivitas', icon: Clock },
  { key: 'reports', label: 'Laporan', icon: BarChart3 },
];

export const DemoSidebar: React.FC<DemoSidebarProps> = ({
  activeTab,
  onSelectTab,
  leadCount,
  projectCount,
  surveyCount,
}) => {
  return (
    <div className="w-full space-y-1">
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#64756D] px-3 py-2">
        Menu Aplikasi
      </div>
      <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          let badgeNum = 0;
          if (item.badgeKey === 'leads') badgeNum = leadCount;
          if (item.badgeKey === 'projects') badgeNum = projectCount;
          if (item.badgeKey === 'surveys') badgeNum = surveyCount;

          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key as DemoTabKey)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap lg:whitespace-normal w-auto lg:w-full shrink-0 ${
                isActive
                  ? 'bg-[#0B3D2E] text-white shadow-xs'
                  : 'text-[#64756D] hover:bg-white hover:text-[#0B3D2E] bg-white/40 border border-transparent hover:border-[#E2EAE5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#22C55E]' : 'text-[#16A36A]'}`} />
                <span>{item.label}</span>
              </div>
              {badgeNum > 0 && (
                <span
                  className={`hidden lg:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EAF8F1] text-[#16A36A]'
                  }`}
                >
                  {badgeNum}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
