'use client';

import React from 'react';
import { 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Video, 
  Globe, 
  Users, 
  ShoppingBag, 
  Layers 
} from 'lucide-react';
import { LeadSource } from '../../types';

interface SourceBadgeProps {
  source: LeadSource;
  size?: 'sm' | 'md';
  showText?: boolean;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  source,
  size = 'md',
  showText = true,
  className = '',
}) => {
  const getSourceConfig = (src: LeadSource) => {
    switch (src) {
      case 'WhatsApp':
        return {
          icon: <MessageCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-emerald-700',
          bg: 'bg-emerald-50 border-emerald-200',
        };
      case 'Facebook':
        return {
          icon: <Facebook className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-blue-700',
          bg: 'bg-blue-50 border-blue-200',
        };
      case 'Instagram':
        return {
          icon: <Instagram className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-pink-700',
          bg: 'bg-pink-50 border-pink-200',
        };
      case 'TikTok':
        return {
          icon: <Video className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-slate-800',
          bg: 'bg-slate-100 border-slate-300',
        };
      case 'Website':
        return {
          icon: <Globe className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-sky-700',
          bg: 'bg-sky-50 border-sky-200',
        };
      case 'Referral':
        return {
          icon: <Users className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-amber-800',
          bg: 'bg-amber-50 border-amber-200',
        };
      case 'Marketplace':
        return {
          icon: <ShoppingBag className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-orange-700',
          bg: 'bg-orange-50 border-orange-200',
        };
      default:
        return {
          icon: <Layers className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-slate-600',
          bg: 'bg-slate-100 border-slate-200',
        };
    }
  };

  const config = getSourceConfig(source);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-semibold ${config.bg} ${config.color} ${className}`}
      title={source}
    >
      {config.icon}
      {showText && <span>{source}</span>}
    </span>
  );
};