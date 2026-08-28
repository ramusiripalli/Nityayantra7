import React from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

export const SearchBar = ({ 
  placeholder = "Search gadgets, kitchen, electronics...", 
  className = "",
  autoFocus = false,
  onSearchSubmit
}) => {
  const { searchTerm, setSearchTerm, handleSearchSubmit, clearSearch } = useSearch();

  const onSubmit = (e) => {
    handleSearchSubmit(e);
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <form onSubmit={onSubmit} className={`relative w-full ${className}`}>
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search gadgets, kitchen, electronics"
          className="w-full pl-10 pr-20 py-2.5 bg-slate-100/90 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium rounded-full border border-slate-200/80 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all duration-200 shadow-inner"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-16 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-full transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
