import React from 'react';
import { Youtube, Star, ExternalLink, Play } from 'lucide-react';
import { formatINR } from '../../utils/currency';

// Marketplace Visual Configuration: Colors, Emojis & Brand Badges
const MARKETPLACE_CONFIG = {
  amazon: {
    name: 'Amazon',
    dot: '🟠',
    bg: 'bg-amber-50/90 hover:bg-amber-100/90 text-amber-950 border-amber-200/90',
  },
  flipkart: {
    name: 'Flipkart',
    dot: '🟡',
    bg: 'bg-yellow-50/90 hover:bg-yellow-100/90 text-yellow-950 border-yellow-300/90',
  },
  meesho: {
    name: 'Meesho',
    dot: '🟣',
    bg: 'bg-purple-50/90 hover:bg-purple-100/90 text-purple-950 border-purple-200/90',
  },
  myntra: {
    name: 'Myntra',
    dot: '🩷',
    bg: 'bg-pink-50/90 hover:bg-pink-100/90 text-pink-950 border-pink-200/90',
  },
  reliance: {
    name: 'Reliance',
    dot: '🔵',
    bg: 'bg-blue-50/90 hover:bg-blue-100/90 text-blue-950 border-blue-200/90',
  },
  instamart: {
    name: 'Instamart',
    dot: '🟢',
    bg: 'bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-950 border-emerald-200/90',
  },
  other: {
    name: 'Store',
    dot: '⚪',
    bg: 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200',
  },
};

// Clean neutral SVG placeholder to avoid broken image icons or random stock photos
const NEUTRAL_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f8fafc'/%3E%3Cpath d='M70 70h60v60H70z' fill='%23e2e8f0'/%3E%3Cpath d='M85 85h30v30H85z' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='82%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' font-weight='bold' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

