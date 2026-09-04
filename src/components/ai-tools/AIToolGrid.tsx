'use client';

import React, { useState } from 'react';
import { AI_TOOLS, AITool } from '@/data/ai-tools';
import { AIToolCard } from './AIToolCard';

export const AIToolGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sales' | 'customer' | 'business' | 'productivity'>('all');

  const filtered = selectedCategory === 'all'
    ? AI_TOOLS
    : AI_TOOLS.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(
          [
            { id: 'all', label: 'Semua AI Tools' },
            { id: 'sales', label: 'Sales & Negosiasi' },
            { id: 'customer', label: 'Customer Service' },
            { id: 'business', label: 'Bisnis & Rapat' },
            { id: 'productivity', label: 'Produktivitas' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === tab.id
                ? 'bg-[#0B3D2E] text-white shadow-xs'
                : 'bg-white border border-[#E2EAE5] text-[#64756D] hover:text-[#0B3D2E] hover:bg-[#F7FAF8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((tool) => (
          <AIToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};
