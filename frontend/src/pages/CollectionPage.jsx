import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import ProductCard from '../components/product/ProductCard';
import collectionService from '../services/collectionService';
import { ChevronRight, PackageX, ShieldCheck } from 'lucide-react';
import NotFoundPage from './NotFoundPage';

export const CollectionPage = ({ collectionSlug: propCollectionSlug }) => {
  const params = useParams();
  const slug = propCollectionSlug || params.collectionSlug || params.slug;
  const categorySlug = params.categorySlug;

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCollection() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setNotFound(false);

      try {
        const data = await collectionService.getPublicCollectionBySlug(slug);
        if (!isMounted) return;

        if (!data) {
          setNotFound(true);
        } else {
          setCollection(data);

          // Update Document Title and SEO Description
          document.title = data.seoTitle || `${data.name} in India | Nitya Yantra`;
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
          }
          metaDesc.content =
            data.seoDescription ||
            `Discover curated ${data.name} with ratings, prices and direct marketplace links.`;
        }
      } catch (err) {
        console.error('Failed to load collection page:', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCollection();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // If collection does not exist or is unpublished, show standard 404
  if (!loading && notFound) {
    return <NotFoundPage />;
  }

  const count = collection?.products?.length || 0;
  const parentCategorySlug =
    categorySlug || collection?.category?.slug || collection?.category?.name?.toLowerCase().replace(/\s+/g, '-') || 'kitchen';

  return (
    <PageContainer className="pt-3 pb-16 space-y-6">
      
      {/* 1. Compact Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        {collection?.category && (
          <>
            <Link to={`/${parentCategorySlug}`} className="hover:text-sky-600 capitalize">
              {collection.category.name}
            </Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
          </>
        )}
        <span className="text-slate-900 font-bold">{collection?.name || 'Collection'}</span>
      </nav>

      {/* 2. Compact Collection Header */}
      <div className="border-b border-slate-200 pb-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {collection?.icon && (
              <span className="text-2xl sm:text-3xl" role="img" aria-label="Collection icon">
                {collection.icon}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {collection?.name}
            </h1>
          </div>

          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
            {count} {count === 1 ? 'product' : 'products'}
          </span>
        </div>

        {collection?.description && (
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        )}

        {/* Affiliate & Amazon Disclosure Notice */}
        <div className="flex items-start sm:items-center gap-2 pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 mt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            Some links on Nitya Yantra are affiliate links. We may earn a commission if you purchase through these links, at no extra cost to you. Prices and availability may change on marketplace websites. As an Amazon Associate I earn from qualifying purchases.
          </span>
        </div>
      </div>

      {/* 3. Products Grid (1 col mobile, 2 col tablet, 3-4 col desktop) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="h-72 w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : !collection?.products || collection.products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 my-4 w-full">
          <PackageX className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No products available in this collection yet.</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1">
            Check back soon as we curate recommended products with verified marketplace offers.
          </p>
          <Link
            to={`/${parentCategorySlug}`}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <span>Back to {collection?.category?.name || 'Category'}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch">
          {collection.products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}

    </PageContainer>
  );
};

export default CollectionPage;
