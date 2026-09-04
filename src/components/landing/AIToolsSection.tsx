'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Clock, Zap } from 'lucide-react';
import { AI_TOOLS } from '@/data/ai-tools';

export const AIToolsSection: React.FC = () => {
  const priorityTools = AI_TOOLS.filter((t) => t.isPriority).slice(0, 4);

  return (
    <section id="ai-tools" className="py-24 sm:py-32 bg-white text-[#10231B] border-t border-[#E2EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF8F1] text-[#0B3D2E] text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>AI FOR PRODUCTIVITY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight">
            Biarkan AI Mengerjakan Pekerjaan Berulang.
          </h2>

          <p className="text-base sm:text-lg text-[#64756D] leading-relaxed">
            Dari membuat pesan follow-up hingga menyiapkan proposal penawaran, gunakan asisten AI untuk mempercepat pekerjaan rutin yang biasanya menghabiskan waktu.
          </p>
        </div>

        {/* 4 Priority Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {priorityTools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-2xl p-6 bg-[#F7FAF8] border border-[#E2EAE5] flex flex-col justify-between hover:border-[#16A36A] hover:bg-white transition duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#16A36A] uppercase tracking-wider bg-[#EAF8F1] px-2.5 py-0.5 rounded">
                    {tool.category}
                  </span>
                  <span className="text-[10px] font-bold text-[#0B3D2E] bg-white border border-[#E2EAE5] px-2 py-0.5 rounded">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0B3D2E] leading-snug">{tool.name}</h3>
                <p className="text-xs text-[#64756D] leading-relaxed min-h-[44px]">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2EAE5] flex items-center justify-between text-xs text-[#16A36A] font-medium">
                <span className="flex items-center gap-1 text-[11px]">
                  <Zap className="w-3 h-3" />
                  {tool.timeSaved}
                </span>
                <span className="text-[10px] font-mono text-[#64756D]">AI Assisted</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link to Directory */}
        <div className="mt-12 text-center">
          <Link
            href="/ai-tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs"
          >
            <span>Lihat Semua AI Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
