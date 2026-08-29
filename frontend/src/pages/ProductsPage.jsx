import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import CategorySection from '../components/product/CategorySection';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import MobileFilterSheet from '../components/product/MobileFilterSheet';
import ActiveFilterChips from '../components/product/ActiveFilterChips';
import { productService } from '../services/productService';
import { CATEGORIES } from '../data/categories';
import { 
  parseFilterParams, 
  serializeFilterParams, 
  filterProducts, 
  countActiveFilters 
} from '../utils/filterUtils';
import { 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  PackageX, 
  RotateCcw, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse initial filters from URL search params
  const filters = useMemo(() => parseFilterParams(searchParams), [searchParams]);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // Fetch product dataset
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await productService.getProducts({});
        setAllProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter and sort products dynamically using filterUtils
  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, filters);
  }, [allProducts, filters]);

  // Handle filter changes and update URL search params
  const handleFilterChange = (newFilterPartial) => {
    const updated = { ...filters, ...newFilterPartial };
    const params = serializeFilterParams(updated);
    setSearchParams(params, { replace: true });
  };

  const handleClearAll = () => {
    setSearchParams({}, { replace: true });
  };

  // Group products by category for multi-category shelf presentation when "all" is selected with NO active filters
  const categoryGroups = useMemo(() => {
    if (filters.category !== 'all' || activeFilterCount > 0) return [];

    const categoryMap = [];
    const validCategories = CATEGORIES.filter((c) => c.slug !== 'all');

    validCategories.forEach((cat) => {
      let catProducts = [];
      if (cat.slug === 'deals') {
        catProducts = allProducts.filter((p) => (p.discountPercent || 0) > 0 || p.isTrending || p.isBestDeal);
      } else {
        catProducts = allProducts.filter((p) => p.category?.toLowerCase() === cat.slug.toLowerCase());
      }

      if (catProducts.length > 0) {
        categoryMap.push({
          category: cat,
          products: catProducts,
        });
      }
    });

    return categoryMap;
  }, [allProducts, filters.category, activeFilterCount]);

  return (
    <PageContainer>
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">All Products</span>
      </nav>

      {/* Page Header */}
      <SectionHeader
        badge="Full Catalog"
        title="All Products"
        subtitle="Explore everyday smart gadgets, home tools, and price comparisons."
      />

      {/* MAIN LAYOUT GRID (Desktop: 230px Sidebar + Flex Main Content Area) */}
      <div className="flex flex-col lg:flex-row gap-7 items-start mb-16">
        
        {/* DESKTOP FILTER SIDEBAR (Visible ≥1024px) */}
        <div className="hidden lg:block shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>

        {/* RIGHT COLUMN: Toolbar + Active Chips + Product Grid */}
        <div className="flex-1 w-full space-y-4">
          
          {/* PRODUCT RESULTS TOOLBAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            
            {/* Left: Product Count */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                <strong className="text-slate-900 font-black">{filteredProducts.length}</strong> products found
              </span>

              {/* Mobile Filter Button (<1024px) */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs rounded-lg transition-colors cursor-pointer ml-auto sm:ml-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>
            </div>

            {/* Right: Sort Dropdown Selector */}
            <div className="flex items-center justify-end gap-2 text-xs shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-slate-600 hidden xs:inline whitespace-nowrap">Sort by:</span>
              <select
                value={filters.sortBy}
                aria-label="Sort catalog products"
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer text-xs"
              >
                <option value="featured">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Top Rated</option>
                <option value="most_reviewed">Most Reviewed</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

          </div>

          {/* ACTIVE FILTER CHIPS */}
          <ActiveFilterChips
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* PRODUCT GRID & CONTENT AREA */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div key={idx} className="h-64 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            
            /* EMPTY FILTER RESULT STATE */
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 my-2">
              <div className="p-4 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                <PackageX className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-black text-slate-900">No products match your filters</h3>
              <p className="text-xs text-slate-500 max-w-md">
                Try clearing some active filters, selecting a different category, or adjusting your price range.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            </div>

          ) : filters.category === 'all' && activeFilterCount === 0 && categoryGroups.length > 0 ? (
            
            /* MULTI-CATEGORY PREVIEW CAROUSEL VIEW (Default "All" view with 0 active filters) */
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
            
            /* FILTERED PRODUCT GRID VIEW */
            <div>
              <ProductGrid products={filteredProducts} />
            </div>

          )}

        </div>

      </div>

      {/* STICKY MOBILE BOTTOM FILTER TOOLBAR (<1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-2xl flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 h-[42px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-sky-400" />
          <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        </button>

        <div className="flex-1 h-[42px] bg-slate-100 border border-slate-200 rounded-xl px-3 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-500 shrink-0">Sort:</span>
          <select
            value={filters.sortBy}
            aria-label="Sort catalog products mobile"
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
            className="w-full font-bold bg-transparent text-slate-900 focus:outline-none text-right cursor-pointer text-xs"
          >
            <option value="featured">Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* MOBILE FILTER BOTTOM SHEET DRAWER */}
      <MobileFilterSheet
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />

    </PageContainer>
  );
};

export default ProductsPage;
