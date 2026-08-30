import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CategoryPage from './CategoryPage';
import CollectionPage from './CollectionPage';
import NotFoundPage from './NotFoundPage';
import { categoryService } from '../services/categoryService';
import collectionService from '../services/collectionService';

export const SmartCategoryOrCollectionRouter = () => {
  const { slug } = useParams();
  const [resolvedType, setResolvedType] = useState(null); // 'category' | 'collection' | 'notfound'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function resolveSlug() {
      if (!slug) {
        setResolvedType('notfound');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const cleanSlug = slug.toLowerCase().trim();

        // 1. Check if slug matches a Category
        const categories = await categoryService.getCategories();
        const matchedCategory = (categories || []).find(
          (c) =>
            (c.slug || '').toLowerCase() === cleanSlug ||
            (c.name || '').toLowerCase().replace(/\s+/g, '-') === cleanSlug
        );

        if (!isMounted) return;

        if (matchedCategory) {
          setResolvedType('category');
          setLoading(false);
          return;
        }

        // 2. Check if slug matches a Collection
        try {
          const colData = await collectionService.getPublicCollectionBySlug(cleanSlug);
          if (!isMounted) return;
          if (colData && colData._id) {
            setResolvedType('collection');
            setLoading(false);
            return;
          }
        } catch {
          // not a collection
        }

        if (!isMounted) return;
        setResolvedType('notfound');
      } catch (err) {
        console.error('Error resolving route slug:', err);
        if (isMounted) setResolvedType('notfound');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    resolveSlug();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-lg mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (resolvedType === 'category') {
    return <CategoryPage categorySlug={slug} />;
  }

  if (resolvedType === 'collection') {
    return <CollectionPage collectionSlug={slug} />;
  }

  return <NotFoundPage />;
};

export default SmartCategoryOrCollectionRouter;
