import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ChevronRight, FolderX, ArrowRight } from 'lucide-react';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  // Load real active categories from MongoDB
  useEffect(() => {
    categoryService.getCategories().then((cats) => setCategories(cats || []));
  }, []);

  // Find matching category metadata from real categories
  const categoryMeta = useMemo(() => {
    const found = categories.find(
      (c) => (c.slug || '').toLowerCase() === slug?.toLowerCase() ||
             (c.name || '').toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase()
    );
    if (found) return found;
    if (slug === 'deals') return { name: 'Deals', slug: 'deals', icon: 'Tag' };
    return { 
      name: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Category', 
      slug, 
      icon: 'Tag' 
    };
  }, [categories, slug]);

  // Fetch products for category
  useEffect(() => {
    async function fetchCategoryProducts() {
      setLoading(true);
      try {
        const data = await productService.getProducts({ category: slug });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [slug]);

  // Sort products based on simple sort dropdown
  const sortedProducts = useMemo(() => {
    const list = [...products];
    const getPrice = (p) => p.lowestPrice || p.currentPrice || p.marketplaceOffers?.[0]?.price || 0;

    if (sortBy === 'price_low') {
      list.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [products, sortBy]);

  // Category Not Found State
  if (!categoryMeta) {
    return (
      <PageContainer className="pt-3">
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 capitalize font-bold">{slug}</span>
        </nav>

        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4 my-4">
          <div className="p-4 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            <FolderX className="w-12 h-12" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Category Not Found</h1>
          <p className="text-xs text-slate-500 max-w-md">
            The category <strong className="text-slate-800">"{slug}"</strong> was not found.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-2.5 pb-16">
      
      {/* 1. Ultra-Compact Category Title & Count (No giant banners, no wasted vertical space) */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-5">
        <div className="flex items-baseline gap-2">
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {categoryMeta.name}
          </h1>
          <span className="text-xs font-semibold text-slate-400">
            • {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {/* Simple Sort Dropdown */}
        {sortedProducts.length > 1 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              aria-label="Sort category products"
              onChange={(e) => setSortBy(e.target.value)}
              className="font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer text-slate-800"
            >
              <option value="featured">Featured</option>
              <option value="price_low">Lowest Price</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        )}
      </div>

      {/* 2. Responsive Product Grid (1 per row mobile, 2 tablet, 3-4 desktop) */}
      <div className="w-full">
        <ProductGrid 
          products={sortedProducts} 
          isLoading={loading} 
          emptyMessage="No products available in this category yet."
        />
      </div>

    </PageContainer>
  );
};

export default CategoryPage;
