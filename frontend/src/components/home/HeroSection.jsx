import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Star, 
  Scale, 
  ChevronRight, 
  ShieldCheck,
  Video,
  Layers,
  CheckCircle2,
  Users,
  Package,
  PlayCircle
} from 'lucide-react';

export const HeroSection = ({ featuredProduct }) => {
  // Sample product preview defaults matching exact specifications
  const productTitle = featuredProduct?.title || "Philips Digital Air Fryer HD9252/90 (4.1 Litre) with Rapid Air Technology";
  const productImage = featuredProduct?.image || "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=300&q=80";
  const productRating = featuredProduct?.rating || 4.7;
  const reviewCount = featuredProduct?.reviewCount || 4210;

  // Branded Marketplace Data Rows matching exact official brand colors
  const marketplaceRows = [
    {
      id: "amazon",
      name: "amazon",
      badgeText: "BEST PRICE",
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold",
      price: "₹7,499",
      priceColor: "text-emerald-700",
      rowBg: "bg-emerald-50/80 border-emerald-200 hover:bg-emerald-50",
      arrowBg: "bg-emerald-600 text-white",
      logoColor: "text-slate-900 font-extrabold font-sans",
      brandDot: "bg-amber-500"
    },
    {
      id: "flipkart",
      name: "Flipkart",
      badgeText: "GOOD PRICE",
      badgeBg: "bg-yellow-300 text-blue-900 border-yellow-400 font-black",
      price: "₹7,799",
      priceColor: "text-blue-800",
      rowBg: "bg-blue-50/70 border-blue-200 hover:bg-blue-50",
      arrowBg: "bg-blue-600 text-white",
      logoColor: "text-blue-700 font-black italic",
      brandDot: "bg-yellow-400"
    },
    {
      id: "meesho",
      name: "meesho",
      badgeText: "LOW STOCK",
      badgeBg: "bg-pink-100 text-pink-800 border-pink-300 font-bold",
      price: "₹8,199",
      priceColor: "text-pink-600",
      rowBg: "bg-pink-50/70 border-pink-200 hover:bg-pink-50",
      arrowBg: "bg-pink-600 text-white",
      logoColor: "text-pink-600 font-bold",
      brandDot: "bg-purple-600"
    },
    {
      id: "myntra",
      name: "Myntra",
      badgeText: "GREAT OFFER",
      badgeBg: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
      price: "₹8,499",
      priceColor: "text-amber-800",
      rowBg: "bg-amber-50/70 border-amber-200 hover:bg-amber-50",
      arrowBg: "bg-amber-600 text-white",
      logoColor: "text-red-500 font-black",
      brandDot: "bg-pink-500"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50/70 py-8 lg:py-10">
      
      {/* Background Soft Glow Radial Blurs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* 2-COLUMN DESKTOP HERO GRID (~500-580px Height) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT SIDE: Marketing Proposition + CTA + Compact Trust Strip (~55% Width) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100/80 border border-sky-200/90 text-sky-800 text-xs font-bold rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Smart Product Discovery Platform</span>
            </div>

            {/* Main Hero Heading (Refined Editorial Typography & Line-Height) */}
            <div className="max-w-[580px]">
              <h1 className="text-3xl sm:text-4xl lg:text-[54px] font-black tracking-tight leading-[1.18] sm:leading-[1.2] lg:leading-[1.22]">
                <span className="text-slate-900 block">Discover Products</span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent inline-block">
                  Worth Buying.
                </span>
              </h1>
            </div>

            {/* Colored Subheading */}
            <div className="text-lg sm:text-xl lg:text-2xl font-extrabold space-x-2 mt-4 sm:mt-5">
              <span className="text-blue-600">Compare prices.</span>
              <span className="text-purple-600">Watch reviews.</span>
              <span className="text-amber-500">Buy smarter.</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mt-3.5 sm:mt-4">
              Find useful gadgets, kitchen tools, electronics and everyday products. Watch video reviews and compare prices across Amazon, Flipkart, Myntra, Meesho and more — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-sm rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/category/deals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-amber-300 hover:bg-amber-50 text-amber-900 font-bold text-sm rounded-full shadow-2xs hover:-translate-y-0.5 transition-all duration-200"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Trending Deals</span>
              </Link>
            </div>

            {/* Compact Trust / Value Strip */}
            <div className="pt-2">
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-2xs p-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-900 leading-tight">Video Reviews</h4>
                    <p className="text-[9px] text-slate-500">YouTube creators</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-900 leading-tight">Price Comparison</h4>
                    <p className="text-[9px] text-slate-500">Top marketplaces</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-900 leading-tight">Best Price Match</h4>
                    <p className="text-[9px] text-slate-500">Best deal quickly</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-900 leading-tight">Trusted Platform</h4>
                    <p className="text-[9px] text-slate-500">Curated products</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Clean Marketplace Comparison Card (~45% Width) */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Marketplace Comparison Card Container */}
            <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-6 space-y-3.5 z-10">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-sky-600" />
                  <span>Marketplace Comparison</span>
                </span>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  BEST PRICE MATCH
                </span>
              </div>

              {/* Featured Product Preview Box */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200/80">
                <img 
                  src={productImage} 
                  alt={productTitle}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <span className="inline-block bg-purple-100 text-purple-800 font-extrabold text-[9px] px-2 py-0.2 rounded uppercase mb-0.5">
                    TOP RATED
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-tight">
                    {productTitle}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{productRating}</span>
                    <span className="text-slate-400 font-normal">({reviewCount.toLocaleString('en-IN')} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Branded Marketplace Comparison Rows */}
              <div className="space-y-2">
                {marketplaceRows.map((mp) => (
                  <div 
                    key={mp.id} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${mp.rowBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${mp.brandDot}`} />
                      <span className={`text-xs sm:text-sm ${mp.logoColor} min-w-[65px]`}>
                        {mp.name}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md border ${mp.badgeBg}`}>
                        {mp.badgeText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span className={`text-xs sm:text-sm font-black ${mp.priceColor}`}>
                        {mp.price}
                      </span>
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${mp.arrowBg} flex items-center justify-center shadow-2xs`}>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer Transparency Disclaimer */}
              <div className="pt-1.5 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium text-center border-t border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>✓ Prices updated in real-time • We may earn affiliate commission</span>
              </div>

            </div>

          </div>

        </div>

        {/* GRADIENT STATISTICS STRIP (Bottom Pill Bar) */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-5 sm:p-6 shadow-xl text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-1">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black tracking-tight">100K+</span>
              <span className="text-[11px] font-semibold text-sky-100">Happy Users</span>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black tracking-tight">500K+</span>
              <span className="text-[11px] font-semibold text-sky-100">Products Listed</span>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <PlayCircle className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black tracking-tight">10K+</span>
              <span className="text-[11px] font-semibold text-sky-100">Video Reviews</span>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black tracking-tight">100%</span>
              <span className="text-[11px] font-semibold text-sky-100">Unbiased & Honest</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
