import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import CategoryCard from '../components/category/CategoryCard';
import { categoryService } from '../services/categoryService';
import { ChevronRight, LayoutGrid } from 'lucide-react';

export const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real categories directly from MongoDB
  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const data = await categoryService.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching categories directory:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageContainer className="pt-3 pb-16 space-y-6">
      
      {/* 1. Breadcrumb: Home > All Categories */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-bold">All Categories</span>
      </nav>

      {/* 2. Directory Header */}
      <div className="border-b border-slate-200 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
            <LayoutGrid className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            All Categories
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Explore products by category and discover useful collections.
        </p>
      </div>

      {/* 3. Zepto-Style Compact Category Tiles Grid (2 cols mobile, 3-6 cols desktop) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="aspect-[4/5] bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <LayoutGrid className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            No categories available yet
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Categories and curated collections will appear here once published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category._id || category.id || category.slug}
              category={category}
            />
          ))}
        </div>
      )}

    </PageContainer>
  );
};

export default ProductsPage;
