import React, { useEffect, useState } from 'react';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import CategoryGrid from '../components/category/CategoryGrid';
import ProductCard from '../components/product/ProductCard';
import HeroSection from '../components/home/HeroSection';
import { productService } from '../services/productService';
import { Youtube } from 'lucide-react';

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
      
      {/* 1. HERO SECTION */}
      <HeroSection featuredProduct={featuredProducts[0]} />

      {/* 2. SHOP BY CATEGORY */}
      <PageContainer>
        <SectionHeader
          title="Shop By Category"
          subtitle="Explore products across everyday categories."
        />
        <CategoryGrid />
      </PageContainer>

      {/* 3. FEATURED SMART PRODUCTS */}
      <PageContainer>
        <SectionHeader
          badge="TOP RATED"
          title="Featured Smart Products"
          subtitle="Hand-picked products with strong ratings and useful features."
          viewAllLink="/products"
        />
        <ProductGrid products={featuredProducts} isLoading={loading} />
      </PageContainer>

      {/* 4. PRODUCTS FROM OUR VIDEOS */}
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

      {/* 5. HOT DISCOUNTED DEALS */}
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
