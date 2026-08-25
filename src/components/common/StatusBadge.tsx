'use client';

import React from 'react';
import { LeadStatus } from '../../types';
import { getStatusTheme } from '../../utils/helpers';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const theme = getStatusTheme(status);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap tracking-tight transition-all shadow-none ${theme.bg} ${theme.text} ${theme.border} ${sizeClasses[size]} ${className}`}
    >
      {showDot && (
        <span className={`rounded-full shrink-0 ${theme.dot} ${dotSizes[size]}`} />
      )}
      <span>{theme.label}</span>
    </span>
  );
};