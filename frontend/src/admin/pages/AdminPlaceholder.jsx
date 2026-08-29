import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

export const AdminPlaceholder = () => {
  const location = useLocation();

  const getPageInfo = (path) => {
    if (path.endsWith('/new')) {
      return { title: 'Add New Product Form', desc: 'The rich product creation form with image upload and marketplace offer inputs will be built in the upcoming phase.' };
    }
    if (path.includes('/edit')) {
      return { title: 'Edit Product Form', desc: 'Product update form with Cloudinary image management will be built in the upcoming phase.' };
    }
    if (path.includes('/settings')) {
      return { title: 'Admin Settings', desc: 'System configuration and credentials management settings page.' };
    }
    return { title: 'Admin Module', desc: 'This feature module is under active construction.' };
  };

  const info = getPageInfo(location.pathname);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-4 shadow-2xs max-w-xl mx-auto my-8">
      <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200/80 mx-auto flex items-center justify-center">
        <Construction className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-black text-slate-900">{info.title}</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">{info.desc}</p>
      </div>

      <div className="pt-2">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Products</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
