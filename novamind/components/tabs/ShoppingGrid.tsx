'use client';

import type { ProductResult } from '@/types/search';
import { Star, ExternalLink } from 'lucide-react';

interface ShoppingGridProps {
  products: ProductResult[];
}

export default function ShoppingGrid({ products }: ShoppingGridProps) {
  if (!products.length) {
    return <div className="py-12 text-center text-zinc-500">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4" id="shopping-grid">
      {products.map(product => (
        <a
          key={product.id}
          href={product.sellerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-2xl border border-zinc-200 overflow-hidden bg-white hover:shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
        >
          {/* Image */}
          <div className="relative pt-[100%] bg-zinc-50 dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Details */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.title}
            </h3>
            
            <div className="mt-auto">
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{product.rating}</span>
                  {product.reviewCount && (
                    <span className="text-xs text-zinc-500">({product.reviewCount})</span>
                  )}
                </div>
              )}
              
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{product.price}</div>
                  <div className="text-xs text-zinc-500">{product.seller}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors dark:bg-zinc-800 dark:group-hover:bg-blue-900/50">
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 transition-colors dark:group-hover:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
