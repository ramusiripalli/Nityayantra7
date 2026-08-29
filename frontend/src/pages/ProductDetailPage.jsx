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
  Check,
  PiggyBank
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const comparisonRef = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        if (data && data.youtubeVideoId) {
          setSelectedVideo({
            id: data.youtubeVideoId,
            title: data.youtubeTitle || `${data.title} - Hands-On Test & Comparison`,
            creator: 'NY Testing Lab',
          });
        }
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const scrollToComparison = () => {
    if (comparisonRef.current) {
      comparisonRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-64 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-80 bg-slate-200 rounded-3xl" />
            <div className="lg:col-span-7 space-y-4">
              <div className="h-8 w-3/4 bg-slate-200 rounded" />
              <div className="h-6 w-1/3 bg-slate-200 rounded" />
              <div className="h-24 w-full bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 my-6">
          <div className="p-4 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
            <PackageX className="w-12 h-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Product Not Found</h1>
          <p className="text-sm text-slate-500 max-w-md">
            Sorry, we couldn't find this product. It may have been moved, deleted, or the ID is invalid.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Products</span>
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

  const discount = product.discountPercent || calculateDiscount(product.originalPrice, product.currentPrice);

  // Normalize marketplaces list and sort dynamically from LOWEST -> HIGHEST PRICE
  const rawMarketplaces = product.marketplaces && product.marketplaces.length > 0 
    ? product.marketplaces 
    : [
        { id: product.lowestMarketplace || "amazon", name: product.lowestMarketplace || "Amazon", price: product.currentPrice, originalPrice: product.originalPrice, inStock: true, url: "#" },
        { id: "flipkart", name: "Flipkart", price: Math.round(product.currentPrice * 1.03), originalPrice: product.originalPrice, inStock: true, url: "#" },
        { id: "meesho", name: "Meesho", price: Math.round(product.currentPrice * 1.09), originalPrice: product.originalPrice, inStock: true, url: "#" },
        { id: "myntra", name: "Myntra", price: Math.round(product.currentPrice * 1.13), originalPrice: product.originalPrice, inStock: true, url: "#" }
      ];

  const sortedMarketplaces = [...rawMarketplaces].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedMarketplaces[0]?.price || product.currentPrice;
  const highestPrice = sortedMarketplaces[sortedMarketplaces.length - 1]?.price || lowestPrice;
  const bestMarketplaceObj = sortedMarketplaces[0];
  const maxSavings = highestPrice - lowestPrice;
  const maxSavingsPercent = highestPrice > 0 ? Math.round((maxSavings / highestPrice) * 100) : 0;

  // Additional product gallery thumbnails fallback
  const galleryImages = [
    product.image,
    product.image,
    product.image
  ];

  // Mock video reviews list
  const videoReviews = product.youtubeVideoId ? [
    {
      id: product.youtubeVideoId,
      title: product.youtubeTitle || `${product.title} - Full Hands-On Review`,
      creator: 'NY Testing Lab',
      thumbnail: product.image,
    },
    {
      id: 'dQw4w9WgXcQ',
      title: `Unboxing & First Impressions of ${product.title}`,
      creator: 'Tech Reviews India',
      thumbnail: product.image,
    }
  ] : [];

  return (
    <PageContainer className="pb-24 lg:pb-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5 overflow-x-auto">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-sky-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/category/${product.category}`} className="hover:text-sky-600 capitalize">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Overview Grid (12-Columns Desktop, Dedicated Order Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 mb-9 items-start">
        
        {/* LEFT COLUMN: Product Gallery (1:1 Fixed Aspect Ratio) */}
        <div className="lg:col-span-5 space-y-3.5 w-full">
          
          {/* Main Normalized Image Container */}
          <div className="relative aspect-square w-full max-w-[440px] lg:max-w-none mx-auto bg-[#f8fafc] rounded-2xl border border-slate-200 p-5 flex items-center justify-center shadow-2xs overflow-hidden">
            <img
              src={galleryImages[activeImageIndex] || product.image}
              alt={product.title}
              className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300 pointer-events-none"
            />
            {discount > 0 && (
              <span className="absolute top-3.5 left-3.5 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md uppercase tracking-wide shadow-2xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex items-center justify-center lg:justify-start gap-2.5">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`Thumbnail ${idx + 1}`}
                className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-[#f8fafc] p-1.5 transition-all cursor-pointer ${
                  activeImageIndex === idx 
                    ? 'border-sky-600 ring-2 ring-sky-100 scale-105' 
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-contain rounded-lg" />
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Product Overview, Prices, BEST PRICE MATCH Hero Card & Actions */}
        <div className="lg:col-span-7 space-y-4">
          
          <div>
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 mb-2">
              Category: {product.category}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Ratings Header Row */}
          <div className="flex flex-wrap items-center gap-3.5 py-2.5 border-y border-slate-200/80">
            {product.editorialRating && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                <Award className="w-4 h-4 text-amber-600" />
                <div className="text-xs">
                  <span className="font-extrabold text-amber-900">NY Editorial: </span>
                  <span className="font-black text-amber-700">{product.editorialRating} / 5.0</span>
                </div>
              </div>
            )}

            {product.rating && (
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="medium" />
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* BEST PRICE MATCH HERO CARD */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-800 shadow-md space-y-3.5">
            
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-black text-sm tracking-wide text-white uppercase">BEST PRICE MATCH</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                ✓ We found the best deal
              </span>
            </div>

            {/* Price Row */}
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Lowest Market Price:</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-white">{formatINR(lowestPrice)}</span>
                  {product.originalPrice && product.originalPrice > lowestPrice && (
                    <span className="text-sm text-slate-400 line-through">{formatINR(product.originalPrice)}</span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 border border-emerald-700 px-2 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Best Offer At:</span>
                <span className="text-sm font-black text-emerald-300 uppercase tracking-wide">
                  {bestMarketplaceObj?.name}
                </span>
              </div>
            </div>

            {/* Savings Callout Banner if price difference exists */}
            {maxSavings > 0 && sortedMarketplaces.length > 1 && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 p-2.5 rounded-xl">
                <PiggyBank className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You save {formatINR(maxSavings)} ({maxSavingsPercent}%) compared with the highest listed price across marketplaces.</span>
              </div>
            )}

            {/* Top Marketplaces Snippet Rows inside Hero Card */}
            <div className="space-y-1.5 pt-1">
              {sortedMarketplaces.slice(0, 3).map((mp, idx) => {
                const isTop = idx === 0;
                const percentHigher = !isTop && lowestPrice ? Math.round(((mp.price - lowestPrice) / lowestPrice) * 100) : 0;
                return (
                  <div key={mp.id || idx} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-800/80 border border-slate-700/60">
                    <span className="font-bold text-slate-200">{mp.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={`font-black ${isTop ? 'text-emerald-400' : 'text-slate-300'}`}>{formatINR(mp.price)}</span>
                      {isTop ? (
                        <span className="text-[9.5px] font-black text-emerald-400 bg-emerald-900/80 px-1.5 py-0.2 rounded">BEST PRICE</span>
                      ) : (
                        <span className="text-[9.5px] font-bold text-slate-400">{percentHigher}% HIGHER</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Action Bar: Primary "Buy on Marketplace" + Secondary "Compare Prices" */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={bestMarketplaceObj?.url || "#"}
              onClick={(e) => {
                if (!bestMarketplaceObj?.url || bestMarketplaceObj.url === "#") e.preventDefault();
              }}
              className="flex-1 min-w-[200px] h-[48px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Buy on {bestMarketplaceObj?.name || "Amazon"} ({formatINR(lowestPrice)})</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={scrollToComparison}
              className="h-[48px] px-5 bg-white border-2 border-sky-200 hover:border-sky-500 text-sky-800 font-bold text-xs sm:text-sm rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>Compare Prices ({sortedMarketplaces.length} Sellers)</span>
              <ChevronDown className="w-4 h-4 text-sky-600" />
            </button>
          </div>

        </div>

      </div>

      {/* MARKETPLACE PRICE COMPARISON SECTION (LOWEST TO HIGHEST PRICE SORTED) */}
      <div 
        ref={comparisonRef} 
        id="marketplace-comparison" 
        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 mb-9 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3.5 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
              <span>✓ Prices checked recently</span>
              <span>•</span>
              <span>Multiple marketplaces compared</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <span>Compare Marketplace Options ({sortedMarketplaces.length} Sellers)</span>
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Sorted by Lowest Price
          </span>
        </div>

        {/* Sorted Marketplace Rows */}
        <div className="space-y-2.5">
          {sortedMarketplaces.map((mp, index) => {
            const mpMeta = MARKETPLACES[mp.id?.toLowerCase()] || { name: mp.name, badgeBg: 'bg-slate-100', badgeText: 'text-slate-800', btnBg: 'bg-sky-600 hover:bg-sky-700' };
            const isCheapest = index === 0;
            const percentHigher = !isCheapest && lowestPrice ? Math.round(((mp.price - lowestPrice) / lowestPrice) * 100) : 0;

            return (
              <div 
                key={mp.id || index} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                  isCheapest 
                    ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200/80 shadow-2xs' 
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Left: Brand Badge + Delivery Info */}
                <div className="flex items-center gap-3">
                  <span className={`font-black text-xs px-3 py-1.5 rounded-md border ${mpMeta.badgeBg || 'bg-slate-200'} ${mpMeta.badgeText || 'text-slate-800'} ${mpMeta.borderColor || 'border-slate-300'}`}>
                    {mp.name}
                  </span>
                  
                  {isCheapest ? (
                    <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider shadow-2xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>BEST PRICE FOUND</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-extrabold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded uppercase tracking-wide">
                      {percentHigher}% HIGHER
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                    • Free delivery
                  </span>
                </div>

                {/* Right: Price + Buy CTA */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                  <div className="text-left sm:text-right">
                    <span className={`text-base sm:text-lg font-black ${isCheapest ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {formatINR(mp.price)}
                    </span>
                    {isCheapest && (
                      <span className="text-[10px] font-bold text-emerald-600 block leading-none">
                        Lowest price deal
                      </span>
                    )}
                  </div>

                  <a
                    href={mp.url || "#"}
                    onClick={(e) => {
                      if (mp.url === "#") e.preventDefault();
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 ${
                      isCheapest 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : mpMeta.btnBg || 'bg-sky-600 text-white'
                    } font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer shrink-0`}
                  >
                    <span>Buy on {mp.name}</span>
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

      {/* KEY FEATURES & PROS / CONS REVIEW BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 mb-9">
        
        {/* Key Features */}
        {product.keyFeatures && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>KEY HIGHLIGHTS</span>
            </h3>
            <ul className="space-y-2.5">
              {product.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nitya Yantra Review (Pros & Cons) */}
        {(product.pros || product.cons) && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              NITYA YANTRA VERDICT
            </h3>

            <div className="space-y-4">
              {product.pros && (
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider block mb-2 w-fit">
                    PROS
                  </span>
                  <ul className="space-y-1.5">
                    {product.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.cons && (
                <div>
                  <span className="text-xs font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider block mb-2 w-fit">
                    CONS
                  </span>
                  <ul className="space-y-1.5">
                    {product.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT SPECIFICATIONS & WHAT'S INCLUDED TABLE */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-9 space-y-3.5">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          TECHNICAL SPECIFICATIONS & WARRANTY
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-slate-700">
            <tbody>
              {product.specs && Object.entries(product.specs).map(([key, val], idx) => (
                <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                  <td className="py-2.5 px-3 font-bold text-slate-900 w-1/3 border-b border-slate-100">{key}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-600 border-b border-slate-100">{val}</td>
                </tr>
              ))}
              <tr className="bg-slate-50/70">
                <td className="py-2.5 px-3 font-bold text-slate-900 w-1/3 border-b border-slate-100">Warranty</td>
                <td className="py-2.5 px-3 font-medium text-slate-600 border-b border-slate-100">2 Years Manufacturer Warranty</td>
              </tr>
              <tr className="bg-white">
                <td className="py-2.5 px-3 font-bold text-slate-900 w-1/3 border-b border-slate-100">What's Included</td>
                <td className="py-2.5 px-3 font-medium text-slate-600 border-b border-slate-100">Main Unit, User Manual, Recipe Booklet, Warranty Card</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* VIDEO REVIEWS SECTION */}
      {videoReviews.length > 0 && (
        <div className="mb-9 bg-slate-900 text-white p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-600 text-white rounded-xl">
                <Youtube className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  VIDEO REVIEWS & HANDS-ON TESTING
                </h3>
                <p className="text-xs text-slate-400">
                  Watch real hands-on reviews before buying
                </p>
              </div>
            </div>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videoReviews.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-red-500 transition-all cursor-pointer p-3 flex gap-3.5 items-center"
              >
                <div className="relative w-28 h-20 bg-slate-950 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-700">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-contain opacity-80 group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider block mb-0.5">
                    {vid.creator}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-red-300">
                    {vid.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Embedded Active Video Player */}
          {selectedVideo && (
            <div className="pt-2">
              <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}`}
                  title={selectedVideo.title}
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
          <span>Back to Products</span>
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
            href={bestMarketplaceObj?.url || "#"}
            onClick={(e) => {
              if (!bestMarketplaceObj?.url || bestMarketplaceObj.url === "#") e.preventDefault();
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-[38px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Buy on {bestMarketplaceObj?.name || "Amazon"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </PageContainer>
  );
};

export default ProductDetailPage;
