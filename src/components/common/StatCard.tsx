'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string; // e.g. 'text-[#168BFF]'
  iconBg: string; // e.g. 'bg-[#168BFF]/10'
  glowColor?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  glowColor = 'hover:border-[#168BFF]/60 hover:shadow-[0_0_20px_rgba(22,139,255,0.15)]',
  onClick,
  isActive = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-[#0B1B2E] border rounded-xl p-4 transition-all duration-200 group relative overflow-hidden ${
        isActive
          ? 'border-[#168BFF] shadow-[0_0_20px_rgba(22,139,255,0.25)] ring-1 ring-[#168BFF]'
          : 'border-[#17324D] ' + glowColor
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
          {value}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-[#94A3B8]">
        <span>{subtitle}</span>
      </div>
    </button>
  );
};
