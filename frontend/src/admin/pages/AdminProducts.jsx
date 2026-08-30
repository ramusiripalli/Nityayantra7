import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { formatINR } from '../../utils/currency';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const fetchProductsAndCategories = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [prodsRes, catsRes] = await Promise.all([
        api.get('/products?published=all&limit=100'),
        api.get('/categories?all=true'),
      ]);

      setProducts(prodsRes.data?.products || []);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Unable to load products catalogue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Filtered Products Logic
  const filteredProducts = products.filter((prod) => {
    // 1. Search Query Filter
    const matchesSearch =
      !searchQuery ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.slug.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category Filter
    const matchesCategory =
      selectedCategory === 'all' ||
      prod.category?.slug === selectedCategory ||
      prod.category?._id === selectedCategory;

    // 3. Status Filter
    let matchesStatus = true;
    if (selectedStatus === 'published') matchesStatus = prod.isPublished === true;
    if (selectedStatus === 'draft') matchesStatus = prod.isPublished === false;
    if (selectedStatus === 'featured') matchesStatus = prod.isFeatured === true;
    if (selectedStatus === 'trending') matchesStatus = prod.isTrending === true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle Delete Confirmation
  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await api.delete(`/products/${deleteTarget._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteMessage({ type: 'success', text: `Product '${deleteTarget.name}' deleted successfully.` });
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete product error:', err);
      setDeleteMessage({ type: 'error', text: err.message || 'Failed to delete product.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Products Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">View, search, filter, and manage products listed on Nitya Yantra</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProductsAndCategories}
            disabled={isLoading}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Delete Feedback Message */}
      {deleteMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold border flex items-center justify-between ${
            deleteMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{deleteMessage.text}</span>
          <button onClick={() => setDeleteMessage(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or slug..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-medium outline-none transition-all"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-semibold outline-none transition-all capitalize"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-semibold outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="text-sky-600 hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      {isLoading ? (
        <LoadingState message="Fetching products from catalogue database..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-rose-200 p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button
            onClick={fetchProductsAndCategories}
            className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg"
          >
            Retry Loading
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'No products matched your active filters.'
              : 'Your product catalogue is currently empty.'
          }
          actionLabel="Add Product"
          actionLink="/admin/products/new"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold text-[10.5px]">
                  <th className="py-3.5 px-3 w-12 text-center">ID</th>
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Lowest Price</th>
                  <th className="py-3.5 px-4">Marketplace</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs shadow-xs">
                        {prod.productId || 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={prod.images?.[0]?.url || 'https://via.placeholder.com/100'}
                          alt={prod.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{prod.slug}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold">
                        {prod.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatINR(prod.lowestPrice || prod.marketplaceOffers?.[0]?.price || 0)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 capitalize">
                      {prod.lowestMarketplace || prod.marketplaceOffers?.[0]?.marketplace || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        isPublished={prod.isPublished}
                        isFeatured={prod.isFeatured}
                        isTrending={prod.isTrending}
                      />
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {prod.createdAt ? new Date(prod.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <Link
                        to={`/product/${prod.id || prod._id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors inline-block"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/products/${prod._id}/edit`}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors inline-block"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(prod)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer inline-block"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Product</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{deleteTarget.name}</strong>? It will be permanently removed from the Nitya Yantra catalogue.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
