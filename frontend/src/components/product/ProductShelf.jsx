import React, { useRef, useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductShelf = ({ products = [], isVideoShelf = false }) => {
  const scrollRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftBtn(scrollLeft > 10);
    setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
    }
    window.addEventListener('resize', checkScroll);
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, products]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="relative group/shelf w-full overflow-hidden sm:overflow-visible">
      {/* Left Scroll Arrow (Desktop ≥640px) */}
      {showLeftBtn && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
          className="hidden sm:flex absolute left-[-16px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-slate-800 hover:text-sky-600 border border-slate-200 shadow-md items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Single-Row Horizontal Product Carousel (Exactly 2 Cards Visible on Mobile, 5-6 on Desktop) */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1.5 px-0.5 w-full"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[calc(50%-6px)] sm:w-[170px] lg:w-[180px] shrink-0 flex flex-col snap-start"
          >
            <ProductCard product={product} isVideoCard={isVideoShelf} />
          </div>
        ))}
      </div>

      {/* Right Scroll Arrow (Desktop & Mobile when scrolled/more products exist) */}
      {showRightBtn && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 sm:right-[-16px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-sky-600 sm:text-slate-800 sm:hover:text-sky-600 border border-slate-200 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

export default ProductShelf;
