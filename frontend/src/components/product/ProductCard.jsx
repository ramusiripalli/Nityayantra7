import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Star, Plus, ExternalLink } from 'lucide-react';
import MarketplaceBadge from './MarketplaceBadge';
import { formatINR, calculateDiscount } from '../../utils/currency';

export const ProductCard = ({ product, isVideoCard = false, className = '' }) => {
  if (!product) return null;

  const discount = product.discountPercent || calculateDiscount(product.originalPrice, product.currentPrice);

  return (
    <div className={`group flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden text-left h-full ${className}`}>
      
      {/* 1. FIXED IMAGE CONTAINER (1:1 Aspect Ratio) */}
      <div className="relative w-full aspect-square bg-slate-50/80 overflow-hidden flex items-center justify-center p-3 border-b border-slate-100/80 shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300 pointer-events-none"
          loading="lazy"
        />

        {/* Top-Left Discount Badge */}
        {discount > 0 && !isVideoCard && (
          <span className="absolute top-2 left-2 bg-emerald-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded shadow-2xs tracking-wide">
            {discount}% OFF
          </span>
        )}

        {/* Top-Right Video Review Badge */}
        {product.youtubeVideoId && !isVideoCard && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
            <Youtube className="w-2.5 h-2.5 fill-white" />
            <span className="hidden xs:inline">Video</span>
          </span>
        )}

        {/* Positioned ADD / Quick Compare Action Button */}
        <Link
          to={`/product/${product.id}`}
          className="absolute right-2 bottom-2 bg-white/95 text-sky-700 hover:bg-sky-600 hover:text-white font-bold border border-sky-300 hover:border-sky-600 text-[11px] px-2.5 py-1 rounded-lg shadow-2xs transition-all duration-200 flex items-center gap-0.5 active:scale-95 cursor-pointer z-10"
          aria-label={`View details for ${product.title}`}
        >
          <Plus className="w-3 h-3 stroke-[3]" />
          <span>ADD</span>
        </Link>
      </div>

      {/* 2. CARD CONTENT AREA (Fixed Vertical Structure) */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 justify-between space-y-1.5">
        
        <div className="space-y-1">
          {/* Price Row (First for strong visual scanning) */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black text-slate-900 leading-none">
              {formatINR(product.currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 line-through leading-none">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Title with Strict 2-Line Clamping */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="text-[11px] sm:text-xs font-bold text-slate-800 line-clamp-2 h-[2.2rem] sm:h-[2.4rem] leading-tight">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="space-y-1 pt-1 border-t border-slate-100/80">
          {/* Marketplace / Pack Variant Badge */}
          <div className="h-4 flex items-center">
            {product.lowestMarketplace ? (
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">Best:</span>
                <MarketplaceBadge marketplaceId={product.lowestMarketplace} isLowest={true} />
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium capitalize truncate">
                {product.category}
              </span>
            )}
          </div>

          {/* Rating Row */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/70 rounded font-bold text-[10px]">
              <span>{product.rating || 4.5}</span>
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
            </div>
            {product.reviewCount && (
              <span className="text-[10px] text-slate-400 font-medium truncate">
                ({product.reviewCount > 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
