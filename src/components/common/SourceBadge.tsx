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
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
        };
      case 'Facebook':
        return {
          icon: <Facebook className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10 border-blue-500/30',
        };
      case 'Instagram':
        return {
          icon: <Instagram className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-pink-400',
          bg: 'bg-pink-500/10 border-pink-500/30',
        };
      case 'TikTok':
        return {
          icon: <Video className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10 border-cyan-500/30',
        };
      case 'Website':
        return {
          icon: <Globe className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-sky-400',
          bg: 'bg-sky-500/10 border-sky-500/30',
        };
      case 'Referral':
        return {
          icon: <Users className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30',
        };
      case 'Marketplace':
        return {
          icon: <ShoppingBag className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-orange-400',
          bg: 'bg-orange-500/10 border-orange-500/30',
        };
      default:
        return {
          icon: <Layers className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          color: 'text-slate-400',
          bg: 'bg-slate-500/10 border-slate-500/30',
        };
    }
  };

  const config = getSourceConfig(source);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-medium ${config.bg} ${config.color} ${className}`}
      title={source}
    >
      {config.icon}
      {showText && <span>{source}</span>}
    </span>
  );
};
