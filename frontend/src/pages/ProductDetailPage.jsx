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
  TrendingUp
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const comparisonRef = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
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
        { id: "flipkart", name: "Flipkart", price: Math.round(product.currentPrice * 1.04), originalPrice: product.originalPrice, inStock: true, url: "#" },
        { id: "meesho", name: "Meesho", price: Math.round(product.currentPrice * 1.06), originalPrice: product.originalPrice, inStock: true, url: "#" }
      ];

  const sortedMarketplaces = [...rawMarketplaces].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedMarketplaces[0]?.price || product.currentPrice;
  const bestMarketplaceObj = sortedMarketplaces[0];

  // Additional product gallery thumbnails fallback
  const galleryImages = [
    product.image,
    product.image,
    product.image
  ];

  return (
    <PageContainer>
      
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

        {/* RIGHT COLUMN: Product Overview, Prices, Best Deal & Actions */}
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

          {/* Best Deal Price & Savings Summary Box */}
          <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-slate-500">Current Best Price:</span>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.2 rounded uppercase">
                  Best Price Match
                </span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatINR(lowestPrice)}
                </span>
                {product.originalPrice && product.originalPrice > lowestPrice && (
                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {discount > 0 && (
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                  Save {formatINR((product.originalPrice || 0) - lowestPrice)} ({discount}% OFF)
                </span>
              </div>
            )}
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
              <span>Compare Available Prices ({sortedMarketplaces.length})</span>
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
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">
              REAL-TIME PRICE COMPARISON
            </span>
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
                {/* Left: Brand Dot/Badge + Delivery Info */}
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
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                      +{percentHigher}% higher
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                    • In Stock & Free Delivery
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

      {/* PRODUCT SPECIFICATIONS TABLE */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-9 space-y-3.5">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            TECHNICAL SPECIFICATIONS
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left text-slate-700">
              <tbody>
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 w-1/3 border-b border-slate-100">{key}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-600 border-b border-slate-100">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* YOUTUBE VIDEO REVIEW SECTION */}
      {product.youtubeVideoId && (
        <div className="mb-9 bg-slate-900 text-white p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-600 text-white rounded-xl">
                <Youtube className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  YOUTUBE VIDEO REVIEW
                </h3>
                <p className="text-xs text-slate-400">
                  {product.youtubeTitle || "Watch hands-on testing video before buying"}
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${product.youtubeVideoId}`}
              title={product.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
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

    </PageContainer>
  );
};

export default ProductDetailPage;
