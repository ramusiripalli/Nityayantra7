import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import RatingStars from '../components/product/RatingStars';
import { productService } from '../services/productService';
import { formatINR, calculateDiscount } from '../utils/currency';
import { AFFILIATE_DISCLOSURE_TEXT, MARKETPLACES } from '../utils/constants';
import { 
  CheckCircle2, 
  XCircle, 
  Youtube, 
  ExternalLink, 
  ShoppingBag, 
  Award, 
  ChevronRight,
  Sparkles,
  Info,
  PackageX,
  ArrowLeft,
  Home,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  Play,
  PiggyBank,
  RefreshCw,
  Instagram,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { slug, id } = useParams();
  const productIdentifier = slug || id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  
  const comparisonRef = useRef(null);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductById(productIdentifier);
      setProduct(data);
      
      // Auto-set YouTube Video ID
      const ytId = data?.videos?.youtubeVideoId || data?.youtubeVideoId;
      if (ytId) {
        setSelectedVideoId(ytId);
      }
    } catch (err) {
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [productIdentifier]);

  // Update Page Title for SEO
  useEffect(() => {
    if (product) {
      const prodName = product.name || product.title || 'Product Details';
      document.title = `${prodName} | Price Comparison & Review | Nitya Yantra`;
    } else {
      document.title = 'Product Details | Nitya Yantra';
    }
  }, [product]);

  const scrollToComparison = () => {
    if (comparisonRef.current) {
      comparisonRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper: Extract YouTube ID from URL if not already provided
  const getYouTubeId = (url, existingId) => {
    if (existingId) return existingId;
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.trim().match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  // Helper: Determine Editorial Verdict
  const getVerdict = (prod) => {
    const rating = prod.editorialRating || prod.rating || 4.2;
    if (rating >= 4.5) {
      return {
        label: 'WORTH BUYING',
        badgeBg: 'bg-emerald-600 text-white',
        cardBg: 'bg-emerald-50/80 border-emerald-300 text-emerald-900',
        icon: '🟢'
      };
    } else if (rating >= 4.0) {
      return {
        label: 'GOOD DEAL',
        badgeBg: 'bg-amber-500 text-white',
        cardBg: 'bg-amber-50/80 border-amber-300 text-amber-900',
        icon: '🟡'
      };
    } else if (rating >= 3.5) {
      return {
        label: 'WAIT FOR DISCOUNT',
        badgeBg: 'bg-sky-600 text-white',
        cardBg: 'bg-sky-50/80 border-sky-300 text-sky-900',
        icon: '🔵'
      };
    } else {
      return {
        label: 'CONSIDER ALTERNATIVES',
        badgeBg: 'bg-rose-600 text-white',
        cardBg: 'bg-rose-50/80 border-rose-300 text-rose-900',
        icon: '🔴'
      };
    }
  };

  // --------------------------------------------------
  // 1. SKELETON LOADING STATE
  // --------------------------------------------------
  if (loading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-6 py-4">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-80 bg-slate-200 rounded-3xl" />
            <div className="lg:col-span-7 space-y-4">
              <div className="h-6 w-1/4 bg-slate-200 rounded-full" />
              <div className="h-8 w-3/4 bg-slate-200 rounded" />
              <div className="h-6 w-1/3 bg-slate-200 rounded" />
              <div className="h-28 w-full bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // --------------------------------------------------
  // 2. ERROR / 404 STATE WITH RETRY
  // --------------------------------------------------
  if (error || !product) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 my-6">
          <div className="p-4 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
            <PackageX className="w-12 h-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Product Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Sorry, we couldn't find this product catalog item. It may have been moved, deactivated, or the link is invalid.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={fetchProduct}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Products</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  // --------------------------------------------------
  // DATA NORMALIZATION & COMPUTATION
  // --------------------------------------------------
  const productName = product.name || product.title || 'Product Details';
  const categoryName = typeof product.category === 'object' ? product.category?.name : (product.category || 'General');
  const categorySlug = typeof product.category === 'object' ? product.category?.slug : (product.category?.toLowerCase() || 'all');
  
  // Normalize Image List (supports array of {url, alt} or single string)
  let imagesList = [];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    imagesList = product.images.map((img) => typeof img === 'string' ? { url: img, alt: productName } : { url: img.url, alt: img.alt || productName });
  } else if (product.image) {
    imagesList = [{ url: product.image, alt: productName }];
  } else {
    imagesList = [{ url: 'https://via.placeholder.com/600x600?text=No+Product+Image', alt: productName }];
  }

  const primaryImage = imagesList[activeImageIndex]?.url || imagesList[0]?.url;

  // Normalize Marketplace Offers
  const offersList = product.marketplaceOffers && product.marketplaceOffers.length > 0
    ? product.marketplaceOffers
    : product.marketplaces && product.marketplaces.length > 0
      ? product.marketplaces.map((m) => ({
          marketplace: m.id || m.name || 'amazon',
          url: m.url || '#',
          affiliateUrl: m.affiliateUrl || m.url || '#',
          price: m.price || product.currentPrice || 0,
          originalPrice: m.originalPrice || product.originalPrice || 0,
          discount: m.discount || calculateDiscount(m.originalPrice || product.originalPrice, m.price || product.currentPrice),
          deliveryText: m.deliveryText || 'Free delivery',
          isAvailable: m.inStock !== false
        }))
      : [{
          marketplace: product.lowestMarketplace || 'amazon',
          url: '#',
          affiliateUrl: '#',
          price: product.currentPrice || product.lowestPrice || 0,
          originalPrice: product.originalPrice || 0,
          discount: product.discountPercent || 0,
          deliveryText: 'Free delivery',
          isAvailable: true
        }];

  // Sort offers: Lowest Price first
  const sortedOffers = [...offersList].sort((a, b) => a.price - b.price);
  const lowestPrice = product.lowestPrice || sortedOffers[0]?.price || 0;
  const lowestMarketplace = product.lowestMarketplace || sortedOffers[0]?.marketplace || 'amazon';
  const bestOffer = sortedOffers.find((o) => o.marketplace.toLowerCase() === lowestMarketplace.toLowerCase()) || sortedOffers[0];
  const bestOfferBuyUrl = bestOffer?.affiliateUrl || bestOffer?.url || '#';

  // Overall Discount & Savings
  const discount = product.discountPercent || (bestOffer?.originalPrice > lowestPrice ? Math.round(((bestOffer.originalPrice - lowestPrice) / bestOffer.originalPrice) * 100) : 0);
  const highestPrice = sortedOffers[sortedOffers.length - 1]?.price || lowestPrice;
  const maxSavings = highestPrice - lowestPrice;

  // Verdict Logic
  const verdict = getVerdict(product);

  // Video logic
  const ytVideoId = getYouTubeId(product.videos?.youtubeUrl || product.youtubeUrl, product.videos?.youtubeVideoId || product.youtubeVideoId);
  const ytTitle = product.videos?.youtubeTitle || product.youtubeTitle || `${productName} - Product Demo & Review`;
  const instaUrl = product.videos?.instagramUrl || product.instagramUrl;
  const hasVideoContent = Boolean(ytVideoId || instaUrl);

  // Specs Logic
  const specsMap = product.specs instanceof Map ? Object.fromEntries(product.specs) : (product.specs || {});
  const specsEntries = Object.entries(specsMap);

  return (
    <PageContainer className="pb-24 lg:pb-8">
      
      {/* -------------------------------------------------- */}
      {/* BREADCRUMB NAVIGATION */}
      {/* -------------------------------------------------- */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5 overflow-x-auto whitespace-nowrap py-1">
        <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to="/products" className="hover:text-sky-600 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to={`/category/${categorySlug}`} className="hover:text-sky-600 transition-colors capitalize">{categoryName}</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{productName}</span>
      </nav>

      {/* -------------------------------------------------- */}
      {/* PRODUCT HERO GRID (Desktop 12-Cols, Mobile Stacked) */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 mb-9 items-start">
        
        {/* LEFT COLUMN: Product Gallery */}
        <div className="lg:col-span-5 space-y-3.5 w-full">
          
          {/* Main Product Image Container */}
          <div className="relative aspect-square w-full max-w-[440px] lg:max-w-none mx-auto bg-[#f8fafc] rounded-2xl border border-slate-200 p-5 flex items-center justify-center shadow-2xs overflow-hidden">
            <img
              src={primaryImage}
              alt={imagesList[activeImageIndex]?.alt || productName}
              className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300 pointer-events-none"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Product+Image';
              }}
            />
            {discount > 0 && (
              <span className="absolute top-3.5 left-3.5 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wide shadow-2xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Image Selectors (Shown only if multi-image exists) */}
          {imagesList.length > 1 && (
            <div className="flex items-center justify-center lg:justify-start gap-2.5 overflow-x-auto pb-1">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View thumbnail ${idx + 1}`}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-[#f8fafc] p-1.5 transition-all cursor-pointer shrink-0 ${
                    activeImageIndex === idx 
                      ? 'border-sky-600 ring-2 ring-sky-100 scale-105' 
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Thumb';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Overview, Verdict, Price Comparison Summary & Hero Card */}
        <div className="lg:col-span-7 space-y-4">
          
          <div>
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 mb-2">
              Category: {categoryName}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              {productName}
            </h1>
          </div>

          {/* Ratings & Editorial Verdict Row */}
          <div className="flex flex-wrap items-center gap-3 py-2.5 border-y border-slate-200/80">
            {/* Nitya Yantra Verdict Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-extrabold shadow-2xs ${verdict.cardBg}`}>
              <span>{verdict.icon}</span>
              <span className="uppercase tracking-wider">VERDICT: {verdict.label}</span>
            </div>

            {/* Editorial Rating */}
            {product.editorialRating && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="font-extrabold text-amber-900">NY Editorial: </span>
                <span className="font-black text-amber-700">{product.editorialRating} / 5.0</span>
              </div>
            )}

            {/* User Rating */}
            {(product.rating !== undefined && product.rating > 0) && (
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="medium" />
            )}
          </div>

          {/* Short Description */}
          {(product.shortDescription || product.description) && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.shortDescription || product.description}
            </p>
          )}

          {/* -------------------------------------------------- */}
          {/* BEST PRICE MATCH HERO CARD */}
          {/* -------------------------------------------------- */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-800 shadow-md space-y-3.5">
            
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-black text-sm tracking-wide text-white uppercase">BEST PRICE MATCH</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                ✓ Verified Best Price
              </span>
            </div>

            {/* Price Row */}
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Lowest Marketplace Price:</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-white">{formatINR(lowestPrice)}</span>
                  {bestOffer?.originalPrice && bestOffer.originalPrice > lowestPrice && (
                    <span className="text-sm text-slate-400 line-through">{formatINR(bestOffer.originalPrice)}</span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 border border-emerald-700 px-2 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Best Deal At:</span>
                <span className="text-base font-black text-emerald-300 uppercase tracking-wide">
                  {lowestMarketplace}
                </span>
              </div>
            </div>

            {/* Savings Callout Banner */}
            {maxSavings > 0 && sortedOffers.length > 1 && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 p-2.5 rounded-xl">
                <PiggyBank className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You save {formatINR(maxSavings)} by choosing the lowest listed price.</span>
              </div>
            )}

            {/* Top Marketplace Offers Quick List */}
            <div className="space-y-1.5 pt-1">
              {sortedOffers.slice(0, 3).map((offer, idx) => {
                const isCheapest = idx === 0;
                const percentHigher = !isCheapest && lowestPrice ? Math.round(((offer.price - lowestPrice) / lowestPrice) * 100) : 0;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-slate-800/80 border border-slate-700/60">
                    <span className="font-bold text-slate-200 capitalize">{offer.marketplace}</span>
                    <div className="flex items-center gap-3">
                      <span className={`font-black ${isCheapest ? 'text-emerald-400' : 'text-slate-300'}`}>{formatINR(offer.price)}</span>
                      {isCheapest ? (
                        <span className="text-[9.5px] font-black text-emerald-400 bg-emerald-900/80 px-1.5 py-0.2 rounded">BEST PRICE</span>
                      ) : (
                        <span className="text-[9.5px] font-bold text-slate-400">+{formatINR(offer.price - lowestPrice)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Action Bar: Primary "BUY NOW" (uses affiliateUrl if available) + Secondary "Compare Prices" */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={bestOfferBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] h-[48px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Buy on {lowestMarketplace} ({formatINR(lowestPrice)})</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={scrollToComparison}
              className="h-[48px] px-5 bg-white border-2 border-sky-200 hover:border-sky-500 text-sky-800 font-bold text-xs sm:text-sm rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>Compare Prices ({sortedOffers.length} Stores)</span>
              <ChevronDown className="w-4 h-4 text-sky-600" />
            </button>
          </div>

        </div>

      </div>

      {/* -------------------------------------------------- */}
      {/* MARKETPLACE PRICE COMPARISON SECTION */}
      {/* -------------------------------------------------- */}
      <div 
        ref={comparisonRef} 
        id="marketplace-comparison" 
        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 mb-9 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3.5 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
              <span>✓ Verified Sellers</span>
              <span>•</span>
              <span>Sorted by Lowest Price</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <span>Compare Prices ({sortedOffers.length} Marketplaces)</span>
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Click to open store offer link directly
          </span>
        </div>

        {/* Sorted Marketplace Offer Cards */}
        <div className="space-y-3">
          {sortedOffers.map((offer, idx) => {
            const isCheapest = idx === 0;
            const mpKey = offer.marketplace.toLowerCase();
            const mpMeta = MARKETPLACES[mpKey] || { name: offer.marketplace, badgeBg: 'bg-slate-100', badgeText: 'text-slate-800', btnBg: 'bg-sky-600 hover:bg-sky-700' };
            const buyUrl = offer.affiliateUrl || offer.url || '#';
            const priceDiff = offer.price - lowestPrice;

            return (
              <div 
                key={idx} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-3 ${
                  isCheapest 
                    ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-200 shadow-2xs' 
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Left: Marketplace Badge + Delivery & Availability */}
                <div className="flex items-center gap-3">
                  <span className={`font-black text-xs px-3 py-1.5 rounded-md border capitalize ${mpMeta.badgeBg || 'bg-slate-200'} ${mpMeta.badgeText || 'text-slate-800'} ${mpMeta.borderColor || 'border-slate-300'}`}>
                    {offer.marketplace}
                  </span>
                  
                  {isCheapest ? (
                    <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider shadow-2xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>BEST PRICE</span>
                    </span>
                  ) : priceDiff > 0 ? (
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                      +{formatINR(priceDiff)} more
                    </span>
                  ) : null}

                  {offer.deliveryText && (
                    <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                      • {offer.deliveryText}
                    </span>
                  )}
                </div>

                {/* Right: Price + Discount + Buy Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-base sm:text-lg font-black ${isCheapest ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {formatINR(offer.price)}
                      </span>
                      {offer.originalPrice && offer.originalPrice > offer.price && (
                        <span className="text-xs text-slate-400 line-through">{formatINR(offer.originalPrice)}</span>
                      )}
                    </div>
                    {offer.discount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 block leading-none">
                        {offer.discount}% OFF
                      </span>
                    )}
                  </div>

                  <a
                    href={buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 ${
                      isCheapest 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : mpMeta.btnBg || 'bg-sky-600 hover:bg-sky-700 text-white'
                    } font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer shrink-0`}
                  >
                    <span className="capitalize">Buy on {offer.marketplace}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Affiliate Disclosure */}
        <div className="pt-2 flex items-start gap-2 text-[11px] text-slate-500 border-t border-slate-100">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p>{AFFILIATE_DISCLOSURE_TEXT}</p>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* PROS ("WHY WE LIKE IT") & CONS ("THINGS TO CONSIDER") */}
      {/* -------------------------------------------------- */}
      {( (product.pros && product.pros.length > 0) || (product.cons && product.cons.length > 0) ) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 mb-9">
          
          {/* WHY WE LIKE IT (Pros) */}
          {product.pros && product.pros.length > 0 && (
            <div className="bg-emerald-50/50 p-5 sm:p-6 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3.5">
              <h3 className="text-sm font-extrabold text-emerald-900 border-b border-emerald-200/60 pb-3 flex items-center gap-2 uppercase tracking-wider">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>WHY WE LIKE IT</span>
              </h3>
              <ul className="space-y-2">
                {product.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* THINGS TO CONSIDER (Cons) */}
          {product.cons && product.cons.length > 0 && (
            <div className="bg-rose-50/50 p-5 sm:p-6 rounded-2xl border border-rose-200/80 shadow-2xs space-y-3.5">
              <h3 className="text-sm font-extrabold text-rose-900 border-b border-rose-200/60 pb-3 flex items-center gap-2 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>THINGS TO CONSIDER</span>
              </h3>
              <ul className="space-y-2">
                {product.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span className="font-medium">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* KEY HIGHLIGHTS / FEATURES */}
      {/* -------------------------------------------------- */}
      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-9 space-y-3.5">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>KEY PRODUCT HIGHLIGHTS</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.keyFeatures.map((feat, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* TECHNICAL SPECIFICATIONS TABLE */}
      {/* -------------------------------------------------- */}
      {specsEntries.length > 0 && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-9 space-y-3.5">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            TECHNICAL SPECIFICATIONS
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left text-slate-700 border-collapse">
              <tbody>
                {specsEntries.map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 w-1/3 border-b border-slate-100">{key}</td>
                    <td className="py-2.5 px-3.5 font-medium text-slate-700 border-b border-slate-100">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* VIDEO CONTENT SECTION ("WATCH BEFORE BUYING") */}
      {/* -------------------------------------------------- */}
      {hasVideoContent && (
        <div className="mb-9 bg-slate-900 text-white p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-card space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-600 text-white rounded-xl">
                <Youtube className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  WATCH BEFORE BUYING
                </h3>
                <p className="text-xs text-slate-400">
                  {ytTitle}
                </p>
              </div>
            </div>

            {instaUrl && (
              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>View on Instagram</span>
              </a>
            )}
          </div>

          {/* Embedded YouTube Player */}
          {ytVideoId && (
            <div className="pt-2">
              <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytVideoId}`}
                  title={ytTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Back to Products Footer */}
      <div className="border-t border-slate-200 pt-5 flex justify-between items-center">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </Link>
      </div>

      {/* STICKY MOBILE BOTTOM CTA BAR (<1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-2xl flex items-center justify-between gap-2.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-emerald-700 uppercase">Best Price</span>
          <span className="text-base font-black text-slate-900 leading-tight">{formatINR(lowestPrice)}</span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <button
            type="button"
            onClick={scrollToComparison}
            className="px-3 py-2 bg-slate-100 text-sky-800 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-200 cursor-pointer shrink-0"
          >
            Compare
          </button>
          
          <a
            href={bestOfferBuyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-[38px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Buy on {lowestMarketplace}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </PageContainer>
  );
};

export default ProductDetailPage;
