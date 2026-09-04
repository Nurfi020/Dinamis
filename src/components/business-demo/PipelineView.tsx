'use client';

import React from 'react';
import {
  GitPullRequest,
  Building,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { DemoLead, PipelineStage } from './types';

interface PipelineViewProps {
  leads: DemoLead[];
  onUpdateStage: (id: string, stage: PipelineStage, note?: string) => void;
}

const STAGES: Array<{
  key: PipelineStage;
  label: string;
  badgeBg: string;
  badgeText: string;
}> = [
  {
    key: 'Lead Baru',
    label: '1. Lead Baru',
    badgeBg: 'bg-[#F7FAF8]',
    badgeText: 'text-[#64756D]',
  },
  {
    key: 'Dihubungi',
    label: '2. Dihubungi',
    badgeBg: 'bg-[#EAF8F1]',
    badgeText: 'text-[#16A36A]',
  },
  {
    key: 'Follow-up',
    label: '3. Follow-up',
    badgeBg: 'bg-[#EAF8F1]',
    badgeText: 'text-[#0B3D2E]',
  },
  {
    key: 'Negosiasi',
    label: '4. Negosiasi',
    badgeBg: 'bg-[#FEF3C7]',
    badgeText: 'text-[#D97706]',
  },
  {
    key: 'Deal',
    label: '5. Deal (Closing)',
    badgeBg: 'bg-[#DCFCE7]',
    badgeText: 'text-[#15803D]',
  },
  {
    key: 'Tidak Jadi',
    label: '6. Tidak Jadi',
    badgeBg: 'bg-[#FEE2E2]',
    badgeText: 'text-[#DC2626]',
  },
];

export function PipelineView({ leads, onUpdateStage }: PipelineViewProps) {
  const totalPipelineValue = leads
    .filter((l) => l.stage !== 'Tidak Jadi')
    .reduce((sum, l) => sum + l.potentialValue, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E]">
            Sales Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-[#64756D]">
            Pantau posisi tahapan prospek dari kontak pertama hingga closing deal.
          </p>
        </div>

        <div className="p-3 px-4 rounded-2xl bg-white border border-[#E2EAE5] text-xs space-y-0.5 shadow-2xs">
          <div className="text-[#64756D]">Total Nilai Pipeline Aktif:</div>
          <div className="text-sm sm:text-base font-extrabold text-[#0B3D2E]">
            Rp {totalPipelineValue.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {STAGES.map((stg) => {
          const stageLeads = leads.filter((l) => l.stage === stg.key);
          const stageTotal = stageLeads.reduce((sum, l) => sum + l.potentialValue, 0);

          return (
            <div
              key={stg.key}
              className="rounded-3xl bg-white border border-[#E2EAE5] p-3 sm:p-4 shadow-2xs space-y-3 flex flex-col min-w-[200px]"
            >
              {/* Column Header */}
              <div className="pb-2 border-b border-[#E2EAE5] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0B3D2E]">
                    {stg.label}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stg.badgeBg} ${stg.badgeText}`}
                  >
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[10px] text-[#64756D]">
                  Rp {stageTotal.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Lead Cards List */}
              <div className="space-y-2.5 min-h-[140px]">
                {stageLeads.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-dashed border-[#E2EAE5] text-center text-[11px] text-[#64756D]">
                    Kosong
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/\D/g, '');
                    const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}`;

                    return (
                      <div
                        key={lead.id}
                        className="p-3 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] hover:border-[#16A36A] hover:bg-white transition space-y-2 shadow-2xs text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#10231B] text-xs">
                            {lead.name}
                          </div>
                          <div className="text-[10px] text-[#64756D] truncate">
                            {lead.company}
                          </div>
                        </div>

                        <div className="text-[11px] font-extrabold text-[#0B3D2E]">
                          Rp {lead.potentialValue.toLocaleString('id-ID')}
                        </div>

                        <div className="text-[10px] text-[#64756D] bg-white p-1.5 rounded-lg border border-[#E2EAE5] truncate">
                          {lead.interestProduct}
                        </div>

                        {/* Stage Selector Action */}
                        <div className="pt-1 border-t border-[#E2EAE5] flex items-center justify-between gap-1">
                          <select
                            value={lead.stage}
                            onChange={(e) =>
                              onUpdateStage(lead.id, e.target.value as PipelineStage)
                            }
                            className="w-full text-[10px] font-bold text-[#0B3D2E] bg-white border border-[#D1DDD6] rounded-md py-1 px-1 focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s.key} value={s.key}>
                                Pindah ke: {s.key}
                              </option>
                            ))}
                          </select>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-[#EAF8F1] text-[#16A36A] hover:bg-[#16A36A] hover:text-white transition shrink-0"
                            title="Buka WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
