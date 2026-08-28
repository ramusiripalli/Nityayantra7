import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Menu, X, Flame, Sparkles, Grid } from 'lucide-react';
import Logo from './Logo';
import SearchBar from './SearchBar';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Products', path: '/products' },
    { name: 'Trending Deals', path: '/category/deals', isHot: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo size="medium" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-sky-600 font-bold'
                      : 'text-slate-600 hover:text-sky-600'
                  }`
                }
              >
                {link.isHot && <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-slate-600 hover:text-sky-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden p-3 bg-slate-50 border-b border-slate-200 animate-fadeIn">
          <SearchBar 
            autoFocus 
            onSearchSubmit={() => setMobileSearchOpen(false)} 
          />
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-sky-600 rounded-lg transition-colors"
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
