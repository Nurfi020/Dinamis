'use client';

import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { AITool } from '@/data/ai-tools';

interface AIToolCardProps {
  tool: AITool;
}

export const AIToolCard: React.FC<AIToolCardProps> = ({ tool }) => {
  return (
    <div
      className={`rounded-2xl p-6 bg-white border border-[#E2EAE5] flex flex-col justify-between hover:border-[#16A36A] transition duration-150 ${
        tool.isPriority ? 'ring-2 ring-[#EAF8F1]' : ''
      }`}
    >
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-[#16A36A] uppercase tracking-wider bg-[#EAF8F1] px-2.5 py-0.5 rounded">
            {tool.category}
          </span>
          <span className="text-[10px] font-bold text-[#64756D] bg-[#F7FAF8] border border-[#E2EAE5] px-2 py-0.5 rounded">
            {tool.badge || 'Segera Hadir'}
          </span>
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className="text-lg font-bold text-[#0B3D2E] leading-snug">{tool.name}</h3>
          <p className="text-xs font-semibold text-[#10231B] mt-1">{tool.tagline}</p>
          <p className="text-xs text-[#64756D] leading-relaxed mt-2">{tool.description}</p>
        </div>

        {/* Use Case Box */}
        <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#64756D] space-y-1">
          <div className="font-bold text-[#0B3D2E] text-[11px]">Skenario Penggunaan:</div>
          <p className="leading-relaxed text-[11px]">{tool.useCase}</p>
        </div>
      </div>

      {/* Footer Metrics & Action */}
      <div className="mt-5 pt-3.5 border-t border-[#E2EAE5] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-[#16A36A] font-medium text-[11px]">
            <Zap className="w-3.5 h-3.5" />
            {tool.timeSaved}
          </span>
          <span className="font-semibold text-[#64756D] text-[11px]">AI Assisted</span>
        </div>

        {tool.externalUrl ? (
          <a
            href={tool.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#16A36A] transition shadow-xs"
          >
            <span>Gunakan Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <div className="w-full py-2 px-3 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-center text-xs font-semibold text-[#64756D]">
            Segera Hadir
          </div>
        )}
      </div>
    </div>
  );
};
