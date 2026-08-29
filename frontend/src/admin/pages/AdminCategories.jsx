import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  AlertTriangle,
  Tag,
  CheckCircle,
  X,
  ChefHat,
  Utensils,
  Zap,
  Home,
  Sparkles,
  Smartphone,
  Gamepad2,
  ShoppingBag,
  Flame,
  Gift,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import api from '../../services/api';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

// Supported Icon List
const AVAILABLE_ICONS = [
  { name: 'Utensils', icon: Utensils },
  { name: 'ChefHat', icon: ChefHat },
  { name: 'Home', icon: Home },
  { name: 'Zap', icon: Zap },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Flame', icon: Flame },
  { name: 'Gift', icon: Gift },
  { name: 'Tag', icon: Tag },
];

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({ total: 0, activeCount: 0, inactiveCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Add/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'Tag',
    description: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConflictMessage, setDeleteConflictMessage] = useState('');

  // Toast / Feedback banner state
  const [toastMessage, setToastMessage] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get('/categories?all=true');
      setCategories(response.data || []);
      setCounts({
        total: response.total || (response.data || []).length,
        activeCount: response.activeCount || 0,
        inactiveCount: response.inactiveCount || 0,
      });
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

  // Slug Helper: Auto-generate URL slug from name
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    // Auto-generate slug if not manually touched or creating new
    if (!editingCategory) {
      setFormData({
        ...formData,
        name: nameVal,
        slug: generateSlug(nameVal),
      });
    } else {
      setFormData({ ...formData, name: nameVal });
    }
  };

  // Open Modal for Add or Edit
  const openModal = (category = null) => {
    setModalError('');
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        icon: category.icon || 'Tag',
        description: category.description || '',
        isActive: category.isActive !== false,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        icon: 'ChefHat',
        description: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  // Save Category (Create or Update)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      setModalError('Category name and slug are required.');
      return;
    }

    setIsSubmitting(true);
    setModalError('');

    try {
      if (editingCategory) {
        // PUT /api/categories/:id
        const res = await api.put(`/categories/${editingCategory._id}`, formData);
        setToastMessage({ type: 'success', text: `Category '${res.data.name}' updated successfully!` });
      } else {
        // POST /api/categories
        const res = await api.post('/categories', formData);
        setToastMessage({ type: 'success', text: `Category '${res.data.name}' created successfully!` });
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Save category error:', err);
      setModalError(err.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = async (cat) => {
    const newStatus = !cat.isActive;
    try {
      await api.patch(`/categories/${cat._id}/status`, { isActive: newStatus });
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: newStatus } : c))
      );
      setToastMessage({
        type: 'success',
        text: `Category '${cat.name}' ${newStatus ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (err) {
      console.error('Toggle status error:', err);
      setToastMessage({ type: 'error', text: err.message || 'Failed to update category status.' });
    }
  };

  // Handle Delete Confirmation (Handles HTTP 409 Conflict)
  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteConflictMessage('');

    try {
      await api.delete(`/categories/${deleteTarget._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setToastMessage({ type: 'success', text: `Category '${deleteTarget.name}' deleted successfully.` });
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete category error:', err);
      // Catch HTTP 409 Conflict (products assigned to category)
      setDeleteConflictMessage(
        err.message || 'This category cannot be deleted because products are using it. You can deactivate it instead.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Deactivate directly from delete modal conflict warning
  const handleDeactivateFromModal = async () => {
    if (!deleteTarget) return;
    await handleToggleStatus(deleteTarget);
    setDeleteTarget(null);
    setDeleteConflictMessage('');
  };

  // Filtered Categories
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      !searchQuery ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (selectedStatus === 'active') matchesStatus = cat.isActive !== false;
    if (selectedStatus === 'inactive') matchesStatus = cat.isActive === false;

    return matchesSearch && matchesStatus;
  });

  // Render Icon helper
  const renderCategoryIcon = (iconName) => {
    const found = AVAILABLE_ICONS.find((i) => i.name.toLowerCase() === (iconName || '').toLowerCase());
    const IconComp = found ? found.icon : Tag;
    return <IconComp className="w-4 h-4" />;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header & Main Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Categories Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Create, edit, activate, deactivate, and manage product categories</p>
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
            onClick={() => openModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Alert */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold border flex items-center justify-between shadow-2xs ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
        </div>
      )}

      {/* Statistics Badges */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-white border border-slate-200/90 rounded-lg shadow-2xs text-xs">
          <span className="text-slate-500 font-medium">Total: </span>
          <strong className="text-slate-900 font-extrabold">{counts.total || categories.length}</strong>
        </div>
        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs">
          <span className="text-emerald-700 font-medium">Active: </span>
          <strong className="text-emerald-900 font-extrabold">{counts.activeCount || categories.filter(c => c.isActive !== false).length}</strong>
        </div>
        <div className="px-3 py-1.5 bg-rose-50 border border-rose-200/80 rounded-lg text-xs">
          <span className="text-rose-700 font-medium">Inactive: </span>
          <strong className="text-rose-900 font-extrabold">{counts.inactiveCount || categories.filter(c => c.isActive === false).length}</strong>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category name or slug..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-medium outline-none transition-all"
            />
          </div>

          {/* Status Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-semibold outline-none transition-all"
            >
              <option value="all">All Categories ({categories.length})</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Category Table */}
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
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description={searchQuery || selectedStatus !== 'all' ? 'No categories matched your search criteria.' : 'No categories available in the database.'}
          actionLabel="Add Category"
          onActionClick={() => openModal()}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold text-[10.5px]">
                  <th className="py-3.5 px-4">Icon</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold">
                        {renderCategoryIcon(cat.icon)}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {cat.description || 'No description provided'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                          cat.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {cat.isActive !== false ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5 text-rose-600" />}
                        <span>{cat.isActive !== false ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{formatDate(cat.createdAt)}</td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openModal(cat)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteConflictMessage('');
                          setDeleteTarget(cat);
                        }}
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-100 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Category Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Kitchen Tools"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-medium outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                    placeholder="e.g. kitchen-tools"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Select Icon</label>
                <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formData.icon.toLowerCase() === item.name.toLowerCase();
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-xs font-bold'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/80'
                        }`}
                        title={item.name}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of products in this category..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-medium outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-800">Category Active Status</p>
                  <p className="text-[11px] text-slate-500">Only active categories appear in public website navigation</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Handles HTTP 409 Conflict) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Category</h3>
                <p className="text-xs text-slate-500">Data integrity reference check</p>
              </div>
            </div>

            {deleteConflictMessage ? (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium leading-relaxed">
                  ⚠️ {deleteConflictMessage}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    Close
                  </button>
                  {deleteTarget.isActive !== false && (
                    <button
                      onClick={handleDeactivateFromModal}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Deactivate Category Instead
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to delete category <strong className="text-slate-900">{deleteTarget.name}</strong>?
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
