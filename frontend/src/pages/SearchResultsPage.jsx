import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { CATEGORIES } from '../data/categories';
import { 
  ChevronRight, 
  SearchX, 
  ArrowRight, 
  SlidersHorizontal, 
  X, 
  Check, 
  Filter, 
  ArrowUpDown,
  Sparkles,
  Flame
} from 'lucide-react';

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const minRatingParam = searchParams.get('minRating') || '';
  const marketplacesParam = searchParams.get('marketplaces') ? searchParams.get('marketplaces').split(',') : [];

  const [products, setProducts] = useState([]);
  const [trendingDeals, setTrendingDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [pricePreset, setPricePreset] = useState('');
  const [minRating, setMinRating] = useState(minRatingParam);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState(marketplacesParam);

  const marketplacesList = [
    { id: 'amazon', name: 'Amazon', color: 'text-amber-700' },
    { id: 'flipkart', name: 'Flipkart', color: 'text-blue-700' },
    { id: 'meesho', name: 'Meesho', color: 'text-purple-700' },
    { id: 'myntra', name: 'Myntra', color: 'text-pink-700' },
  ];

  // Fetch search results
  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      try {
        let minP = minPriceParam;
        let maxP = maxPriceParam;

        if (pricePreset === 'under_1000') { minP = 0; maxP = 1000; }
        else if (pricePreset === '1000_5000') { minP = 1000; maxP = 5000; }
        else if (pricePreset === '5000_10000') { minP = 5000; maxP = 10000; }
        else if (pricePreset === 'above_10000') { minP = 10000; maxP = Infinity; }

        const results = await productService.getProducts({ 
          search: query,
          category: selectedCategory,
          sortBy: sortBy,
          minPrice: minP,
          maxPrice: maxP,
          minRating: minRating,
          marketplaces: selectedMarketplaces
        });
        setProducts(results);

        // Fetch trending fallback deals if search is empty
        if (results.length === 0) {
          const trending = await productService.getTrendingDeals();
          setTrendingDeals(trending.slice(0, 6));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
    window.scrollTo(0, 0);
  }, [query, selectedCategory, sortBy, pricePreset, minRating, selectedMarketplaces, minPriceParam, maxPriceParam]);

  const toggleMarketplace = (id) => {
    if (selectedMarketplaces.includes(id)) {
      setSelectedMarketplaces(selectedMarketplaces.filter((m) => m !== id));
    } else {
      setSelectedMarketplaces([...selectedMarketplaces, id]);
    }
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSortBy('featured');
    setPricePreset('');
    setMinRating('');
    setSelectedMarketplaces([]);
  };

  return (
    <PageContainer>
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-sky-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">
          {query ? `Search: "${query}"` : 'Search Results'}
        </span>
      </nav>

      {/* Header */}
      <SectionHeader
        badge="Search Results"
        title={query ? `Results for "${query}"` : 'All Products'}
        subtitle={
          loading
            ? 'Searching product catalog...'
            : `Found ${products.length} product${products.length === 1 ? '' : 's'} matching your query.`
        }
      />

      {/* DESKTOP FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 mb-7 space-y-3.5">
        
        {/* Row 1: Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 border-b border-slate-100 pb-3">
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

        {/* Row 2: Price, Rating, Marketplace Filters & Sort Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Price Presets */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">Price:</span>
              <select
                value={pricePreset}
                aria-label="Filter by price range"
                onChange={(e) => setPricePreset(e.target.value)}
                className="font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer text-xs"
              >
                <option value="">All Prices</option>
                <option value="under_1000">Under ₹1,000</option>
                <option value="1000_5000">₹1,000 - ₹5,000</option>
                <option value="5000_10000">₹5,000 - ₹10,000</option>
                <option value="above_10000">Above ₹10,000</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">Rating:</span>
              <select
                value={minRating}
                aria-label="Filter by rating"
                onChange={(e) => setMinRating(e.target.value)}
                className="font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer text-xs"
              >
                <option value="">All Ratings</option>
                <option value="4">⭐ 4.0 & Above</option>
                <option value="3">⭐ 3.0 & Above</option>
              </select>
            </div>

            {/* Marketplace Checkboxes */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="font-bold text-slate-600 mr-1">Marketplace:</span>
              {marketplacesList.map((mp) => (
                <label key={mp.id} className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMarketplaces.includes(mp.id)}
                    onChange={() => toggleMarketplace(mp.id)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className={`font-semibold ${mp.color}`}>{mp.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Right: Mobile Filter Button & Sort Selector */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            
            {/* Mobile Filter Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-slate-600 hidden xs:inline">Sort:</span>
              <select
                value={sortBy}
                aria-label="Sort search results"
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

      </div>

      {/* SKELETON LOADING STATE */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3.5 sm:gap-4 w-full mb-10">
          {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col p-3 space-y-3 animate-pulse h-64">
              <div className="w-full aspect-square bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-7 bg-slate-100 rounded-lg mt-auto" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        
        /* RICH EMPTY SEARCH STATE */
        <div className="space-y-9 mb-10">
          
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="p-4 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
              <SearchX className="w-10 h-10 text-sky-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              No products found matching "{query}"
            </h2>
            
            {/* Search Tips */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 max-w-md text-left text-xs space-y-1.5 text-slate-600">
              <span className="font-extrabold text-slate-900 block mb-1">Search Tips:</span>
              <p>• Check your spelling or try using simpler words</p>
              <p>• Try searching for broader terms (e.g., "air fryer", "watch", "earbuds")</p>
              <p>• Explore by category filters above or reset active filters</p>
            </div>

            {/* Popular Category Chips */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                Explore Popular Categories
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['Kitchen', 'Electronics', 'Mobiles', 'Home', 'Gadgets', 'Deals'].map((catName) => (
                  <Link
                    key={catName}
                    to={`/category/${catName.toLowerCase()}`}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-sky-600 hover:text-white font-bold text-xs rounded-xl text-slate-700 transition-colors"
                  >
                    {catName}
                  </Link>
                ))}
              </div>
            </div>

            {/* Reset Filters Button */}
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Reset All Filters</span>
            </button>
          </div>

          {/* Trending Deals Fallback Grid */}
          {trendingDeals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h3 className="text-lg font-black text-slate-900">Trending Deals You Might Like</h3>
              </div>
              <ProductGrid products={trendingDeals} />
            </div>
          )}

        </div>

      ) : (
        /* PRODUCT RESULTS GRID (Reuses Standardized ProductCard System) */
        <div className="mb-10">
          <ProductGrid products={products} />
        </div>
      )}

      {/* MOBILE FILTER BOTTOM SHEET DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-fadeIn lg:hidden">
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl animate-slideUp">
            
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <Filter className="w-4 h-4 text-sky-600" />
                <span>Filter & Sort Products</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Pills */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-800">Category</span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Presets */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-800">Price Range</span>
              <select
                value={pricePreset}
                aria-label="Filter by price range"
                onChange={(e) => setPricePreset(e.target.value)}
                className="w-full font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
              >
                <option value="">All Prices</option>
                <option value="under_1000">Under ₹1,000</option>
                <option value="1000_5000">₹1,000 - ₹5,000</option>
                <option value="5000_10000">₹5,000 - ₹10,000</option>
                <option value="above_10000">Above ₹10,000</option>
              </select>
            </div>

            {/* Marketplace Checkboxes */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-800">Marketplaces</span>
              <div className="grid grid-cols-2 gap-2">
                {marketplacesList.map((mp) => (
                  <label key={mp.id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMarketplaces.includes(mp.id)}
                      onChange={() => toggleMarketplace(mp.id)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className={`text-xs font-bold ${mp.color}`}>{mp.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-sky-700 cursor-pointer"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </PageContainer>
  );
};

export default SearchResultsPage;
