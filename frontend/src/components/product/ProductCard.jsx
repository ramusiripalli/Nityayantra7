import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Youtube, Play } from 'lucide-react';
import RatingStars from './RatingStars';
import MarketplaceBadge from './MarketplaceBadge';
import { formatINR, calculateDiscount } from '../../utils/currency';

export const ProductCard = ({ product, isVideoCard = false }) => {
  if (!product) return null;

  const discount = product.discountPercent || calculateDiscount(product.originalPrice, product.currentPrice);

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Image Container with Fixed Aspect Ratio */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-3 border-b border-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
          loading="lazy"
        />

        {/* Video Play Overlay for Video Cards */}
        {isVideoCard && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center group-hover:bg-slate-900/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Discount Tag */}
        {discount > 0 && !isVideoCard && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
            {discount}% OFF
          </span>
        )}

        {/* YouTube Video Badge */}
        {product.youtubeVideoId && !isVideoCard && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Youtube className="w-3 h-3 fill-white" />
            <span>Video Review</span>
          </span>
        )}

        {/* Category Pill */}
        <span className="absolute bottom-2 left-3 text-[10px] font-bold tracking-wide uppercase text-slate-700 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
          {product.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4">
        
        {/* Rating & Review Count */}
        <div className="mb-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Title with Line Clamping for Equal Row Heights */}
        <Link to={`/product/${product.id}`} className="group-hover:text-sky-600 transition-colors mb-2 block">
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 min-h-[2.5rem] leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Marketplace Availability Pill */}
        {product.lowestMarketplace && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-[11px] font-medium">Best price on:</span>
            <MarketplaceBadge marketplaceId={product.lowestMarketplace} isLowest={true} />
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          
          {/* Price Box */}
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
              {formatINR(product.currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-xs text-slate-400 line-through mt-0.5">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <Link
            to={`/product/${product.id}`}
            className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-200 border ${
              isVideoCard 
                ? 'bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border-red-200 hover:border-red-600'
                : 'bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border-sky-200 hover:border-sky-600'
            }`}
          >
            <span>{isVideoCard ? "Watch & Compare" : "Compare Deals"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;
