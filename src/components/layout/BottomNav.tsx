'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  CalendarClock, 
  Menu,
  HardHat,
  Hammer
} from 'lucide-react';
import { ActiveTab, DemoRole, DemoIndustry } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  onOpenDrawer: () => void;
  followUpCount: number;
  currentRole?: DemoRole;
  currentIndustry?: DemoIndustry;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddLead,
  onOpenDrawer,
  followUpCount,
  currentRole = 'sales',
  currentIndustry = 'general',
}) => {
  const isContractor = currentIndustry === 'contractor';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 pb-safe shadow-lg"
      aria-label="Navigasi Utama Mobile"
    >
      <div className="flex items-center justify-around relative">
        {/* Slot 1: Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Dashboard</span>
        </button>

        {/* Slot 2: Leads / Proyek Aktif */}
        <button
          type="button"
          onClick={() => {
            if (isContractor) setActiveTab('contractor_project');
            else setActiveTab('leads');
          }}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-lg transition-colors cursor-pointer ${
            (isContractor && activeTab === 'contractor_project') || (!isContractor && activeTab === 'leads')
              ? 'text-emerald-700 font-bold' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label={isContractor ? 'Proyek' : 'Leads'}
        >
          {isContractor ? (
            <HardHat className="w-5 h-5" />
          ) : (
            <Users className="w-5 h-5" />
          )}
          <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[50px]">
            {isContractor ? 'Proyek' : 'Leads'}
          </span>
        </button>

        {/* Slot 3: Center Big Action Button */}
        <div className="relative -top-3.5">
          <button
            type="button"
            onClick={onOpenAddLead}
            className={`w-12 h-12 min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-all border-4 border-slate-50 cursor-pointer ${
              isContractor ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            aria-label={isContractor ? 'Tambah Proyek Baru' : 'Tambah Lead Baru'}
            title={isContractor ? 'Tambah Proyek Baru' : 'Tambah Lead Baru'}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Slot 4: Follow Up / Survey */}
        <button
          type="button"
          onClick={() => setActiveTab('followup')}
          className={`relative flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'followup'
              ? 'text-emerald-700 font-bold' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Follow Up"
        >
          <CalendarClock className="w-5 h-5" />

          {followUpCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {followUpCount > 9 ? '9+' : followUpCount}
            </span>
          )}

          <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[50px]">
            Follow Up
          </span>
        </button>

        {/* Slot 5: Menu / Drawer Toggle */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Buka Menu Lengkap"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Menu</span>
        </button>
      </div>
    </nav>
  );
};