'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string; // e.g. 'text-[#00A651]'
  iconBg: string; // e.g. 'bg-[#E8F7EF]'
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
  glowColor = 'hover:border-[#00A651]/50 hover:shadow-sm',
  onClick,
  isActive = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-white border rounded-2xl p-4 sm:p-5 transition-all duration-200 group relative overflow-hidden ${
        isActive
          ? 'border-[#00A651] shadow-md ring-2 ring-[#00A651]/20 bg-[#F4FBF7]'
          : 'border-[#E2E9E4] shadow-sm ' + glowColor
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-[#66736B] group-hover:text-[#17221C] transition-colors">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${iconBg} ${iconColor} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#17221C] tracking-tight">
          {value}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-[#66736B]">
        <span>{subtitle}</span>
      </div>
    </button>
  );
};