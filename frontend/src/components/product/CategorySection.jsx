import React from 'react';
import CategoryHeader from '../common/CategoryHeader';
import ProductShelf from './ProductShelf';

export const CategorySection = ({ title, slug, iconName, products = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="mb-7 sm:mb-9 last:mb-2 w-full">
      <CategoryHeader
        title={title}
        slug={slug}
        iconName={iconName}
        productCount={products.length}
      />
      <ProductShelf products={products} />
    </section>
  );
};

export default CategorySection;
