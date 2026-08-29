import React, { useRef, useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductShelf = ({ products = [], isVideoShelf = false }) => {
  const scrollRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkViewportAndScroll = useCallback(() => {
    setIsMobile(window.innerWidth < 640);
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftBtn(scrollLeft > 10);
    setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkViewportAndScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkViewportAndScroll, { passive: true });
    }
    window.addEventListener('resize', checkViewportAndScroll);
    return () => {
      if (el) el.removeEventListener('scroll', checkViewportAndScroll);
      window.removeEventListener('resize', checkViewportAndScroll);
    };
  }, [checkViewportAndScroll, products]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  // On Mobile: EXACTLY 2 PRODUCTS for Overview category previews.
  // On Desktop: UP TO 6 PRODUCTS.
  const displayProducts = products.slice(0, isMobile ? 2 : 6);

  return (
    <div className="relative group/shelf w-full overflow-hidden sm:overflow-visible">
      {/* Left Scroll Arrow (Desktop ≥640px) */}
      {showLeftBtn && !isMobile && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
          className="hidden sm:flex absolute left-[-16px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-slate-800 hover:text-sky-600 border border-slate-200 shadow-md items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Product Display Row (Mobile: EXACTLY 2 Cards Grid/Flex | Desktop: Single Row Carousel) */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1.5 px-0.5 w-full"
      >
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="w-[calc(50%-6px)] sm:w-[170px] lg:w-[180px] shrink-0 flex flex-col snap-start"
          >
            <ProductCard product={product} isVideoCard={isVideoShelf} />
          </div>
        ))}
      </div>

      {/* Right Scroll Arrow (Desktop when scrolled/more products exist) */}
      {showRightBtn && !isMobile && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
          className="hidden sm:flex absolute right-[-16px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-slate-800 hover:text-sky-600 border border-slate-200 shadow-md items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

export default ProductShelf;
