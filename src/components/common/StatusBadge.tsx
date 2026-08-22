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
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap tracking-wide transition-all ${theme.bg} ${theme.text} ${theme.border} ${theme.glow} ${sizeClasses[size]} ${className}`}
    >
      {showDot && (
        <span className={`rounded-full ${theme.dot} ${dotSizes[size]}`} />
      )}
      <span>{theme.label}</span>
    </span>
  );
};
