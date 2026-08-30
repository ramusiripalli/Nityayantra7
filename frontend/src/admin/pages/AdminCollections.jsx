import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Layers, 
  ExternalLink, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Package, 
  Filter 
} from 'lucide-react';
import collectionService from '../../services/collectionService';
import { categoryService } from '../../services/categoryService';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCollectionsAndCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const [cols, cats] = await Promise.all([
        collectionService.getCollections(),
        categoryService.getCategories(),
      ]);
      setCollections(cols || []);
      setCategories(cats || []);
    } catch (err) {
      console.error('Failed to load collections:', err);
      setError(err.response?.data?.message || 'Failed to fetch collections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionsAndCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError('');
    try {
      await collectionService.deleteCollection(deleteTarget._id);
      setSuccessMsg(`Collection "${deleteTarget.name}" deleted successfully.`);
      setCollections((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete collection:', err);
      // If 409 Conflict (products assigned)
      setError(
        err.response?.data?.message ||
          'Cannot delete this collection because products are assigned to it. Move or remove the products first.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCollections = collections.filter((c) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.slug && c.slug.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'all' ||
      c.category?._id === selectedCategory ||
      c.category === selectedCategory ||
      c.category?.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-600" />
            <span>Product Collections / Subcategories</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage subcategories and collections grouped under categories (e.g. Kitchen → Air Fryers).
          </p>
        </div>

        <Link
          to="/admin/collections/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections by name or slug..."
            className="w-full pl-9 pr-4 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="all">All Parent Categories</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Collection List Table */}
      {loading ? (
        <LoadingState message="Loading product collections..." />
      ) : filteredCollections.length === 0 ? (
        <EmptyState
          title={search || selectedCategory !== 'all' ? 'No collections match filter' : 'No collections created yet'}
          description={
            search || selectedCategory !== 'all'
              ? 'Try adjusting your search query or category filter.'
              : 'Create your first collection under a category to display compact Zepto-style tiles on the website.'
          }
          actionLabel="Create Collection"
          actionLink="/admin/collections/new"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10.5px]">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Collection</th>
                  <th className="py-3.5 px-4">Parent Category</th>
                  <th className="py-3.5 px-4">Public URL</th>
                  <th className="py-3.5 px-4 text-center">Products</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCollections.map((col) => {
                  const prodCount = col.products?.length || 0;
                  const catSlug = col.category?.slug || 'kitchen';
                  const publicUrl = `/${catSlug}/${col.slug}`;

                  return (
                    <tr key={col._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Image Preview */}
                      <td className="py-3.5 px-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                          {col.image ? (
                            <img
                              src={col.image}
                              alt={col.name}
                              className="w-full h-full object-contain"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <span className="text-lg">{col.icon || '🍟'}</span>
                          )}
                        </div>
                      </td>

                      {/* Name & Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{col.icon || '🍟'}</span>
                          <span>{col.name}</span>
                        </p>
                        {col.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {col.description}
                          </p>
                        )}
                      </td>

                      {/* Parent Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[11px]">
                          {col.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Clean URL */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-sky-600">
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline font-bold"
                          title="Open public collection page"
                        >
                          <span>{publicUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>

                      {/* Product Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold text-[11px]">
                          <Package className="w-3 h-3 text-slate-500" />
                          <span>{prodCount}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {col.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-bold text-[10.5px]">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md font-bold text-[10.5px]">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/collections/${col._id}`}
                            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Collection"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(col)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Collection"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900">Delete Collection?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <strong className="text-slate-800">"{deleteTarget.name}"</strong>? This action cannot be undone.
              </p>
              {deleteTarget.products?.length > 0 && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
                  ⚠️ This collection currently has <strong>{deleteTarget.products.length} products</strong>. You must remove or reassign them before deleting.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Collection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCollections;
