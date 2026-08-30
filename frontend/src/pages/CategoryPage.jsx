import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ChevronRight, FolderX, ArrowRight, ArrowUpDown } from 'lucide-react';

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
      <PageContainer>
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-sky-600">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 capitalize font-bold">{slug}</span>
        </nav>

        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4 my-6">
          <div className="p-4 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            <FolderX className="w-12 h-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Category Not Found</h1>
          <p className="text-sm text-slate-500 max-w-md">
            The category <strong className="text-slate-800">"{slug}"</strong> was not found. Browse our available products below.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      
      {/* 1. Breadcrumb: Home > Categories > [Category Name] */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5 overflow-x-auto">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-sky-600">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">{categoryMeta.name}</span>
      </nav>

      {/* 2. Category Section Header */}
      <SectionHeader
        badge="Category Catalogue"
        title={`${categoryMeta.name} Products`}
        subtitle={`Explore ${categoryMeta.name.toLowerCase()} products, compare prices and watch reviews.`}
      />

      {/* 3. Clean Full-Width Toolbar (Product Count + Simple Sort) */}
      <div className="flex items-center justify-between gap-3 py-3 border-y border-slate-200/90 mb-6">
        <span className="text-xs sm:text-sm font-bold text-slate-700">
          <strong className="text-slate-900 font-black">{sortedProducts.length}</strong>{' '}
          {categoryMeta.name} {sortedProducts.length === 1 ? 'product' : 'products'}
        </span>

        {/* Simple Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-500 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            aria-label="Sort category products"
            onChange={(e) => setSortBy(e.target.value)}
            className="font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer text-xs text-slate-800"
          >
            <option value="featured">Featured</option>
            <option value="price_low">Lowest Price</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* 4. Full-Width Product Grid (4-6 columns on desktop, exactly 2 on mobile) */}
      <div className="w-full mb-16">
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
