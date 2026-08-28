import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export const Logo = ({ size = 'medium', showTagline = true, variant = 'dark', className = '' }) => {
  const logoSizes = {
    small: 'h-[38px] w-[38px]',
    medium: 'h-[46px] w-[46px]',
    large: 'h-14 w-14',
  };

  const titleSizes = {
    small: 'text-[16px] sm:text-[17px] font-black',
    medium: 'text-[19px] sm:text-[21px] font-black',
    large: 'text-2xl font-black',
  };

  const isLight = variant === 'light';

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group transition-opacity hover:opacity-95 ${className}`}>
      {/* Official Logo Container (46px Height on Medium) */}
      <div className={`relative rounded-xl overflow-hidden shadow-2xs border border-white/20 bg-slate-900 shrink-0 ${logoSizes[size] || logoSizes.medium}`}>
        <img 
          src={logoImg} 
          alt="Nitya Yantra Logo" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden absolute inset-0 bg-sky-600 text-white font-black items-center justify-center text-xs">
          NY
        </div>
      </div>

      {/* Brand Title & Tagline */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`tracking-tight ${isLight ? 'text-white' : 'text-slate-900 group-hover:text-sky-600'} transition-colors ${titleSizes[size] || titleSizes.medium}`}>
          NITYA YANTRA
        </span>
        {showTagline && (
          <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wide mt-1 ${isLight ? 'text-sky-100 opacity-95' : 'text-slate-500'}`}>
            Smart Gadgets for Everyday Life
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
