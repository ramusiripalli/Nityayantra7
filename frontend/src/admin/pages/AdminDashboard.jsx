import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  Star,
  TrendingUp,
  Tags,
  Plus,
  ArrowRight,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';
import api from '../../services/api';
import AdminStatCard from '../components/AdminStatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { formatINR } from '../../utils/currency';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    featuredProducts: 0,
    trendingProducts: 0,
    totalCategories: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Fetch Products & Categories in parallel
      const [prodsRes, catsRes] = await Promise.all([
        api.get('/products?limit=100&published=all'),
        api.get('/categories?all=true'),
      ]);

      const products = prodsRes.data?.products || [];
      const categories = catsRes.data || [];

      setStats({
        totalProducts: prodsRes.data?.pagination?.total || products.length,
        publishedProducts: products.filter((p) => p.isPublished).length,
        featuredProducts: products.filter((p) => p.isFeatured).length,
        trendingProducts: products.filter((p) => p.isTrending).length,
        totalCategories: categories.length,
      });

      setRecentProducts(products.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Dashboard Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Manage your Nitya Yantra product catalog & marketplace insights</p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchDashboardData}
            className="px-2.5 py-1 bg-rose-600 text-white rounded text-[11px] font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Overview Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <AdminStatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="sky"
          subtext="In database"
        />
        <AdminStatCard
          title="Published"
          value={stats.publishedProducts}
          icon={CheckCircle}
          color="emerald"
          subtext="Live on website"
        />
        <AdminStatCard
          title="Featured"
          value={stats.featuredProducts}
          icon={Star}
          color="amber"
          subtext="Homepage cards"
        />
        <AdminStatCard
          title="Trending"
          value={stats.trendingProducts}
          icon={TrendingUp}
          color="purple"
          subtext="Hot deals section"
        />
        <AdminStatCard
          title="Categories"
          value={stats.totalCategories}
          icon={Tags}
          color="indigo"
          subtext="Active catalogues"
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Actions</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200/80 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>

          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200/80 transition-colors"
          >
            <Tags className="w-4 h-4" />
            <span>Manage Categories</span>
          </Link>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Recently Added Products</h3>
            <p className="text-xs text-slate-500">Latest products synced with the catalogue database</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6">
            <LoadingState message="Fetching recent catalog products..." />
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No products found in database yet. Click <Link to="/admin/products/new" className="text-sky-600 font-bold underline">Add New Product</Link> to create your first item.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold text-[10.5px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Lowest Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={prod.images?.[0]?.url || 'https://via.placeholder.com/100'}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-bold text-slate-900 truncate hover:text-sky-600">{prod.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{prod.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold">
                        {prod.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatINR(prod.lowestPrice || prod.marketplaceOffers?.[0]?.price || 0)}
                      {prod.lowestMarketplace && (
                        <span className="text-[10px] text-slate-400 font-medium ml-1.5 capitalize">
                          ({prod.lowestMarketplace})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        isPublished={prod.isPublished}
                        isFeatured={prod.isFeatured}
                        isTrending={prod.isTrending}
                      />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Link
                        to={`/admin/products/${prod._id}/edit`}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors inline-block"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
