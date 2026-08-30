import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import CollectionCard from '../components/collection/CollectionCard';
import MarketplaceDisclosureBanner from '../components/common/MarketplaceDisclosureBanner';
import collectionService from '../services/collectionService';
import { categoryService } from '../services/categoryService';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  ShieldCheck,
  Search,
  CheckCircle2
} from 'lucide-react';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomePageData() {
      setLoading(true);
      try {
        const [catData, colData] = await Promise.all([
          categoryService.getCategories(),
          collectionService.getPublicCollections(),
        ]);

        setCategories(Array.isArray(catData) ? catData : []);
        setCollections(Array.isArray(colData) ? colData : []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomePageData();
  }, []);

  // Group collections by Category
  const categoryMap = new Map();
  const uncategorized = [];

  collections.forEach((col) => {
    const catId = col.category?._id || col.category?.id || (typeof col.category === 'string' ? col.category : null);
    if (catId) {
      if (!categoryMap.has(String(catId))) {
        categoryMap.set(String(catId), []);
      }
      categoryMap.get(String(catId)).push(col);
    } else {
      uncategorized.push(col);
    }
  });

  return (
    <PageContainer className="pt-2 pb-16 space-y-8">
      
      {/* 1. COMPACT MARKETPLACE DISCLOSURE BANNER */}
      <MarketplaceDisclosureBanner />

      {/* 2. CATEGORY -> COLLECTION SECTIONS */}
      {loading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-48 bg-slate-100 animate-pulse rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-44 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Curated Collections Coming Soon</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We are curating collections with verified marketplace offers. Check back shortly!
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Loop over Categories with Collections */}
          {categories.map((cat) => {
            const catCollections = categoryMap.get(String(cat._id || cat.id)) || [];
            if (catCollections.length === 0) return null;

            return (
              <section key={cat._id || cat.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-baseline justify-between border-b border-slate-200/90 pb-2.5">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Popular {cat.name} Collections
                    </p>
                  </div>

                  <Link
                    to={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Collection Cards Grid (Zero individual products dumped here) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {catCollections.map((col) => (
                    <CollectionCard key={col._id || col.id || col.slug} collection={col} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* Uncategorized or Featured Collections */}
          {uncategorized.length > 0 && (
            <section className="space-y-4">
              <div className="border-b border-slate-200/90 pb-2.5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  Featured Collections
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Hand-picked product recommendations
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {uncategorized.map((col) => (
                  <CollectionCard key={col._id || col.id || col.slug} collection={col} />
                ))}
              </div>
            </section>
          )}

        </div>
      )}

    </PageContainer>
  );
};

export default HomePage;
