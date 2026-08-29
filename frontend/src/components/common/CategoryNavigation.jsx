import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ChevronLeft, ChevronRight, LayoutGrid, ChevronDown, ChevronUp, Check, Home } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const CategoryNavigation = ({ activeCategory, onSelectCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const mobileContainerRef = useRef(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // Determine active category slug from props or URL pathname
  const currentCategory = activeCategory || (
    location.pathname.startsWith('/category/') 
      ? location.pathname.split('/category/')[1] 
      : location.pathname === '/products'
      ? 'all'
      : 'all'
  );

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === currentCategory) || CATEGORIES[0];

  // Category Accent Colors & Light Tint Container Map
  const categoryColorStyles = {
    all: {
      activeBg: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs",
      activeText: "text-blue-600 font-extrabold",
      inactiveBg: "bg-blue-50 text-blue-600 border border-blue-100",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-blue-600",
    },
    kitchen: {
      activeBg: "bg-emerald-600 text-white shadow-xs",
      activeText: "text-emerald-700 font-extrabold",
      inactiveBg: "bg-emerald-50 text-emerald-600 border border-emerald-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-emerald-600",
    },
    home: {
      activeBg: "bg-blue-600 text-white shadow-xs",
      activeText: "text-blue-700 font-extrabold",
      inactiveBg: "bg-blue-50 text-blue-600 border border-blue-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-blue-600",
    },
    electronics: {
      activeBg: "bg-purple-600 text-white shadow-xs",
      activeText: "text-purple-700 font-extrabold",
      inactiveBg: "bg-purple-50 text-purple-600 border border-purple-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-purple-600",
    },
    beauty: {
      activeBg: "bg-pink-600 text-white shadow-xs",
      activeText: "text-pink-700 font-extrabold",
      inactiveBg: "bg-pink-50 text-pink-600 border border-pink-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-pink-600",
    },
    fashion: {
      activeBg: "bg-teal-600 text-white shadow-xs",
      activeText: "text-teal-700 font-extrabold",
      inactiveBg: "bg-teal-50 text-teal-600 border border-teal-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-teal-600",
    },
    mobiles: {
      activeBg: "bg-blue-600 text-white shadow-xs",
      activeText: "text-blue-700 font-extrabold",
      inactiveBg: "bg-blue-50 text-blue-600 border border-blue-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-blue-600",
    },
    toys: {
      activeBg: "bg-amber-500 text-white shadow-xs",
      activeText: "text-amber-600 font-extrabold",
      inactiveBg: "bg-amber-50 text-amber-500 border border-amber-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-amber-500",
    },
    gadgets: {
      activeBg: "bg-indigo-600 text-white shadow-xs",
      activeText: "text-indigo-700 font-extrabold",
      inactiveBg: "bg-indigo-50 text-indigo-600 border border-indigo-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-indigo-600",
    },
    deals: {
      activeBg: "bg-orange-600 text-white shadow-xs",
      activeText: "text-orange-600 font-extrabold",
      inactiveBg: "bg-orange-50 text-orange-600 border border-orange-200/90",
      inactiveText: "text-orange-600 font-extrabold",
      iconColor: "text-orange-600",
    },
  };

  // Intelligent scroll position detector for desktop
  const checkScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkScrollPosition, 100);
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  // Click outside and Escape key handler to close mobile panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileContainerRef.current && !mobileContainerRef.current.contains(e.target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCategoryMenuOpen(false);
      }
    };

    if (isCategoryMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryMenuOpen]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleCategoryClick = (category) => {
    setIsCategoryMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(category.slug);
    } else {
      if (category.slug === 'all') {
        navigate('/products');
      } else {
        navigate(`/category/${category.slug}`);
      }
    }
  };

  return (
    <>
      {/* 1. DESKTOP & TABLET CATEGORY BAR (≥768px): HORIZONTAL SCROLL WITH ARROWS (UNTOUCHED) */}
      <div className="hidden md:flex relative w-full bg-white border-b border-slate-200/90 py-2.5 px-4 h-[50px] items-center shadow-2xs">
        <div className="max-w-7xl mx-auto relative w-full flex items-center overflow-hidden">
          
          {showLeftArrow && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-10" />
              <button
                type="button"
                onClick={() => handleScroll('left')}
                aria-label="Scroll categories left"
                className="absolute left-1 z-20 w-7 h-7 rounded-full bg-white text-slate-700 hover:text-sky-600 border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScrollPosition}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap w-full py-1 px-2"
          >
            {CATEGORIES.map((cat) => {
              const IconComponent = Icons[cat.icon] || Icons.Tag;
              const isActive = currentCategory === cat.slug;
              const isDeal = cat.isSpecial;
              const styles = categoryColorStyles[cat.slug] || categoryColorStyles.all;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`group flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 h-[34px] border cursor-pointer ${
                    isActive
                      ? isDeal 
                        ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-2xs'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                      : isDeal
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-2xs'
                      : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : styles.iconColor}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {showRightArrow && (
            <>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-10" />
              <button
                type="button"
                onClick={() => handleScroll('right')}
                aria-label="Scroll categories right"
                className="absolute right-1 z-20 w-7 h-7 rounded-full bg-white text-slate-700 hover:text-sky-600 border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

        </div>
      </div>

      {/* 2. MOBILE COMPACT CATEGORY CONTROL & COLLAPSIBLE 5x2 PANEL (<768px) */}
      <div ref={mobileContainerRef} className="md:hidden w-full bg-white border-b border-slate-200/90 px-3 py-1.5 shadow-2xs relative z-20">
        
        {/* COMPACT CATEGORY CONTROL BAR */}
        <div className="h-[36px] flex items-center justify-between gap-2">
          
          {/* Categories Toggle Control Button */}
          <button
            type="button"
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            aria-expanded={isCategoryMenuOpen}
            aria-label="Toggle category menu"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 border border-slate-200/80 cursor-pointer active:scale-95 transition-all"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-sky-600" />
            <span>Categories</span>
          </button>

          {/* Active Category Selector Button */}
          <button
            type="button"
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200/90 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all"
          >
            <span>{activeCategoryObj.name}</span>
            {isCategoryMenuOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-sky-600 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-sky-600 stroke-[2.5]" />
            )}
          </button>

        </div>

        {/* COLLAPSIBLE 5 × 2 CATEGORY PANEL */}
        {isCategoryMenuOpen && (
          <div className="mt-2.5 pt-2 pb-3 border-t border-slate-100 animate-fadeIn">
            <div className="grid grid-cols-5 gap-y-3 gap-x-1 sm:gap-x-2 text-center">
              {CATEGORIES.map((cat) => {
                const IconComponent = Icons[cat.icon] || Icons.Tag;
                const isActive = currentCategory === cat.slug;
                const styles = categoryColorStyles[cat.slug] || categoryColorStyles.all;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex flex-col items-center justify-center group cursor-pointer w-full focus:outline-none"
                    aria-label={`Select category ${cat.name}`}
                  >
                    {/* Rounded Icon Box */}
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center mb-1 transition-all duration-200 ${
                        isActive ? styles.activeBg : styles.inactiveBg
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : styles.iconColor}`} />
                    </div>

                    {/* Category Label */}
                    <span
                      className={`text-[10px] sm:text-[11px] leading-tight text-center truncate w-full ${
                        isActive ? styles.activeText : styles.inactiveText
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default CategoryNavigation;
