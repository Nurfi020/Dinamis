'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Check, Zap } from 'lucide-react';
import { DigitalProduct } from '@/data/digital-products';

interface ProductCardProps {
  product: DigitalProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="rounded-2xl p-6 sm:p-7 bg-white border border-[#E2EAE5] flex flex-col justify-between hover:border-[#16A36A] hover:shadow-xs transition duration-150">
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-[#16A36A] uppercase tracking-wider bg-[#EAF8F1] px-2.5 py-0.5 rounded">
            {product.category}
          </span>
          <span className="text-[10px] font-bold text-[#0B3D2E] bg-[#EAF8F1] px-2 py-0.5 rounded">
            {product.badge || 'Siap Pakai'}
          </span>
        </div>

        {/* Title, Price, Description */}
        <div>
          <h3 className="text-lg font-bold text-[#0B3D2E] leading-snug">{product.name}</h3>
          <div className="text-2xl font-extrabold text-[#10231B] mt-1">{product.formattedPrice}</div>
          <p className="text-xs sm:text-sm text-[#64756D] leading-relaxed mt-2 min-h-[44px]">
            {product.description}
          </p>
        </div>

        {/* What You Get Highlights */}
        <div className="pt-3 border-t border-[#E2EAE5] space-y-1.5">
          <div className="text-[11px] font-bold text-[#0B3D2E] uppercase tracking-wider">
            Isi Paket & Template:
          </div>
          {product.whatYouGet.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-[#10231B]">
              <Check className="w-3.5 h-3.5 text-[#16A36A] shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 pt-4 border-t border-[#E2EAE5]">
        {product.externalUrl ? (
          <a
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0B3D2E] text-white font-semibold text-xs hover:bg-[#16A36A] transition shadow-xs"
          >
            <span>Dapatkan Produk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            href={product.href}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] text-[#0B3D2E] font-semibold text-xs hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E] transition"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
