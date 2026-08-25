'use client';

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#E8F7EF] border border-[#A7F3D0] flex items-center justify-center text-[#006B3C] mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-[#17221C] mb-1">{title}</h3>
      <p className="text-sm text-[#66736B] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};