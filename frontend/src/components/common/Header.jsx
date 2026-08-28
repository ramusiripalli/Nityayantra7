import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Menu, X, Flame, Grid } from 'lucide-react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import CategoryNavigation from './CategoryNavigation';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Trending Deals', path: '/category/deals', isHot: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      
      {/* LEVEL 1: MAIN NAVBAR (~70px Height) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px] gap-4 sm:gap-6">
          
          {/* Brand Logo & Title */}
          <div className="flex-shrink-0">
            <Logo size="medium" />
          </div>

          {/* Desktop Search Bar (Center) */}
          <div className="hidden md:block flex-1 max-w-xl mx-2 lg:mx-6">
            <SearchBar />
          </div>

          {/* Desktop Main Navigation Links (Right) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-sky-600 font-extrabold'
                      : link.isHot 
                      ? 'text-amber-700 hover:text-amber-800'
                      : 'text-slate-800 hover:text-sky-600'
                  }`
                }
              >
                {link.isHot && <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce-slow" />}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Action Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-slate-700 hover:text-sky-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Toggle search bar"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* LEVEL 2: CATEGORY NAVIGATION BAR (~50px Height) */}
      <CategoryNavigation />

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden p-3 bg-slate-50 border-t border-slate-200">
          <SearchBar 
            autoFocus 
            onSearchSubmit={() => setMobileSearchOpen(false)} 
          />
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-sky-600 rounded-lg transition-colors"
              >
                {link.isHot ? (
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                ) : (
                  <Grid className="w-4 h-4 text-slate-400" />
                )}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
