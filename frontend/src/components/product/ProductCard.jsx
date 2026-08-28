import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Youtube, Play, Star } from 'lucide-react';
import MarketplaceBadge from './MarketplaceBadge';
import { formatINR, calculateDiscount } from '../../utils/currency';

export const ProductCard = ({ product, isVideoCard = false }) => {
  if (!product) return null;

  const discount = product.discountPercent || calculateDiscount(product.originalPrice, product.currentPrice);

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Compact Image Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-3 border-b border-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
          loading="lazy"
        />

        {/* Video Play Overlay */}
        {isVideoCard && (
          <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[1px] flex items-center justify-center group-hover:bg-slate-900/25 transition-colors">
            <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Discount Badge (Emerald) */}
        {discount > 0 && !isVideoCard && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-2xs tracking-wide uppercase">
            {discount}% OFF
          </span>
        )}

        {/* Video Review Badge (Red) */}
        {product.youtubeVideoId && !isVideoCard && (
          <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <Youtube className="w-3 h-3 fill-white" />
            <span>Video Review</span>
          </span>
        )}

        {/* Category Badge */}
        <span className="absolute bottom-2 left-2.5 text-[9px] font-extrabold tracking-wider uppercase text-slate-700 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
          {product.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3.5 space-y-2">
        
        {/* Rating & Review Count */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded font-bold text-[11px]">
            <span>{product.rating || 4.5}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
          </div>
          {product.reviewCount && (
            <span className="text-[11px] text-slate-400 font-medium">
              ({product.reviewCount.toLocaleString('en-IN')})
            </span>
          )}
        </div>

        {/* Title with Line Clamping */}
        <Link to={`/product/${product.id}`} className="group-hover:text-sky-600 transition-colors block">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 min-h-[2.5rem] leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Marketplace Availability Indicator */}
        {product.lowestMarketplace && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span className="text-[10px] font-medium text-slate-400">Best price:</span>
            <MarketplaceBadge marketplaceId={product.lowestMarketplace} isLowest={true} />
          </div>
        )}

        {/* Price & Action Row */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 leading-none">
              {formatINR(product.currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-[11px] text-slate-400 line-through mt-0.5">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 border ${
              isVideoCard 
                ? 'bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border-red-200 hover:border-red-600'
                : 'bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border-sky-200 hover:border-sky-600'
            }`}
          >
            <span>{isVideoCard ? "Watch Review" : "Compare Deals"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;
