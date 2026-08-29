import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

export const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Map title based on route
  const getPageTitle = (path) => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/products')) return 'Products Management';
    if (path.startsWith('/admin/categories')) return 'Categories Management';
    if (path.startsWith('/admin/settings')) return 'Settings';
    return 'Admin';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased">
      {/* Sidebar (Desktop fixed / Mobile drawer) */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={title}
          onOpenMobileNav={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
