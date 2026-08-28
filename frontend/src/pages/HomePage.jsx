import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import CategoryGrid from '../components/category/CategoryGrid';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { 
  Sparkles, 
  Youtube, 
  Zap, 
  ArrowRight, 
  Search, 
  Layers, 
  PlayCircle, 
  ShoppingBag,
  Star,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { MARKETPLACES } from '../utils/constants';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [videoProducts, setVideoProducts] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const allProducts = await productService.getProducts();

        // 1. Featured (Top rated)
        const featured = allProducts.filter((p) => p.isFeatured).slice(0, 4);

        // 2. Video Products
        const videos = allProducts.filter((p) => p.youtubeVideoId).slice(0, 4);

        // 3. Hot Deals sorted by discount percentage descending
        const deals = [...allProducts]
          .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
          .slice(0, 4);

        setFeaturedProducts(featured);
        setVideoProducts(videos);
        setHotDeals(deals);
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 pb-6">
      
      {/* 3. HERO SECTION */}
      <section className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-8 pb-10 border-b border-slate-200/60">
        <PageContainer className="py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Messaging & CTAs */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100/80 text-sky-800 text-xs font-bold rounded-full border border-sky-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Smart Product Discovery Platform</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Discover Smart Products.
                </h1>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-amber-500 bg-clip-text text-transparent tracking-tight">
                  Compare the Best Marketplace Deals.
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Find useful gadgets, kitchen tools, electronics and everyday products. Watch our video reviews and compare prices across popular marketplaces.
              </p>

              {/* Discovery Flow Visual Indicator: DISCOVER → COMPARE → WATCH → BUY */}
              <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-extrabold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs max-w-lg overflow-x-auto no-scrollbar">
                <span className="flex items-center gap-1 text-sky-700 bg-sky-50 px-2 py-1 rounded">
                  <Search className="w-3.5 h-3.5" /> DISCOVER
                </span>
                <span className="text-slate-300">→</span>
                <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  <Layers className="w-3.5 h-3.5" /> COMPARE
                </span>
                <span className="text-slate-300">→</span>
                <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded">
                  <PlayCircle className="w-3.5 h-3.5" /> WATCH
                </span>
                <span className="text-slate-300">→</span>
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <ShoppingBag className="w-3.5 h-3.5" /> BUY
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/category/deals"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm rounded-xl transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Trending Deals</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Product Discovery & Comparison Visual Concept Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Product Comparison Preview
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Best Price Match
                  </span>
                </div>

                {/* Sample Discovery Product Preview */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <img 
                    src={featuredProducts[0]?.image || "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=200&q=80"} 
                    alt="Air Fryer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {featuredProducts[0]?.title || "Philips Digital Air Fryer HD9252"}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{featuredProducts[0]?.rating || 4.7} Rating</span>
                      <span className="text-slate-400">({featuredProducts[0]?.reviewCount || 4210})</span>
                    </div>
                    <p className="text-xs font-black text-slate-900 mt-0.5">
                      Best Deal: <span className="text-emerald-600">₹7,499</span>
                    </p>
                  </div>
                </div>

                {/* Marketplace Comparison Pills */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 block">Compare Buying Options:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px]">
                      <span className="font-bold text-amber-900">Amazon</span>
                      <span className="font-black text-amber-800">₹7,499</span>
                    </div>
                    <div className="flex items-center justify-between px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px]">
                      <span className="font-bold text-blue-900">Flipkart</span>
                      <span className="font-black text-blue-800">₹7,799</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </PageContainer>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <PageContainer>
        <SectionHeader
          title="Shop By Category"
          subtitle="Explore products across everyday categories."
        />
        <CategoryGrid />
      </PageContainer>

      {/* 5. FEATURED SMART PRODUCTS */}
      <PageContainer>
        <SectionHeader
          badge="TOP RATED"
          title="Featured Smart Products"
          subtitle="Hand-picked products with strong ratings and useful features."
          viewAllLink="/products"
        />
        <ProductGrid products={featuredProducts} isLoading={loading} />
      </PageContainer>

      {/* 6. PRODUCTS FROM OUR VIDEOS */}
      <section className="bg-slate-900 text-white py-10 rounded-3xl max-w-7xl mx-4 sm:mx-auto px-4 sm:px-6 lg:px-8 border border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/80 rounded-full">
              <Youtube className="w-3.5 h-3.5 fill-red-400 text-red-400" />
              <span>YOUTUBE SHOWCASE</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Products From Our Videos
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Watch our product videos, then compare the best places to buy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoProducts.map((product) => (
            <ProductCard key={product.id} product={product} isVideoCard={true} />
          ))}
        </div>
      </section>

      {/* 7. HOT DISCOUNTED DEALS */}
      <PageContainer>
        <SectionHeader
          badge="LIMITED TIME"
          title="Hot Discounted Deals"
          subtitle="Discover products with attractive discounts across popular marketplaces."
          viewAllLink="/category/deals"
        />
        <ProductGrid products={hotDeals} isLoading={loading} />
      </PageContainer>

      {/* 8. WHY NITYA YANTRA */}
      <PageContainer>
        <SectionHeader
          title="Why Nitya Yantra?"
          subtitle="Simple, honest product discovery built for smart everyday decision making."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Compare Marketplace Prices</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare available buying options across Amazon, Flipkart, Myntra & Meesho in one place.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Product Reviews</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Easy-to-understand product information, specifications, pros & cons, and ratings.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Youtube className="w-5 h-5 fill-red-600" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Video Reviews</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Watch product videos and real-world testing before making your purchase decision.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Discover Useful Products</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find interesting gadgets, kitchen appliances, and everyday tools curated for Indian homes.
            </p>
          </div>

        </div>
      </PageContainer>

      {/* 9. AFFILIATE DISCLOSURE */}
      <PageContainer>
        <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed max-w-4xl mx-auto text-center">
          <strong className="text-slate-700 block mb-1">Affiliate Disclosure:</strong>
          Some links on Nitya Yantra are affiliate links. If you purchase through these links, we may earn a commission at no additional cost to you.
        </div>
      </PageContainer>

    </div>
  );
};

export default HomePage;
