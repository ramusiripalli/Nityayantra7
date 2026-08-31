import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';

export const CollectionCard = ({ collection, categorySlug }) => {
  if (!collection) return null;

  const {
    name,
    slug,
    image,
    icon = '🍟',
    description,
    productCount = 0,
    category,
  } = collection;

  const [imgError, setImgError] = useState(false);

  // Compute clean SEO URL: /kitchen/air-fryers
  const parentCatSlug =
    categorySlug ||
    (category && (category.slug || category.name?.toLowerCase().replace(/\s+/g, '-'))) ||
    'kitchen';
  const publicUrl = `/${parentCatSlug}/${slug}`;

  return (
    <Link
      to={publicUrl}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-300 text-left overflow-hidden p-2.5 sm:p-3"
    >
      {/* Square Image Area */}
      <div className="relative w-full aspect-square bg-slate-50/80 rounded-xl overflow-hidden mb-2 flex items-center justify-center border border-slate-100/90 group-hover:bg-slate-50 transition-colors">
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-2.5 group-hover:scale-106 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-50/80 via-slate-50 to-indigo-50/40 text-slate-400 p-2">
            <span className="text-3xl sm:text-4xl mb-1 select-none">{icon || '🍟'}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collection</span>
          </div>
        )}

        {/* Product Count Pill */}
        <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 text-[10px] sm:text-[10.5px] font-bold text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200/80 shadow-2xs">
          <Package className="w-3 h-3 text-slate-400" />
          <span>{productCount} {productCount === 1 ? 'item' : 'items'}</span>
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight line-clamp-1">
            {name}
          </h3>
          {description && (
            <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5 hidden sm:block">
              {description}
            </p>
          )}
        </div>

        {/* Explore CTA */}
        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-600 group-hover:text-sky-700">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;
