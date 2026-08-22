'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  CalendarClock, 
  BarChart3, 
  UserCircle2 
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddLead: () => void;
  followUpCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddLead,
  followUpCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1B2E]/95 backdrop-blur-lg border-t border-[#17324D] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around relative">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'text-[#168BFF]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Dashboard</span>
        </button>

        {/* Lead */}
        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors ${
            activeTab === 'leads' ? 'text-[#168BFF]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Lead</span>
        </button>

        {/* Center Big Add Button */}
        <div className="relative -top-5">
          <button
            type="button"
            onClick={onOpenAddLead}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#168BFF] to-[#22D3EE] flex items-center justify-center text-white shadow-[0_0_20px_rgba(22,139,255,0.6)] active:scale-95 transition-transform border-4 border-[#06111F]"
            aria-label="Tambah Lead Baru"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Follow Up */}
        <button
          type="button"
          onClick={() => setActiveTab('followup')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors relative ${
            activeTab === 'followup' ? 'text-[#168BFF]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <div className="relative">
            <CalendarClock className="w-5 h-5" />
            {followUpCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                {followUpCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Follow Up</span>
        </button>

        {/* Laporan / Profil */}
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors ${
            activeTab === 'reports' ? 'text-[#168BFF]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Laporan</span>
        </button>
      </div>
    </div>
  );
};
