import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import RatingStars from '../components/product/RatingStars';
import { productService } from '../services/productService';
import { formatINR } from '../utils/currency';
import { 
  ChevronRight, 
  Star, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  ShoppingBag, 
  Youtube, 
  Instagram, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

// Marketplace Visual Configuration
const MARKETPLACES = {
  amazon: {
    name: 'Amazon',
    dot: '🟠',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-950',
    btnBg: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  flipkart: {
    name: 'Flipkart',
    dot: '🟡',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-950',
    btnBg: 'bg-yellow-500 hover:bg-yellow-600 text-slate-900',
  },
  meesho: {
    name: 'Meesho',
    dot: '🟣',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-950',
    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  myntra: {
    name: 'Myntra',
    dot: '🌸',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-950',
    btnBg: 'bg-pink-600 hover:bg-pink-700 text-white',
  },
  reliance: {
    name: 'Reliance',
    dot: '🔵',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-950',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  instamart: {
    name: 'Instamart',
    dot: '🟢',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-950',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  other: {
    name: 'Store',
    dot: '⚪',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-900',
    btnBg: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
};

// Helper: Extract YouTube Embed Video ID
function getYouTubeId(url, explicitId) {
  if (explicitId && String(explicitId).trim().length > 0) {
    return explicitId.trim();
  }
  if (!url) return '';
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  } catch (e) {
    return '';
  }
}

export const ProductDetailPage = () => {
  const { id: slugOrId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch Product Data
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(slugOrId);
        if (!data) {
          setError('Product not found.');
        } else {
          setProduct(data);
          setActiveImageIndex(0);
          const prodTitle = data.name || data.title || 'Product Details';
          document.title = `${prodTitle} | Nitya Yantra`;
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }

    if (slugOrId) {
      fetchProduct();
    }
    window.scrollTo(0, 0);
  }, [slugOrId]);

  // Loading State
  if (loading) {
    return (
      <PageContainer className="py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 aspect-square bg-slate-200 rounded-2xl" />
            <div className="lg:col-span-7 space-y-4">
              <div className="h-8 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
              <div className="h-28 bg-slate-200 rounded-2xl" />
              <div className="h-40 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Error / Not Found State
  if (error || !product) {
    return (
      <PageContainer className="py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
          <p className="text-xs text-slate-500">
            {error || "The product you're looking for does not exist or has been removed."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      </PageContainer>
    );
  }

  // Normalize Product Data
  const productName = product.name || product.title || 'Product Details';
  const categoryName = typeof product.category === 'object' ? (product.category?.name || 'Catalog') : (product.category || 'Catalog');
  const categorySlug = typeof product.category === 'object' ? (product.category?.slug || 'all') : 'all';

  // Normalize Images
  let imagesList = [];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    imagesList = product.images.map((img) => typeof img === 'string' ? { url: img, alt: productName } : { url: img.url, alt: img.alt || productName });
  } else if (product.image) {
    imagesList = [{ url: product.image, alt: productName }];
  } else {
    imagesList = [{ url: 'https://via.placeholder.com/600x600?text=No+Image', alt: productName }];
  }

  const primaryImage = imagesList[activeImageIndex]?.url || imagesList[0]?.url;

  // Normalize Marketplace Offers (Only existing ones)
  const offersList = (product.marketplaceOffers && Array.isArray(product.marketplaceOffers))
    ? product.marketplaceOffers.filter(o => o.url || o.affiliateUrl)
    : [];

  const sortedOffers = [...offersList].sort((a, b) => (a.price || 0) - (b.price || 0));
  const bestOffer = sortedOffers[0];
  const lowestPrice = product.lowestPrice || bestOffer?.price || 0;
  const lowestMarketplace = product.lowestMarketplace || bestOffer?.marketplace || 'Store';
  const bestOfferBuyUrl = bestOffer?.affiliateUrl || bestOffer?.url || '#';
  const discount = product.discountPercent || (bestOffer?.originalPrice > lowestPrice ? Math.round(((bestOffer.originalPrice - lowestPrice) / bestOffer.originalPrice) * 100) : 0);

  // Video Content
  const ytVideoId = getYouTubeId(product.videos?.youtubeUrl || product.youtubeUrl, product.videos?.youtubeVideoId || product.youtubeVideoId);
  const ytTitle = product.videos?.youtubeTitle || product.youtubeTitle || `${productName} - Video Review`;
  const instaUrl = product.videos?.instagramUrl || product.instagramUrl;

  // Specs
  const specsMap = product.specs instanceof Map ? Object.fromEntries(product.specs) : (product.specs || {});
  const specsEntries = Object.entries(specsMap);

  return (
    <PageContainer className="pb-24 lg:pb-12">
      
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5 overflow-x-auto whitespace-nowrap py-1">
        <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to="/products" className="hover:text-sky-600 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to={`/category/${categorySlug}`} className="hover:text-sky-600 transition-colors capitalize">{categoryName}</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{productName}</span>
      </nav>

      {/* 2. PRODUCT HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 mb-10 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 space-y-3.5 w-full">
          <div className="relative aspect-square w-full max-w-[440px] lg:max-w-none mx-auto bg-[#f8fafc] rounded-2xl border border-slate-200 p-5 flex items-center justify-center shadow-2xs overflow-hidden">
            <img
              src={primaryImage}
              alt={imagesList[activeImageIndex]?.alt || productName}
              className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300 pointer-events-none"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
              }}
            />
            {discount > 0 && (
              <span className="absolute top-3.5 left-3.5 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wide shadow-2xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Selectors */}
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
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Overview & Direct Store Action */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 mb-2">
              Category: {categoryName}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              {productName}
            </h1>
          </div>

          {/* Rating Row */}
          <div className="flex flex-wrap items-center gap-3 py-2.5 border-y border-slate-200/80">
            {(product.rating !== undefined && product.rating > 0) && (
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="medium" />
            )}
            {product.editorialRating && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="font-extrabold text-amber-900">Editorial Score: </span>
                <span className="font-black text-amber-700">{product.editorialRating} / 5.0</span>
              </div>
            )}
          </div>

          {/* Short Description */}
          {(product.shortDescription || product.description) && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.shortDescription || product.description}
            </p>
          )}

          {/* Lowest Price Banner */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Lowest Available Price</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full capitalize">
                Best on {lowestMarketplace}
              </span>
            </div>

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

            {/* Direct Buy Button for Lowest Price Offer */}
            <a
              href={bestOfferBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[46px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="capitalize">Buy on {lowestMarketplace} ({formatINR(lowestPrice)})</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* 3. WHERE TO BUY SECTION */}
      {sortedOffers.length > 0 && (
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 mb-9">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <span>WHERE TO BUY</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available offers verified across trusted stores. Click to visit store directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {sortedOffers.map((offer, idx) => {
              const mpKey = (offer.marketplace || 'other').toLowerCase();
              const cfg = MARKETPLACES[mpKey] || MARKETPLACES.other;
              const targetUrl = offer.affiliateUrl || offer.url || '#';
              const isBest = idx === 0;

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    isBest 
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs' 
                      : `${cfg.bg} ${cfg.border}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cfg.dot}</span>
                      <span className="font-extrabold text-sm text-slate-900 capitalize">{offer.marketplace}</span>
                    </div>
                    {isBest && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        Lowest Price
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-slate-900">{formatINR(offer.price)}</span>
                      {offer.originalPrice && offer.originalPrice > offer.price && (
                        <span className="text-xs text-slate-400 line-through">{formatINR(offer.originalPrice)}</span>
                      )}
                    </div>
                    {offer.deliveryText && (
                      <p className="text-[11px] text-slate-500 font-medium">{offer.deliveryText}</p>
                    )}
                  </div>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-3 rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${cfg.btnBg}`}
                  >
                    <span className="capitalize">Buy on {offer.marketplace}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. WATCH BEFORE BUYING SECTION (Only if video exists) */}
      {ytVideoId && (
        <section className="bg-slate-900 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-md space-y-4 mb-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800 rounded-full mb-1">
                <Youtube className="w-3 h-3 fill-red-400 text-red-400" />
                <span>VIDEO DEMO & REVIEW</span>
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                WATCH BEFORE BUYING
              </h2>
            </div>

            {instaUrl && (
              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>View on Instagram</span>
              </a>
            )}
          </div>

          <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${ytVideoId}?autoplay=0&rel=0`}
              title={ytTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </section>
      )}

      {/* 5. PRODUCT FEATURES (KEY HIGHLIGHTS) */}
      {product.keyFeatures && Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0 && (
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 mb-9">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <span>PRODUCT FEATURES</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.keyFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-800">{feat}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. SPECIFICATIONS TABLE */}
      {specsEntries.length > 0 && (
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 mb-9">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            SPECIFICATIONS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {specsEntries.map(([key, val]) => (
              <div key={key} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-500">{key}:</span>
                <span className="font-extrabold text-slate-900 text-right">{String(val)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. AFFILIATE DISCLOSURE */}
      <div className="flex items-start gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 max-w-3xl mx-auto text-center justify-center">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          Nitya Yantra may earn a commission when you purchase through our links, at no extra cost to you.
        </p>
      </div>

      {/* 8. STICKY MOBILE BOTTOM BUY BAR (<1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold block capitalize">Best on {lowestMarketplace}</span>
          <span className="text-lg font-black text-slate-900">{formatINR(lowestPrice)}</span>
        </div>

        <a
          href={bestOfferBuyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-[44px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="capitalize">Buy on {lowestMarketplace}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </PageContainer>
  );
};

export default ProductDetailPage;
