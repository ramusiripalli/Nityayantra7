import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Star } from 'lucide-react';
import { formatINR } from '../../utils/currency';

// Marketplace Visual Configuration: Colors & Emojis
const MARKETPLACE_CONFIG = {
  amazon: {
    name: 'Amazon',
    dot: '🟠',
    bg: 'bg-amber-50 hover:bg-amber-100/90',
    border: 'border-amber-200',
    text: 'text-amber-950',
  },
  flipkart: {
    name: 'Flipkart',
    dot: '🟡',
    bg: 'bg-yellow-50 hover:bg-yellow-100/90',
    border: 'border-yellow-300',
    text: 'text-yellow-950',
  },
  meesho: {
    name: 'Meesho',
    dot: '🟣',
    bg: 'bg-purple-50 hover:bg-purple-100/90',
    border: 'border-purple-200',
    text: 'text-purple-950',
  },
  myntra: {
    name: 'Myntra',
    dot: '🌸',
    bg: 'bg-pink-50 hover:bg-pink-100/90',
    border: 'border-pink-200',
    text: 'text-pink-950',
  },
  reliance: {
    name: 'Reliance',
    dot: '🔵',
    bg: 'bg-blue-50 hover:bg-blue-100/90',
    border: 'border-blue-200',
    text: 'text-blue-950',
  },
  instamart: {
    name: 'Instamart',
    dot: '🟢',
    bg: 'bg-emerald-50 hover:bg-emerald-100/90',
    border: 'border-emerald-200',
    text: 'text-emerald-950',
  },
  other: {
    name: 'Store',
    dot: '⚪',
    bg: 'bg-slate-50 hover:bg-slate-100',
    border: 'border-slate-200',
    text: 'text-slate-900',
  },
};

// Clean neutral SVG placeholder to avoid random stock photos
const NEUTRAL_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f8fafc'/%3E%3Cpath d='M70 70h60v60H70z' fill='%23e2e8f0'/%3E%3Cpath d='M85 85h30v30H85z' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='82%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' font-weight='bold' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

export const ProductCard = ({ product, isVideoCard = false, className = '' }) => {
  if (!product) return null;

  // 1. Title Resolution (MongoDB 'name' or fallback 'title')
  const title = product.name || product.title || 'Product Details';

  // 2. Image URL Resolution (Direct external URL from MongoDB images[0].url)
  const imageUrl = (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0]?.url)
    ? product.images[0].url
    : (product.image || NEUTRAL_PLACEHOLDER);

  const imageAlt = (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0]?.alt)
    ? product.images[0].alt
    : title;

  // 3. Lowest Price Resolution
  const currentPrice = (product.lowestPrice !== undefined && product.lowestPrice !== null && product.lowestPrice > 0)
    ? product.lowestPrice
    : (product.currentPrice !== undefined && product.currentPrice !== null && product.currentPrice > 0)
      ? product.currentPrice
      : (product.marketplaceOffers && Array.isArray(product.marketplaceOffers) && product.marketplaceOffers.length > 0 && product.marketplaceOffers[0]?.price > 0)
        ? product.marketplaceOffers[0].price
        : 0;

  // 4. Original Price & Discount
  const originalPrice = product.originalPrice || product.marketplaceOffers?.[0]?.originalPrice || 0;
  const discount = product.discountPercent || (originalPrice > currentPrice && currentPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);
  const savings = (originalPrice > currentPrice && currentPrice > 0) ? (originalPrice - currentPrice) : 0;

  // 5. Existing Marketplace Offers (Render ONLY what actually exists)
  const offers = (product.marketplaceOffers && Array.isArray(product.marketplaceOffers))
    ? product.marketplaceOffers.filter((o) => o.url || o.affiliateUrl)
    : [];

  // 6. Video Badge & Slug
  const youtubeVideoId = product.videos?.youtubeVideoId || product.youtubeVideoId;
  const productSlug = product.slug || product.id || product._id;

  return (
    <div className={`group flex flex-col bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden text-left h-full w-full justify-between ${className}`}>
      
      {/* 1. FIXED IMAGE AREA: Fixed container height (185px desktop, 145px mobile) */}
      <Link 
        to={`/product/${productSlug}`} 
        className="relative block w-full h-[145px] sm:h-[185px] bg-[#f8fafc] border-b border-slate-100 p-2.5 sm:p-3 shrink-0 overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-200 pointer-events-none"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = NEUTRAL_PLACEHOLDER;
          }}
        />

        {/* Top-Left Green Discount Badge (Only if discount > 0) */}
        {discount > 0 && !isVideoCard && (
          <span className="absolute top-2 left-2 bg-emerald-600 text-white font-extrabold text-[9.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs tracking-wide">
            {discount}% OFF
          </span>
        )}

        {/* Top-Right Red Video Review Badge */}
        {youtubeVideoId && !isVideoCard && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <Youtube className="w-2.5 h-2.5 fill-white" />
            <span className="hidden sm:inline">Video</span>
          </span>
        )}
      </Link>

      {/* 2. PRODUCT DETAILS & PRICING */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 justify-between space-y-2.5">
        
        <div className="space-y-1">
          {/* Price Hierarchy */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-slate-900 leading-none">
              {currentPrice > 0 ? formatINR(currentPrice) : 'Price on Store'}
            </span>
            {originalPrice > currentPrice && currentPrice > 0 && (
              <span className="text-[10.5px] sm:text-xs text-slate-400 line-through leading-none">
                {formatINR(originalPrice)}
              </span>
            )}
            {savings > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 leading-none">
                Save {formatINR(savings)}
              </span>
            )}
          </div>

          {/* Product Name (Strict 2-line clamp, navigates to product details) */}
          <Link to={`/product/${productSlug}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 
              className="text-xs sm:text-[13px] font-semibold text-slate-900 line-clamp-2 h-[2.2rem] sm:h-[2.4rem] leading-[1.3] overflow-hidden" 
              title={title}
            >
              {title}
            </h3>
          </Link>
        </div>

        {/* 3. DYNAMIC MARKETPLACE DIRECT STORE BUTTONS (ONLY RENDER WHAT EXISTS) */}
        {offers.length > 0 && (
          <div className="space-y-1 pt-1">
            {offers.slice(0, 3).map((offer, idx) => {
              const mpKey = (offer.marketplace || 'other').toLowerCase();
              const cfg = MARKETPLACE_CONFIG[mpKey] || MARKETPLACE_CONFIG.other;
              const targetUrl = offer.affiliateUrl || offer.url || '#';
              const offerPrice = offer.price || currentPrice;

              return (
                <a
                  key={idx}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-150 ${cfg.bg} ${cfg.border} ${cfg.text} hover:shadow-2xs cursor-pointer`}
                  title={`Buy on ${cfg.name}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs shrink-0">{cfg.dot}</span>
                    <span className="truncate capitalize">{offer.marketplace}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-extrabold">{formatINR(offerPrice)}</span>
                    <span className="text-[10px] opacity-70">→</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* 4. BOTTOM FOOTER: Rating & Verified Store indicator (NO "Compare Deals") */}
        <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 mt-auto">
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
            {product.lowestMarketplace ? `Best: ${product.lowestMarketplace}` : 'Verified Price'}
          </span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded font-bold text-[9.5px]">
            <span>{product.rating || 4.5}</span>
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
