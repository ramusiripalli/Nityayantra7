import React, { useEffect, useState } from 'react';
import {
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  AlertTriangle,
  Tag,
  CheckCircle
} from 'lucide-react';
import api from '../../services/api';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get('/categories?all=true');
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err.message || 'Unable to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setFeedbackMessage(null);

    try {
      await api.delete(`/categories/${deleteTarget._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setFeedbackMessage({ type: 'success', text: `Category '${deleteTarget.name}' deleted successfully.` });
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete category error:', err);
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to delete category.' });
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Categories Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Manage product categories for Nitya Yantra discovery sections</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setFeedbackMessage({ type: 'info', text: 'Category creation form will be integrated in upcoming form step.' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Feedback Message Alert */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold border flex items-center justify-between ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : feedbackMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-sky-50 text-sky-800 border-sky-200'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <LoadingState message="Fetching product categories..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-rose-200 p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg"
          >
            Retry Loading
          </button>
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Your category listing is empty."
          actionLabel="Add Category"
          onActionClick={() => setFeedbackMessage({ type: 'info', text: 'Category form coming soon.' })}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold text-[10.5px]">
                  <th className="py-3.5 px-4">Icon</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">URL Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold">
                        <Tag className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {cat.description || 'No description provided'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          cat.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {cat.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setFeedbackMessage({ type: 'info', text: `Category editing for '${cat.name}' will be available in the form phase.` })}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Category"
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

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Category</h3>
                <p className="text-xs text-slate-500">Safe reference protection enabled</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete category <strong className="text-slate-900">{deleteTarget.name}</strong>? Note: Categories cannot be deleted if products are currently assigned to them.
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
                onClick={handleDeleteCategory}
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

export default AdminCategories;