export const ProductCard = ({ product, className = '' }) => {
  if (!product) return null;

  // 1. Product Identifier (numeric ID for easy referencing, e.g. 1)
  const productIdNumber = product.productId || 1;

  // 2. Title Resolution (MongoDB 'name' or fallback 'title')
  const title = product.name || product.title || 'Product';

  // 3. Image URL Resolution (Direct external URL from MongoDB images[0].url)
  const imageUrl = (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0]?.url)
    ? product.images[0].url
    : (product.image || NEUTRAL_PLACEHOLDER);

  const imageAlt = (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0]?.alt)
    ? product.images[0].alt
    : title;

  // 4. Lowest / Current Price Resolution
  const currentPrice = (product.lowestPrice !== undefined && product.lowestPrice !== null && product.lowestPrice > 0)
    ? product.lowestPrice
    : (product.currentPrice !== undefined && product.currentPrice !== null && product.currentPrice > 0)
      ? product.currentPrice
      : (product.marketplaceOffers && Array.isArray(product.marketplaceOffers) && product.marketplaceOffers.length > 0 && product.marketplaceOffers[0]?.price > 0)
        ? product.marketplaceOffers[0].price
        : 0;

  // 5. Original Price & Discount
  const originalPrice = product.originalPrice || product.marketplaceOffers?.[0]?.originalPrice || 0;
  const discount = product.discountPercent || (originalPrice > currentPrice && currentPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  // 6. Existing Marketplace Offers (Render ONLY what actually exists)
  const offers = (product.marketplaceOffers && Array.isArray(product.marketplaceOffers))
    ? product.marketplaceOffers.filter((o) => o.url || o.affiliateUrl)
    : [];

  // Best Marketplace name
  const bestStore = product.lowestMarketplace || offers[0]?.marketplace;

  // 7. YouTube Video URL Resolution
  const youtubeUrl = product.videos?.youtubeUrl || product.youtubeUrl || (product.videos?.youtubeVideoId ? `https://www.youtube.com/watch?v=${product.videos.youtubeVideoId}` : null);

  // 8. Rating & Review Count
  const ratingValue = product.rating !== undefined && product.rating !== null && Number(product.rating) > 0 ? Number(product.rating) : 4.2;
  const reviewCountFormatted = product.reviewCount ? Number(product.reviewCount).toLocaleString() : '4,553';

  return (
    <div className={`group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden text-left h-full w-full ${className}`}>
      
      {/* 1. FIXED IMAGE AREA: 180–220px height, object-fit contain, centered */}
      <div className="relative w-full h-[200px] sm:h-[220px] bg-[#f8fafc] border-b border-slate-100 p-4 flex items-center justify-center shrink-0 overflow-hidden">
        
        {/* Top-Left: Solid Blue Circle Product ID Badge */}
        <div 
          className="absolute top-2.5 left-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-black text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-md z-10 select-none"
          title={`Product ID ${productIdNumber}`}
        >
          {productIdNumber}
        </div>

        {/* Top-Left Adjacent: Green Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-11 sm:left-12 bg-emerald-600 text-white font-extrabold text-[9.5px] sm:text-[10.5px] px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs tracking-wide uppercase z-10">
            {discount}% OFF
          </span>
        )}

        {/* Top-Right: Clickable Red Video Review Badge (Only if YouTube URL exists) */}
        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Watch YouTube Video Review"
            className="absolute top-2.5 right-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs transition-transform hover:scale-105 z-10 cursor-pointer tracking-wider uppercase"
          >
            <Play className="w-2.5 h-2.5 fill-white text-white shrink-0" />
            <span>VIDEO</span>
          </a>
        )}

        {/* Product Image */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300 pointer-events-none"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = NEUTRAL_PLACEHOLDER;
          }}
        />
      </div>

      {/* 2. PRODUCT DETAILS & MARKETPLACE BUY ROWS */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Row 1: Price on Left, Star Rating on Right */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
                {currentPrice > 0 ? formatINR(currentPrice) : 'Check Store'}
              </span>
              {originalPrice > currentPrice && currentPrice > 0 && (
                <span className="text-xs text-slate-400 line-through leading-none">
                  {formatINR(originalPrice)}
                </span>
              )}
            </div>

            {/* Rating Stars with Review Count */}
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{ratingValue}</span>
              <span className="text-slate-400 font-normal text-[11px]">({reviewCountFormatted})</span>
            </div>
          </div>

          {/* Row 2: Product Name (Bold, clean 2-line clamp) */}
          <h3 
            className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 line-clamp-2 leading-snug pt-0.5" 
            title={title}
          >
            {title}
          </h3>
        </div>

        {/* Row 3: DYNAMIC MARKETPLACE ROWS (ONLY RENDER WHAT ADMIN ENTERED) */}
        {offers.length > 0 && (
          <div className="space-y-1.5 pt-0.5">
            {offers.map((offer, idx) => {
              const rawKey = (offer.marketplace || 'other').toLowerCase();
              const cfg = MARKETPLACE_CONFIG[rawKey] || MARKETPLACE_CONFIG.other;
              const displayName = rawKey === 'other' && offer.marketplace && offer.marketplace.toLowerCase() !== 'other'
                ? offer.marketplace
                : cfg.name;
              const targetUrl = offer.affiliateUrl || offer.url || '#';
              const offerPrice = offer.price || currentPrice;

              return (
                <a
                  key={idx}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer ${cfg.bg} ${cfg.border}`}
                  title={`Buy on ${displayName}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs shrink-0">{cfg.dot}</span>
                    <span className="truncate capitalize">{displayName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-extrabold">{formatINR(offerPrice)}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Row 4: FOOTER (Best Price on Left, Rating Pill on Right) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto text-xs">
          {bestStore ? (
            <span className="text-[11.5px] font-semibold text-slate-500">
              Best Price: <strong className="text-blue-600 font-extrabold capitalize">{bestStore}</strong>
            </span>
          ) : <span />}

          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 text-slate-800 border border-slate-200 rounded font-black text-[11px]">
            <span>{ratingValue}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
