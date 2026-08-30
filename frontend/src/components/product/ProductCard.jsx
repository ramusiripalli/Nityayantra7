import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Star, ArrowRight } from 'lucide-react';
import MarketplaceBadge from './MarketplaceBadge';
import { formatINR, calculateDiscount } from '../../utils/currency';

export const ProductCard = ({ product, isVideoCard = false, className = '' }) => {
  if (!product) return null;

  const discount = product.discountPercent || calculateDiscount(product.originalPrice, product.currentPrice);
  
  // Extract unit / pack size / key spec string
  const unitText = product.packSize || 
    product.unit || 
    product.specs?.Capacity || 
    product.specs?.RAM || 
    product.specs?.Volume || 
    product.specs?.Pieces || 
    "1 pc";

  return (
    <div className={`group flex flex-col bg-white rounded-[14px] border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-[3px] transition-all duration-200 overflow-hidden text-left h-full w-full justify-between ${className}`}>
      
      {/* 1. FIXED IMAGE AREA (1:1 Aspect Ratio, Clean Neutral Background) */}
      <div className="relative w-full aspect-square bg-[#f8fafc] border-b border-slate-100 flex items-center justify-center p-3 sm:p-4 shrink-0 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain object-center group-hover:scale-[1.03] transition-transform duration-200 pointer-events-none"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />

        {/* 1. Top-Left Compact Green Discount Badge */}
        {discount > 0 && !isVideoCard && (
          <span className="absolute top-2 left-2 bg-emerald-600 text-white font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md shadow-2xs tracking-wide">
            {discount}% OFF
          </span>
        )}

        {/* 2. Top-Right Red Video Review Badge */}
        {product.youtubeVideoId && !isVideoCard && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <Youtube className="w-2.5 h-2.5 fill-white" />
            <span>Video Review</span>
          </span>
        )}
      </div>

      {/* 2. PRODUCT INFORMATION AREA (11-Point Hierarchy) */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 justify-between space-y-2">
        
        <div className="space-y-1.5">
          {/* 4, 5 & 6. Price Hierarchy (Current Price + Line-through Original + Savings) */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base lg:text-lg font-black text-slate-900 leading-none">
              {formatINR(product.currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through leading-none">
                {formatINR(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-[9.5px] sm:text-[10px] font-bold text-emerald-600 leading-none">
                Save {formatINR(product.originalPrice - product.currentPrice)}
              </span>
            )}
          </div>

          {/* 7. Product Title (Strict 2-Line Clamping) */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="text-xs sm:text-[13.5px] font-semibold text-slate-900 line-clamp-2 h-[2.2rem] sm:h-[2.4rem] leading-[1.35]">
              {product.title}
            </h3>
          </Link>

          {/* 8. Unit / Quantity Spec String */}
          <div className="h-4 flex items-center">
            <span className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
              {unitText}
            </span>
          </div>
        </div>

        {/* Bottom Aligned Metadata (Marketplace + Rating + Primary Compare Deals CTA) */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100 mt-auto">
          {/* 9. Best Marketplace Badge */}
          <div className="h-4.5 flex items-center">
            {product.lowestMarketplace ? (
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">Best:</span>
                <MarketplaceBadge marketplaceId={product.lowestMarketplace} isLowest={true} />
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium capitalize truncate">
                {product.category}
              </span>
            )}
          </div>

          {/* 10. Rating & Review Count */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded font-bold text-[10px]">
              <span>{product.rating || 4.5}</span>
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
            </div>
            {product.reviewCount && (
              <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">
                ({product.reviewCount > 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount} reviews)
              </span>
            )}
          </div>

          {/* 11. Primary Action Button: "Compare Deals →" */}
          <Link
            to={`/product/${product.slug || product.id || product._id}`}
            className="w-full h-[32px] bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-bold text-[11px] rounded-lg border border-sky-200/80 hover:border-sky-600 transition-all duration-200 flex items-center justify-center gap-1 mt-1 cursor-pointer shadow-2xs"
          >
            <span>Compare Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
