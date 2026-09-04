'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users2,
  GitPullRequest,
  Clock,
  BadgePercent,
  BarChart3,
} from 'lucide-react';
import { BusinessTabKey } from './types';

interface DemoSidebarProps {
  activeTab: BusinessTabKey;
  onSelectTab: (tab: BusinessTabKey) => void;
  leadCount: number;
  urgentFollowUpCount: number;
  dealCount: number;
}

export function DemoSidebar({
  activeTab,
  onSelectTab,
  leadCount,
  urgentFollowUpCount,
  dealCount,
}: DemoSidebarProps) {
  const menuItems: Array<{
    key: BusinessTabKey;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeVariant?: 'default' | 'urgent';
  }> = [
    {
      key: 'dashboard',
      label: 'Ringkasan Dashboard',
      icon: LayoutDashboard,
    },
    {
      key: 'leads',
      label: 'Lead & Customer',
      icon: Users2,
      badge: leadCount,
    },
    {
      key: 'pipeline',
      label: 'Sales Pipeline',
      icon: GitPullRequest,
    },
    {
      key: 'followup',
      label: 'Follow-up',
      icon: Clock,
      badge: urgentFollowUpCount,
      badgeVariant: urgentFollowUpCount > 0 ? 'urgent' : 'default',
    },
    {
      key: 'deals',
      label: 'Deal / Penjualan',
      icon: BadgePercent,
      badge: dealCount,
    },
    {
      key: 'reports',
      label: 'Laporan & KPI',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="space-y-1.5" aria-label="Menu Business CRM Demo">
      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#64756D]">
        Modul Utama CRM
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTab(item.key)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition text-left group ${
                isActive
                  ? 'bg-[#0B3D2E] text-white shadow-xs'
                  : 'text-[#10231B] hover:bg-[#F7FAF8] hover:text-[#0B3D2E]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive ? 'text-[#22C55E]' : 'text-[#64756D] group-hover:text-[#16A36A]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeVariant === 'urgent'
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : 'bg-[#EAF8F1] text-[#16A36A]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
