import React from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

export const SearchBar = ({ 
  placeholder = "Search gadgets, kitchen tools, electronics, deals...", 
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
    <form onSubmit={onSubmit} className={`relative w-full max-w-[480px] lg:max-w-[520px] ${className}`}>
      <div className="relative flex items-center w-full h-[42px] bg-white rounded-full p-1 pl-4 pr-1 text-slate-800 shadow-md border border-white/40">
        <Search className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search gadgets, kitchen tools, electronics, deals"
          className="w-full px-2 py-1.5 bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors mr-1 shrink-0"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-full transition-all duration-200 shadow-xs hover:shadow-md shrink-0 h-full flex items-center justify-center"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
