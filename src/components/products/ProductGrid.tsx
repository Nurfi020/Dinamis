'use client';

import React from 'react';
import { DIGITAL_PRODUCTS } from '@/data/digital-products';
import { ProductCard } from './ProductCard';

export const ProductGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {DIGITAL_PRODUCTS.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
