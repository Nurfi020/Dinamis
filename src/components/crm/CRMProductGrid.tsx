'use client';

import React from 'react';
import { CRM_PRODUCTS } from '@/data/crm-products';
import { CRMProductCard } from './CRMProductCard';

export const CRMProductGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {CRM_PRODUCTS.map((product) => (
        <CRMProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
