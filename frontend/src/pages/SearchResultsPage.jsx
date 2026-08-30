import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import ProductGrid from '../components/product/ProductGrid';
import CollectionCard from '../components/collection/CollectionCard';
import { productService } from '../services/productService';
import collectionService from '../services/collectionService';
import { ChevronRight, Layers, SearchX } from 'lucide-react';

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      try {
        const [prodResults, allCollections] = await Promise.all([
          productService.getProducts({ search: query }),
          collectionService.getPublicCollections(),
        ]);

        setProducts(Array.isArray(prodResults) ? prodResults : (prodResults?.products || []));

        // Filter matching collections
        if (query.trim()) {
          const q = query.toLowerCase().trim();
          const matchedCols = (allCollections || []).filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.slug.toLowerCase().includes(q) ||
              (c.description && c.description.toLowerCase().includes(q))
          );
          setCollections(matchedCols);
        } else {
          setCollections([]);
        }
      } catch (err) {
        console.error('Search failed:', err);
        setProducts([]);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
    window.scrollTo(0, 0);
  }, [query]);

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
    <PageContainer className="pt-3 pb-16 space-y-6">
      
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-bold">Search Results</span>
      </nav>

      {/* 2. Compact Search Results Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {query ? `Search: "${query}"` : 'All Search Results'}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {collections.length > 0 && `${collections.length} ${collections.length === 1 ? 'collection' : 'collections'}, `}
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product found' : 'products found'}
          </p>
        </div>

        {sortedProducts.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              aria-label="Sort search results"
              onChange={(e) => setSortBy(e.target.value)}
              className="font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer text-xs text-slate-800"
            >
              <option value="featured">Featured</option>
              <option value="price_low">Lowest Price</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        )}
      </div>

      {/* 3. PRIMARY RESULT: MATCHING COLLECTIONS (Shown first when user searches e.g. "air fryer") */}
      {collections.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Matching Collections</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collections.map((col) => (
              <CollectionCard key={col._id || col.id || col.slug} collection={col} />
            ))}
          </div>
        </div>
      )}

      {/* 4. MATCHING PRODUCTS */}
      <div className="space-y-3">
        {collections.length > 0 && sortedProducts.length > 0 && (
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 pt-2 border-t border-slate-100">
            Products Matching "{query}"
          </h2>
        )}

        <ProductGrid 
          products={sortedProducts} 
          isLoading={loading} 
          emptyMessage={
            collections.length === 0 
              ? (query ? `No products or collections found matching "${query}".` : "No products found.") 
              : ""
          }
        />
      </div>

    </PageContainer>
  );
};

export default SearchResultsPage;
