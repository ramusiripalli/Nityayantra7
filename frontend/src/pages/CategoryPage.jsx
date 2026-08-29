import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
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
  ChevronRight, 
  FolderX, 
  ArrowRight, 
  SlidersHorizontal, 
  ArrowUpDown 
} from 'lucide-react';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Check if category exists in central categories metadata
  const categoryMeta = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === slug?.toLowerCase()
  );

  // Parse filter params from URL
  const filters = useMemo(() => {
    const parsed = parseFilterParams(searchParams);
    return { ...parsed, category: slug || 'all' };
  }, [searchParams, slug]);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!categoryMeta) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await productService.getProducts({ category: slug });
        setRawProducts(data);
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [slug, categoryMeta]);

  // Apply filters and sorting dynamically
  const filteredProducts = useMemo(() => {
    return filterProducts(rawProducts, filters);
  }, [rawProducts, filters]);

  const handleFilterChange = (newFilterPartial) => {
    const updated = { ...filters, ...newFilterPartial };
    const params = serializeFilterParams(updated);
    setSearchParams(params, { replace: true });
  };

  const handleClearAll = () => {
    setSearchParams({}, { replace: true });
  };

  // CATEGORY NOT FOUND STATE
  if (!categoryMeta) {
    return (
      <PageContainer>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-sky-600">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 capitalize font-bold">{slug}</span>
        </nav>

        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 my-6">
          <div className="p-4 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            <FolderX className="w-12 h-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Category Not Found</h1>
          <p className="text-sm text-slate-500 max-w-md">
            Sorry, the category <strong className="text-slate-800">"{slug}"</strong> does not exist or has been removed. Explore our full catalog of smart products below.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
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
      
      {/* Requirement #14: BREADCRUMBS: Home > Categories > [Category Name] */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5 overflow-x-auto">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-sky-600">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold capitalize">{categoryMeta.name}</span>
      </nav>

      {/* Category Section Header */}
      <SectionHeader
        badge="Category Catalogue"
        title={`${categoryMeta.name} Products`}
        subtitle={`Explore complete ${categoryMeta.name.toLowerCase()} catalogue, compare marketplace prices & video reviews.`}
      />

      {/* Main Category Layout (Desktop: 230px Filter Sidebar + Flex Catalogue Grid) */}
      <div className="flex flex-col lg:flex-row gap-7 items-start mb-16">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>

        {/* RIGHT COLUMN: Toolbar + Active Chips + 2-Col Mobile / 6-Col Desktop Catalogue Grid */}
        <div className="flex-1 w-full space-y-4">
          
          {/* TOOLBAR: Product Count + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                <strong className="text-slate-900 font-black">{filteredProducts.length}</strong> {categoryMeta.name} products
              </span>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs rounded-lg transition-colors cursor-pointer ml-auto sm:ml-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center justify-end gap-2 text-xs shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-slate-600 hidden xs:inline whitespace-nowrap">Sort by:</span>
              <select
                value={filters.sortBy || 'featured'}
                aria-label="Sort category products"
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer text-xs"
              >
                <option value="featured">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

          </div>

          {/* Active Filter Chips */}
          <ActiveFilterChips
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* Mode 2: Scrollable 2-Column Mobile Grid / 6-Column Desktop Grid Catalogue */}
          <ProductGrid 
            products={filteredProducts} 
            isLoading={loading} 
            emptyMessage={`No ${categoryMeta.name} products currently match your active filters.`}
          />

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
            value={filters.sortBy || 'featured'}
            aria-label="Sort category products mobile"
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

      {/* Mobile Filter Sheet Drawer */}
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

export default CategoryPage;
