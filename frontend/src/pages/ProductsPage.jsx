import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { Filter, ArrowUpDown, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await productService.getProducts({
          category: selectedCategory,
          sortBy: sortBy,
        });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, sortBy]);

  return (
    <PageContainer>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">All Products</span>
      </nav>

      {/* Header */}
      <SectionHeader
        badge="Full Catalog"
        title="All Products"
        subtitle="Explore products across everyday categories."
      />

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort & Count Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 w-full sm:w-auto text-xs">
          
          <span className="text-slate-500 font-medium whitespace-nowrap">
            Showing <strong className="text-slate-900 font-extrabold">{products.length}</strong> products
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-600 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              aria-label="Sort products"
              onChange={(e) => setSortBy(e.target.value)}
              className="font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="rating">Highest Rating</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

        </div>

      </div>

      {/* Product Grid */}
      <ProductGrid products={products} isLoading={loading} />
    </PageContainer>
  );
};

export default ProductsPage;
