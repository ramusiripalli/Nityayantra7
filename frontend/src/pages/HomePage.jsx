import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import CategoryCard from '../components/category/CategoryCard';
import CollectionCard from '../components/collection/CollectionCard';
import ProductCard from '../components/product/ProductCard';
import MarketplaceDisclosureBanner from '../components/common/MarketplaceDisclosureBanner';
import { categoryService } from '../services/categoryService';
import collectionService from '../services/collectionService';
import { productService } from '../services/productService';
import {
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredCollections, setFeaturedCollections] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        const [cats, cols, prods] = await Promise.all([
          categoryService.getCategories(),
          collectionService.getPublicCollections({ featured: true }),
          productService.getProducts({}),
        ]);

        setCategories(Array.isArray(cats) ? cats : []);
        setFeaturedCollections(Array.isArray(cols) ? cols.filter((c) => c.isFeatured) : []);
        setFeaturedProducts(Array.isArray(prods) ? prods.filter((p) => p.isFeatured) : []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageContainer className="pt-3 pb-16 space-y-10 sm:space-y-12">
      
      {/* 1. COMPACT MARKETPLACE DISCLOSURE STRIP (Takes ~45px, zero whole-page waste) */}
      <MarketplaceDisclosureBanner />

      {/* 2. EXPLORE BY CATEGORY (Immediately visible above the fold!) */}
      <section id="categories" className="space-y-4 scroll-mt-20">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight">
              Explore by category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Start with what you're looking for.
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat._id || cat.id || cat.slug} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* 3. POPULAR COLLECTIONS (Gated strictly by isFeatured: true) */}
      {!loading && featuredCollections.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600" />
                <span>Popular collections</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Looking for something specific?
              </p>
            </div>

            <Link
              to="/products"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {featuredCollections.map((col) => (
              <CollectionCard key={col._id || col.id} collection={col} />
            ))}
          </div>
        </section>
      )}

      {/* 4. FEATURED PRODUCTS (Gated strictly by isFeatured: true) */}
      {!loading && featuredProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Products worth checking out</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Handpicked products with verified marketplace listings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod._id || prod.productId} product={prod} />
            ))}
          </div>

          {/* Subtle affiliate transparency notice */}
          <div className="pt-2 text-center text-xs text-slate-500">
            <p>
              💡 The marketplace price is the price you pay. We may earn a commission from some links at no extra cost to you.
            </p>
            <p className="text-[10.5px] text-slate-400 pt-0.5">
              As an Amazon Associate I earn from qualifying purchases. Prices and availability may change on the marketplace.
            </p>
          </div>
        </section>
      )}

      {/* 5. THE BIG TRUST MESSAGE (Sleek dark centerpiece) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-7 sm:p-10 shadow-xl border border-slate-800 text-center space-y-6">
        
        {/* Subtle ambient light */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 text-sky-400 border border-slate-700 text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Why Nitya Yantra?</span>
          </span>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            We don't sell the product.<br />
            <span className="bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
              We help you decide where to buy it.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            We find useful products, organize them into easy-to-browse collections, show available marketplace information, and send you directly to the store you choose.
          </p>
        </div>

        {/* 4-Step Process Strip */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto text-left">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-sky-400">
              <span>🔎 DISCOVER</span>
              <span className="text-slate-500 font-mono text-[10px]">01</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Curated collections</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>⭐ CHECK</span>
              <span className="text-slate-500 font-mono text-[10px]">02</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Real ratings & prices</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>🛒 CHOOSE</span>
              <span className="text-slate-500 font-mono text-[10px]">03</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Your preferred store</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>↗ BUY DIRECT</span>
              <span className="text-slate-500 font-mono text-[10px]">04</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Same marketplace price</p>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (Shopping here is simple) */}
      <section className="space-y-6 sm:space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Shopping here is simple.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Four steps. No complicated checkout.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-sky-300 hover:shadow-xs transition-all space-y-1.5">
            <span className="inline-block text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md font-mono">
              01
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900">
              Discover
            </h3>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              Browse a category or collection.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all space-y-1.5">
            <span className="inline-block text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-mono">
              02
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900">
              Check
            </h3>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              Look at prices, ratings and reviews.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all space-y-1.5">
            <span className="inline-block text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">
              03
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900">
              Choose
            </h3>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              Pick the marketplace you prefer.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all space-y-1.5">
            <span className="inline-block text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
              04
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900">
              Buy Directly
            </h3>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              We send you to the marketplace.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 font-medium">
          💡 Nitya Yantra does not process payments or handle your order.
        </p>
      </section>

      {/* 7. HOW OUR LINKS WORK (Transparency) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            How our links work
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Complete transparency on how we operate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-base">
              🔗
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Click a marketplace
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              When you click Amazon, Flipkart, Meesho or Myntra, we send you directly to that marketplace.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base">
              💰
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              You pay the marketplace price
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We don't add a fee to the marketplace price shown on our website.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-base">
              ❤️
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              We may earn a commission
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Some links are affiliate links. If you purchase through one, we may receive a commission at no additional cost to you.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA (Vibrant, high-conversion banner) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-8 sm:p-10 text-white text-center space-y-4 shadow-lg">
        <div className="relative z-10 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to find something useful?
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium max-w-md mx-auto">
            Browse our categories and discover products worth checking out.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
            >
              <span>Explore Products →</span>
            </Link>
          </div>
        </div>
      </section>

    </PageContainer>
  );
};

export default HomePage;
