import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import CategorySection from '../components/product/CategorySection';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { Filter, ArrowUpDown, ChevronRight, PackageX } from 'lucide-react';
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

  // Group products by category for multi-category shelf presentation
  const categoryGroups = useMemo(() => {
    if (selectedCategory !== 'all') return [];

    const categoryMap = [];
    const validCategories = CATEGORIES.filter((c) => c.slug !== 'all');

    validCategories.forEach((cat) => {
      let catProducts = [];
      if (cat.slug === 'deals') {
        catProducts = products.filter((p) => (p.discountPercent || 0) > 0 || p.isTrending || p.isBestDeal);
      } else {
        catProducts = products.filter((p) => p.category?.toLowerCase() === cat.slug.toLowerCase());
      }

      if (catProducts.length > 0) {
        categoryMap.push({
          category: cat,
          products: catProducts,
        });
      }
    });

    return categoryMap;
  }, [products, selectedCategory]);

  return (
    <PageContainer>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5">
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-7 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            <span>Category:</span>
          </span>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-sky-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort & Count Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 w-full sm:w-auto text-xs">
          <span className="text-slate-500 font-medium whitespace-nowrap">
            Showing <strong className="text-slate-900 font-extrabold">{products.length}</strong> products
          </span>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-600 whitespace-nowrap hidden xs:inline">Sort:</span>
            <select
              value={sortBy}
              aria-label="Sort products"
              onChange={(e) => setSortBy(e.target.value)}
              className="font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer text-xs"
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

      {/* Main Content Area: Category-Wise Horizontal Product Sections */}
      {loading ? (
        <div className="space-y-8 py-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-3">
              <div className="h-6 w-40 bg-slate-200 animate-pulse rounded-md" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-[165px] h-64 bg-slate-100 animate-pulse rounded-xl shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200 my-4">
          <PackageX className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No products found matching your filter.</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1">
            Try switching category filters or resetting sort options to explore all products.
          </p>
        </div>
      ) : selectedCategory === 'all' && categoryGroups.length > 0 ? (
        /* Render Category-Wise Horizontal Product Shelves */
        <div className="space-y-2">
          {categoryGroups.map(({ category, products: catProducts }) => (
            <CategorySection
              key={category.id}
              title={category.name}
              slug={category.slug}
              iconName={category.icon}
              products={catProducts}
            />
          ))}
        </div>
      ) : (
        /* Single Selected Category or Filtered View */
        <div className="space-y-6">
          <CategorySection
            title={
              CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Filtered Products'
            }
            slug={selectedCategory}
            iconName={CATEGORIES.find((c) => c.slug === selectedCategory)?.icon}
            products={products}
          />
        </div>
      )}
    </PageContainer>
  );
};

export default ProductsPage;
