'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { CRMProduct } from '@/data/crm-products';

interface CRMProductCardProps {
  product: CRMProduct;
}

export const CRMProductCard: React.FC<CRMProductCardProps> = ({ product }) => {
  const isAvailable = product.status === 'available';

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition duration-200 ${
        product.isPrimary
          ? 'bg-white border-2 border-[#16A36A] shadow-sm ring-4 ring-[#EAF8F1]'
          : 'bg-[#F7FAF8] border border-[#E2EAE5] opacity-95'
      }`}
    >
      <div className="space-y-5">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#64756D] uppercase tracking-wider">
            {product.category}
          </span>
          {isAvailable ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF8F1] text-[#16A36A] border border-[#D1DDD6]">
              {product.badge || 'Tersedia'}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#64756D] border border-[#E2EAE5]">
              {product.badge || 'Segera Hadir'}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className="text-2xl font-bold text-[#0B3D2E] tracking-tight">{product.name}</h3>
          <p className="text-sm font-semibold text-[#10231B] mt-1">{product.tagline}</p>
          <p className="text-xs sm:text-sm text-[#64756D] leading-relaxed mt-2">
            {product.description}
          </p>
        </div>

        {/* Feature Checklist */}
        <div className="pt-4 border-t border-[#E2EAE5] space-y-2">
          <div className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider">
            Fitur Alur Kerja
          </div>
          {product.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#10231B]">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Signals */}
        <div className="pt-3 border-t border-[#E2EAE5] flex items-center gap-3 text-xs text-[#64756D]">
          <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#E2EAE5]">
            <Zap className="w-3 h-3 text-[#16A36A]" />
            Low Setup
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#E2EAE5]">
            <ShieldCheck className="w-3 h-3 text-[#16A36A]" />
            Role-based Access
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-5 border-t border-[#E2EAE5]">
        {isAvailable ? (
          product.href.startsWith('http') ? (
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
            >
              <span>{product.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <Link
              href={product.href}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B3D2E] text-white font-semibold text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
            >
              <span>{product.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )
        ) : (
          <div className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#64756D] font-medium text-sm">
            <span>Segera Hadir</span>
          </div>
        )}
      </div>
    </div>
  );
};
