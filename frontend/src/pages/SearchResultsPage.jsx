import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { ChevronRight, SearchX, ArrowRight } from 'lucide-react';

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      try {
        const results = await productService.getProducts({ search: query });
        setProducts(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  return (
    <PageContainer>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">Search Results</span>
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

      {/* Empty Search Results UI */}
      {!loading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 my-6">
          <div className="p-4 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
            <SearchX className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No Products Found</h2>
          <p className="text-sm text-slate-500 max-w-md">
            No products matched <strong className="text-slate-800">"{query}"</strong>. Try searching for popular terms like "Air Fryer", "Earbuds", "Kettle", or "Smartwatch".
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <span>Browse All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} isLoading={loading} />
      )}
    </PageContainer>
  );
};

export default SearchResultsPage;
