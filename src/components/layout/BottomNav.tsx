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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 pb-safe shadow-md">
      <div className="flex items-center justify-around relative">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Dashboard</span>
        </button>

        {/* Tab 2: Leads / Branches / Users */}
        <button
          type="button"
          onClick={() => {
            if (currentRole === 'admin') setActiveTab('users');
            else if (currentRole === 'manager') setActiveTab('branches');
            else setActiveTab('leads');
          }}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'leads' || activeTab === 'branches' || activeTab === 'users' 
              ? 'text-emerald-700 font-bold' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {currentRole === 'admin' ? (
            <Users className="w-5 h-5" />
          ) : currentRole === 'manager' ? (
            <Building2 className="w-5 h-5" />
          ) : (
            <Users className="w-5 h-5" />
          )}
          <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[50px]">
            {currentRole === 'admin' ? 'Users' : currentRole === 'manager' ? 'Cabang' : 'Leads'}
          </span>
        </button>

        {/* Center Big Action Button */}
        <div className="relative -top-4">
          {currentRole === 'sales' || currentRole === 'supervisor' ? (
            <button
              type="button"
              onClick={onOpenAddLead}
              className="w-12 h-12 min-h-[48px] min-w-[48px] rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white shadow-md active:scale-95 transition-all border-4 border-slate-50 cursor-pointer"
              aria-label="Tambah Lead Baru"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="w-12 h-12 min-h-[48px] min-w-[48px] rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md active:scale-95 transition-all border-4 border-slate-50 cursor-pointer"
              aria-label="Overview"
            >
              <Building2 className="w-5 h-5 text-emerald-300" />
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
          className={`relative flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'followup' || activeTab === 'team_performance' || activeTab === 'teams' || activeTab === 'audit_log'
              ? 'text-emerald-700 font-bold' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {currentRole === 'admin' ? (
            <ShieldCheck className="w-5 h-5" />
          ) : currentRole === 'supervisor' || currentRole === 'manager' ? (
            <Award className="w-5 h-5" />
          ) : (
            <CalendarClock className="w-5 h-5" />
          )}

          {followUpCount > 0 && currentRole === 'sales' && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {followUpCount > 9 ? '9+' : followUpCount}
            </span>
          )}

          <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[50px]">
            {currentRole === 'admin' ? 'Audit' : currentRole === 'supervisor' ? 'Kinerja' : currentRole === 'manager' ? 'Tim' : 'Follow Up'}
          </span>
        </button>

        {/* Tab 4: Reports / Settings */}
        <button
          type="button"
          onClick={() => {
            if (currentRole === 'admin') setActiveTab('settings');
            else setActiveTab('reports');
          }}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'reports' || activeTab === 'settings' 
              ? 'text-emerald-700 font-bold' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">
            {currentRole === 'admin' ? 'Setting' : 'Laporan'}
          </span>
        </button>
      </div>
    </div>
  );
};