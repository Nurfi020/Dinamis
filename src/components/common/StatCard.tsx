'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
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
  glowColor = 'hover:border-slate-300 hover:shadow-sm',
  onClick,
  isActive = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-white border rounded-xl p-4 sm:p-5 transition-all duration-150 group relative overflow-hidden cursor-pointer ${
        isActive
          ? 'border-emerald-600 shadow-sm ring-2 ring-emerald-600/15 bg-emerald-50/30'
          : 'border-slate-200 shadow-xs ' + glowColor
      }`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconBg} ${iconColor} transition-transform duration-150 group-hover:scale-105 shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
          {value}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>{subtitle}</span>
      </div>
    </button>
  );
};