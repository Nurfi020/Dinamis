'use client';

import React from 'react';
import { Clock, Sparkles, Filter } from 'lucide-react';
import { DemoActivity } from './types';

interface ActivityViewProps {
  activities: DemoActivity[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#16A36A]" />
          <h2 className="text-xl font-extrabold text-[#0B3D2E]">Jejak Riwayat Aktivitas & Audit Log</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
          Perekaman otomatis setiap aksi operasional (update lead, survei, item RAB, belanja material) untuk akuntabilitas tim.
        </p>
      </div>

      {/* Activity Timeline Card */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="divide-y divide-[#E2EAE5]">
          {activities.map((act) => (
            <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-[#EAF8F1] text-[#16A36A] flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-[#10231B]">{act.title}</h4>
                  <span className="text-[10px] font-mono text-[#64756D] bg-[#F7FAF8] px-2 py-0.5 rounded-full border border-[#E2EAE5] self-start sm:self-auto">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#64756D] leading-relaxed">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
