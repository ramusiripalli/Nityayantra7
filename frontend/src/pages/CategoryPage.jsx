import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import CollectionCard from '../components/collection/CollectionCard';
import { categoryService } from '../services/categoryService';
import collectionService from '../services/collectionService';
import { ChevronRight, Layers, Sparkles } from 'lucide-react';

export const CategoryPage = ({ categorySlug: propCategorySlug }) => {
  const params = useParams();
  const slug = propCategorySlug || params.slug;

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load real categories
  useEffect(() => {
    categoryService.getCategories().then((cats) => setCategories(cats || []));
  }, []);

  // Find matching category metadata
  const categoryMeta = useMemo(() => {
    const found = categories.find(
      (c) =>
        (c.slug || '').toLowerCase() === slug?.toLowerCase() ||
        (c.name || '').toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase()
    );
    if (found) return found;
    return {
      name: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Category',
      slug,
    };
  }, [categories, slug]);

  // Fetch collections for this category
  useEffect(() => {
    async function fetchCategoryCollections() {
      if (!slug) return;
      setLoading(true);
      try {
        const colData = await collectionService.getPublicCollections({ category: slug });
        setCollections(Array.isArray(colData) ? colData : []);
      } catch (err) {
        console.error('Error fetching category collections:', err);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryCollections();
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <PageContainer className="pt-3 pb-16 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-slate-900 font-bold">{categoryMeta.name}</span>
      </nav>

      {/* Category Header */}
      <div className="border-b border-slate-200 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
            <Layers className="w-4 h-4" />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
            {categoryMeta.name}
          </h1>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Choose a collection to browse curated products and direct marketplace deals.
        </p>
      </div>

      {/* Zepto-Style Compact Collection Grid (2 cols mobile, 3-6 cols desktop) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="aspect-[4/5] bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
            />
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {collections.map((col) => (
            <CollectionCard
              key={col._id || col.id || col.slug}
              collection={col}
              categorySlug={categoryMeta.slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            No collections available in {categoryMeta.name} yet
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We are continuously adding verified product collections. Check back shortly!
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 underline"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      )}

    </PageContainer>
  );
};

export default CategoryPage;
