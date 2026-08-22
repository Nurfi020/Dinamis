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
      <div className="w-14 h-14 rounded-2xl bg-[#0E233D] border border-[#17324D] flex items-center justify-center text-[#168BFF] mb-4 shadow-[0_0_20px_rgba(22,139,255,0.15)]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">{title}</h3>
      <p className="text-sm text-[#94A3B8] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white font-medium text-sm transition-all shadow-[0_0_15px_rgba(22,139,255,0.3)] active:scale-95"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
