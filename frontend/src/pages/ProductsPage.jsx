import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { ChevronRight, ArrowUpDown } from 'lucide-react';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  // Fetch product dataset directly from MongoDB
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await productService.getProducts({});
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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

  return (
    <PageContainer>
      
      {/* 1. Breadcrumb: Home > All Products */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">All Products</span>
      </nav>

      {/* 2. Page Header */}
      <SectionHeader
        badge="Full Catalog"
        title="All Products"
        subtitle="Explore all products across categories, compare prices and watch reviews."
      />

      {/* 3. Clean Full-Width Toolbar (Count + Simple Sort) */}
      <div className="flex items-center justify-between gap-3 py-3 border-y border-slate-200/90 mb-6">
        <span className="text-xs sm:text-sm font-bold text-slate-700">
          <strong className="text-slate-900 font-black">{sortedProducts.length}</strong>{' '}
          {sortedProducts.length === 1 ? 'product found' : 'products found'}
        </span>

        {/* Simple Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-500 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            aria-label="Sort all products"
            onChange={(e) => setSortBy(e.target.value)}
            className="font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer text-xs text-slate-800"
          >
            <option value="featured">Featured</option>
            <option value="price_low">Lowest Price</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* 4. Full-Width Product Grid */}
      <div className="w-full mb-16">
        <ProductGrid 
          products={sortedProducts} 
          isLoading={loading} 
          emptyMessage="No products available yet."
        />
      </div>

    </PageContainer>
  );
};

export default ProductsPage;
