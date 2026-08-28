import React, { useEffect, useState } from 'react';
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
  Tag
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
  }, [id]);

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

  // Find the lowest price among marketplaces to flag with BEST PRICE badge
  const lowestMarketplacePrice = product.marketplaces?.reduce(
    (min, mp) => (mp.price < min ? mp.price : min),
    Infinity
  );

  return (
    <PageContainer>
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 overflow-x-auto">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-sky-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/category/${product.category}`} className="hover:text-sky-600 capitalize">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* LEFT COLUMN: Image Gallery & Discount Badge */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-center shadow-xs overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-3">
            {[product.image, product.image, product.image].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`Thumbnail ${idx + 1}`}
                className={`w-20 h-20 rounded-xl border-2 overflow-hidden bg-white p-1 transition-all ${
                  activeImageIndex === idx ? 'border-sky-600 ring-2 ring-sky-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Metadata, Ratings, Best Deal Box & Marketplace Table */}
        <div className="lg:col-span-7 space-y-5">
          
          <div>
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 mb-2">
              Category: {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Ratings Header Row */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-200/80">
            {product.editorialRating && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
                <Award className="w-4 h-4 text-amber-600" />
                <div className="text-xs">
                  <span className="font-extrabold text-amber-900">NY Editorial Rating: </span>
                  <span className="font-black text-amber-700">{product.editorialRating} / 5.0</span>
                </div>
              </div>
            )}

            {product.rating && (
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="medium" />
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Best Deal Price & Savings Summary Box */}
          <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Best Deal Price:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {formatINR(product.currentPrice)}
                </span>
                {product.originalPrice && product.originalPrice > product.currentPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {discount > 0 && (
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                  Save {formatINR((product.originalPrice || 0) - product.currentPrice)} ({discount}%)
                </span>
              </div>
            )}
          </div>

          {/* Marketplace Price Comparison Table (Primary Conversion Section) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-sky-600" />
                <span>Compare Marketplace Options</span>
              </h3>
              <span className="text-[11px] font-medium text-slate-400">Direct Affiliate Links</span>
            </div>

            {/* Marketplace Rows */}
            <div className="space-y-2.5">
              {product.marketplaces?.map((mp) => {
                const mpMeta = MARKETPLACES[mp.id] || { name: mp.name, btnBg: 'bg-sky-600 hover:bg-sky-700' };
                const isBestPrice = mp.price === lowestMarketplacePrice;

                return (
                  <div 
                    key={mp.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isBestPrice 
                        ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-200' 
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-md ${mpMeta.badgeBg || 'bg-slate-200'} ${mpMeta.badgeText || 'text-slate-800'}`}>
                        {mp.name}
                      </span>
                      
                      {isBestPrice && (
                        <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                          BEST PRICE
                        </span>
                      )}

                      {mp.inStock ? (
                        <span className="text-[11px] font-semibold text-emerald-600 hidden sm:flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Out of stock</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className={`text-sm font-black ${isBestPrice ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {formatINR(mp.price)}
                      </span>
                      <a
                        href={mp.url || "#"}
                        onClick={(e) => {
                          if (mp.url === "#") e.preventDefault();
                        }}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 ${
                          isBestPrice ? 'bg-emerald-600 hover:bg-emerald-700' : mpMeta.btnBg || 'bg-sky-600'
                        } text-white font-bold text-xs rounded-lg shadow-2xs transition-all`}
                      >
                        <span>Buy on {mp.name}</span>
                        <ExternalLink className="w-3 h-3" />
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

        </div>

      </div>

      {/* KEY FEATURES & NITYA YANTRA REVIEW BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        
        {/* Key Features */}
        {product.keyFeatures && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>KEY FEATURES</span>
            </h3>
            <ul className="space-y-2.5">
              {product.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nitya Yantra Review (Pros & Cons) */}
        {(product.pros || product.cons) && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              NITYA YANTRA REVIEW
            </h3>

            <div className="space-y-4">
              {product.pros && (
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider block mb-2 w-fit">
                    PROS
                  </span>
                  <ul className="space-y-1.5">
                    {product.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
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
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
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

      {/* YOUTUBE VIDEO REVIEW SECTION */}
      {product.youtubeVideoId && (
        <div className="mb-10 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-600 text-white rounded-xl">
                <Youtube className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  YOUTUBE VIDEO REVIEW
                </h3>
                <p className="text-xs text-slate-400">
                  {product.youtubeTitle || "Watch hands-on testing video before buying"}
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
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

      {/* Back to Products */}
      <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
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
