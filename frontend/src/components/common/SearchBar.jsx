import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Clock, Flame, ArrowRight, Tag } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { productService } from '../../services/productService';
import { formatINR } from '../../utils/currency';

export const SearchBar = ({ 
  placeholder = "Search gadgets, kitchen tools, electronics, deals...", 
  className = "",
  autoFocus = false,
  onSearchSubmit
}) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    handleSearchSubmit, 
    clearSearch, 
    recentSearches, 
    clearRecentSearches 
  } = useSearch();

  const [isOpen, setIsOpen] = useState(false);
  const [textSuggestions, setTextSuggestions] = useState([]);
  const [productPreviews, setProductPreviews] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Popular search chips
  const popularSearches = [
    "Air Fryer",
    "Wireless Earbuds",
    "Smart Watch",
    "Kitchen Mixer",
    "Trimmer"
  ];

  // Live debounced autocomplete query
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (searchTerm.trim()) {
        const results = await productService.autocompleteProducts(searchTerm);
        if (isMounted) {
          setTextSuggestions(results.textSuggestions || []);
          setProductPreviews(results.productPreviews || []);
        }
      } else {
        if (isMounted) {
          setTextSuggestions([]);
          setProductPreviews([]);
        }
      }
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = (e) => {
    setIsOpen(false);
    handleSearchSubmit(e);
    if (onSearchSubmit) onSearchSubmit();
  };

  const selectSuggestion = (query) => {
    setIsOpen(false);
    handleSearchSubmit(null, query);
    if (onSearchSubmit) onSearchSubmit();
  };

  const selectProduct = (productId) => {
    setIsOpen(false);
    if (onSearchSubmit) onSearchSubmit();
    navigate(`/product/${productId}`);
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-[480px] lg:max-w-[540px] ${className}`}>
      
      {/* Input Container */}
      <form onSubmit={onSubmit} className="relative w-full">
        <div className="relative flex items-center w-full h-[42px] bg-white rounded-full p-1 pl-4 pr-1 text-slate-800 shadow-md border border-white/50 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false);
            }}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Search gadgets, kitchen tools, electronics, deals"
            className="w-full px-2 py-1.5 bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors mr-1 shrink-0 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className="px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-full transition-all duration-200 shadow-xs hover:shadow-md shrink-0 h-full flex items-center justify-center cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* PROFESSIONAL AUTOCOMPLETE DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-xl z-50 overflow-hidden text-left animate-fadeIn">
          
          {/* STATE 1: EMPTY QUERY (Recent Searches + Popular Search Chips) */}
          {!searchTerm.trim() ? (
            <div className="p-3 sm:p-4 space-y-3.5">
              
              {/* Recent Searches */}
              {recentSearches && recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[10px] text-sky-600 hover:underline cursor-pointer lowercase"
                    >
                      clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSuggestion(item)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-sky-600 rounded-lg transition-colors text-left font-medium cursor-pointer"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((pop, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectSuggestion(pop)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 transition-colors cursor-pointer"
                    >
                      🔥 {pop}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* STATE 2: TYPING QUERY (Search Suggestions + Product Previews) */
            <div className="divide-y divide-slate-100">
              
              {/* Text Search Suggestions */}
              {textSuggestions.length > 0 && (
                <div className="p-2 space-y-0.5">
                  {textSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectSuggestion(sug)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:text-sky-600 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{sug}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Product Preview Items */}
              {productPreviews.length > 0 && (
                <div className="p-2 space-y-1 bg-slate-50/50">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pt-1 block">
                    Product Previews
                  </span>
                  {productPreviews.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => selectProduct(p.id)}
                      className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer group shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white p-1 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                        <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 truncate">
                          {p.title}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400 capitalize">
                          {p.category}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-slate-900 block">
                          From {formatINR(p.currentPrice)}
                        </span>
                        {p.discountPercent > 0 && (
                          <span className="text-[9.5px] font-bold text-emerald-600 block">
                            {p.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom "View All Results" Action */}
              <button
                type="button"
                onClick={onSubmit}
                className="w-full p-2.5 text-center text-xs font-extrabold text-sky-700 bg-sky-50/80 hover:bg-sky-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View all results for "{searchTerm}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default SearchBar;
