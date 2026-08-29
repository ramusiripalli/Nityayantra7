import React from 'react';
import ProductCard from './ProductCard';
import { PackageX } from 'lucide-react';

export const ProductGrid = ({ products = [], isLoading = false, emptyMessage = "No products found matching your search." }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((idx) => (
          <div key={idx} className="h-64 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
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
          Try adjusting your search terms or filter categories to find the smart gadgets you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 items-stretch w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
