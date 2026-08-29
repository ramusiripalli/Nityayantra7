import React from 'react';
import { Menu, Bell, LogOut, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export const AdminHeader = ({ title = 'Dashboard', onOpenMobileNav }) => {
  const navigate = useNavigate();
  const adminUser = authService.getAdminUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left Title & Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none truncate">{title}</h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Public Store Link */}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 bg-slate-100 hover:bg-sky-50 rounded-lg border border-slate-200/80 transition-all"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notifications Icon */}
        <button
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full" />
        </button>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Badge & Logout */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="hidden sm:block text-xs font-bold text-slate-800 max-w-[120px] truncate">
            {adminUser?.name || 'Admin'}
          </span>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
