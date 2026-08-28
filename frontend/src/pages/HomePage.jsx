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
  Star,
  CheckCircle2
} from 'lucide-react';

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
    <div className="space-y-10 pb-6">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50/80 pt-6 pb-8 border-b border-slate-200/60">
        <PageContainer className="py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Messaging & Actions */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100/90 text-sky-800 text-xs font-bold rounded-full border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Smart Product Discovery Platform</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Discover Products Worth Buying.
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-amber-500 bg-clip-text text-transparent tracking-tight">
                  Compare prices. Watch reviews. Buy smarter.
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Find useful gadgets, kitchen tools, electronics and everyday products. Watch video reviews and compare prices across Amazon, Flipkart, Myntra, and Meesho.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/category/deals"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm rounded-xl transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Trending Deals</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Featured Product & Price Match Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white p-4.5 rounded-2xl border border-slate-200 shadow-card space-y-3.5">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Marketplace Comparison Preview
                  </span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                    Best Price Match
                  </span>
                </div>

                {/* Sample Discovery Product Preview */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <img 
                    src={featuredProducts[0]?.image || "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=200&q=80"} 
                    alt="Product preview"
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {featuredProducts[0]?.title || "Philips Digital Air Fryer HD9252"}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{featuredProducts[0]?.rating || 4.7} Rating</span>
                    </div>
                  </div>
                </div>

                {/* Marketplace Price Comparison Preview Table */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 bg-emerald-50/80 border border-emerald-300 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-900 text-[11px]">Amazon</span>
                      <span className="bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded uppercase">BEST PRICE</span>
                    </div>
                    <span className="font-black text-emerald-700 text-xs">₹7,499</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px]">
                    <span className="font-bold text-slate-700">Flipkart</span>
                    <span className="font-extrabold text-slate-900">₹7,799</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </PageContainer>
      </section>

      {/* 1. SHOP BY CATEGORY */}
      <PageContainer>
        <SectionHeader
          title="Shop By Category"
          subtitle="Explore products across everyday categories."
        />
        <CategoryGrid />
      </PageContainer>

      {/* 2. FEATURED SMART PRODUCTS */}
      <PageContainer>
        <SectionHeader
          badge="TOP RATED"
          title="Featured Smart Products"
          subtitle="Hand-picked products with strong ratings and useful features."
          viewAllLink="/products"
        />
        <ProductGrid products={featuredProducts} isLoading={loading} />
      </PageContainer>

      {/* 3. PRODUCTS FROM OUR VIDEOS */}
      <section className="bg-slate-900 text-white py-8 rounded-3xl max-w-7xl mx-4 sm:mx-auto px-4 sm:px-6 lg:px-8 border border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/80 rounded-full">
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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {videoProducts.map((product) => (
            <ProductCard key={product.id} product={product} isVideoCard={true} />
          ))}
        </div>
      </section>

      {/* 4. HOT DISCOUNTED DEALS */}
      <PageContainer>
        <SectionHeader
          badge="LIMITED TIME"
          title="Hot Discounted Deals"
          subtitle="Discover products with attractive discounts across popular marketplaces."
          viewAllLink="/category/deals"
        />
        <ProductGrid products={hotDeals} isLoading={loading} />
      </PageContainer>

    </div>
  );
};

export default HomePage;
