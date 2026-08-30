import React from 'react';
import ProductCard from './ProductCard';
import { PackageX } from 'lucide-react';

export const ProductGrid = ({ products = [], isLoading = false, emptyMessage = "No products found." }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="h-72 w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 my-4 w-full">
        <PackageX className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">{emptyMessage}</h3>
        <p className="text-xs text-slate-500 max-w-md mt-1">
          Products published in the Admin CMS will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch">
      {products.map((product) => (
        <ProductCard key={product._id || product.id || product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
