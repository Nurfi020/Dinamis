'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  CalendarClock, 
  BarChart3,
  Building2,
  ShieldCheck,
  Award
} from 'lucide-react';
import { ActiveTab, DemoRole } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  followUpCount: number;
  currentRole?: DemoRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddLead,
  followUpCount,
  currentRole = 'sales',
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E2E9E4] px-2 py-1.5 pb-safe shadow-lg">
      <div className="flex items-center justify-around relative">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'text-[#00A651] font-bold' : 'text-[#66736B] hover:text-[#17221C]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Dashboard</span>
        </button>

        {/* Tab 2: Leads / Branches / Users */}
        <button
          type="button"
          onClick={() => {
            if (currentRole === 'admin') setActiveTab('users');
            else if (currentRole === 'manager') setActiveTab('branches');
            else setActiveTab('leads');
          }}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-xl transition-colors ${
            activeTab === 'leads' || activeTab === 'branches' || activeTab === 'users' 
              ? 'text-[#00A651] font-bold' 
              : 'text-[#66736B] hover:text-[#17221C]'
          }`}
        >
          {currentRole === 'admin' ? (
            <Users className="w-5 h-5" />
          ) : currentRole === 'manager' ? (
            <Building2 className="w-5 h-5" />
          ) : (
            <Users className="w-5 h-5" />
          )}
          <span className="text-[10px] font-semibold mt-1 truncate max-w-[50px]">
            {currentRole === 'admin' ? 'Users' : currentRole === 'manager' ? 'Cabang' : 'Leads'}
          </span>
        </button>

        {/* Center Big Action / Portal Button */}
        <div className="relative -top-5">
          {currentRole === 'sales' || currentRole === 'supervisor' ? (
            <button
              type="button"
              onClick={onOpenAddLead}
              className="w-13 h-13 min-h-[48px] min-w-[48px] rounded-full bg-[#00A651] hover:bg-[#006B3C] flex items-center justify-center text-white shadow-md active:scale-95 transition-all border-4 border-[#F7F9F8] cursor-pointer"
              aria-label="Tambah Lead Baru"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="w-13 h-13 min-h-[48px] min-w-[48px] rounded-full bg-[#006B3C] flex items-center justify-center text-white shadow-md active:scale-95 transition-all border-4 border-[#F7F9F8] cursor-pointer"
              aria-label="Overview"
            >
              <Building2 className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Tab 3: Follow Up / Performance / Audit */}
        <button
          type="button"
          onClick={() => {
            if (currentRole === 'admin') setActiveTab('audit_log');
            else if (currentRole === 'manager') setActiveTab('teams');
            else if (currentRole === 'supervisor') setActiveTab('team_performance');
            else setActiveTab('followup');
          }}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-xl transition-colors relative ${
            activeTab === 'followup' || activeTab === 'team_performance' || activeTab === 'teams' || activeTab === 'audit_log'
              ? 'text-[#00A651] font-bold' 
              : 'text-[#66736B] hover:text-[#17221C]'
          }`}
        >
          <div className="relative">
            {currentRole === 'supervisor' ? (
              <Award className="w-5 h-5" />
            ) : currentRole === 'manager' ? (
              <Users className="w-5 h-5" />
            ) : currentRole === 'admin' ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <CalendarClock className="w-5 h-5" />
            )}
            {followUpCount > 0 && currentRole === 'sales' && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                {followUpCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1 truncate max-w-[50px]">
            {currentRole === 'supervisor' ? 'Kinerja' : currentRole === 'manager' ? 'Teams' : currentRole === 'admin' ? 'Audit' : 'Follow Up'}
          </span>
        </button>

        {/* Tab 4: Reports / Settings */}
        <button
          type="button"
          onClick={() => {
            if (currentRole === 'admin') setActiveTab('settings');
            else setActiveTab('reports');
          }}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-xl transition-colors ${
            activeTab === 'reports' || activeTab === 'settings' ? 'text-[#00A651] font-bold' : 'text-[#66736B] hover:text-[#17221C]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">
            {currentRole === 'admin' ? 'Setting' : 'Laporan'}
          </span>
        </button>
      </div>
    </div>
  );
};