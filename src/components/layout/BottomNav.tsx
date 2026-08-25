'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  CalendarClock, 
  BarChart3 
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E2E9E4] px-2 py-1.5 pb-safe shadow-lg">
      <div className="flex items-center justify-around relative">
        {/* Dashboard */}
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

        {/* Lead */}
        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-xl transition-colors ${
            activeTab === 'leads' ? 'text-[#00A651] font-bold' : 'text-[#66736B] hover:text-[#17221C]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Lead</span>
        </button>

        {/* Center Big Add Button */}
        <div className="relative -top-5">
          <button
            type="button"
            onClick={onOpenAddLead}
            className="w-13 h-13 min-h-[48px] min-w-[48px] rounded-full bg-[#00A651] hover:bg-[#006B3C] flex items-center justify-center text-white shadow-md active:scale-95 transition-all border-4 border-[#F7F9F8] cursor-pointer"
            aria-label="Tambah Lead Baru"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Follow Up */}
        <button
          type="button"
          onClick={() => setActiveTab('followup')}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-xl transition-colors relative ${
            activeTab === 'followup' ? 'text-[#00A651] font-bold' : 'text-[#66736B] hover:text-[#17221C]'
          }`}
        >
          <div className="relative">
            <CalendarClock className="w-5 h-5" />
            {followUpCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                {followUpCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">Follow Up</span>
        </button>

        {/* Laporan */}
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center w-14 min-h-[44px] py-1 rounded-xl transition-colors ${
            activeTab === 'reports' ? 'text-[#00A651] font-bold' : 'text-[#66736B] hover:text-[#17221C]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Laporan</span>
        </button>
      </div>
    </div>
  );
};