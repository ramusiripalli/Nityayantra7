import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Layers,
  Search,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Package,
  Globe
} from 'lucide-react';
import collectionService from '../../services/collectionService';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import LoadingState from '../components/LoadingState';
import { formatINR } from '../../utils/currency';

export const AdminCollectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Available catalog products and categories from MongoDB
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearch, setProductSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    icon: '🍟',
    category: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    isPublished: true,
    isFeatured: false,
  });

  // Ordered list of selected product objects
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Load catalog products and existing collection (if edit mode)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // 1. Fetch published active products and categories from MongoDB
        const [prods, cats] = await Promise.all([
          productService.getProducts({}),
          categoryService.getCategories(),
        ]);

        const activeProds = Array.isArray(prods) ? prods : (prods?.products || []);
        setCatalogProducts(activeProds);
        setCategories(Array.isArray(cats) ? cats : []);

        // 2. If edit mode, load existing collection data
        if (isEditMode) {
          const col = await collectionService.getCollectionById(id);
          if (col) {
            setFormData({
              name: col.name || '',
              slug: col.slug || '',
              image: col.image || '',
              icon: col.icon || '🍟',
              category: col.category?._id || col.category || '',
              description: col.description || '',
              seoTitle: col.seoTitle || '',
              seoDescription: col.seoDescription || '',
              isPublished: col.isPublished !== undefined ? col.isPublished : true,
              isFeatured: col.isFeatured !== undefined ? col.isFeatured : false,
            });

            if (col.products && Array.isArray(col.products)) {
              setSelectedProducts(col.products);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load collection form data:', err);
        setError(err.response?.data?.message || 'Failed to load initial data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode]);

  // Auto-generate URL slug when collection name changes
  const handleNameChange = (e) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug && !isEditMode ? autoSlug : (prev.slug || autoSlug),
    }));
  };

  // Toggle product selection
  const handleToggleProduct = (product) => {
    const exists = selectedProducts.some((p) => String(p._id || p.id) === String(product._id || product.id));

    if (exists) {
      // Remove
      setSelectedProducts((prev) => prev.filter((p) => String(p._id || p.id) !== String(product._id || product.id)));
    } else {
      // Add to end of list
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  // Reorder product: Move Up
  const handleMoveUp = (index) => {
    if (index <= 0) return;
    setSelectedProducts((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Reorder product: Move Down
  const handleMoveDown = (index) => {
    if (index >= selectedProducts.length - 1) return;
    setSelectedProducts((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Remove product from selection
  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => String(p._id || p.id) !== String(productId)));
  };

  // Filter available catalog products by search input
  const filteredCatalog = catalogProducts.filter((p) => {
    const q = productSearch.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = p.name && p.name.toLowerCase().includes(q);
    const idMatch = p.productId && String(p.productId) === q;
    const catMatch = p.category?.name && p.category.name.toLowerCase().includes(q);
    return nameMatch || idMatch || catMatch;
  });

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setError('Collection name is required.');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Collection URL slug is required.');
      return;
    }

    if (!formData.category) {
      setError('Parent Category is required.');
      return;
    }

    if (formData.isPublished && selectedProducts.length === 0) {
      setError('A published collection must have at least one product selected.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.toLowerCase().trim(),
        image: formData.image.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || '🍟',
        category: formData.category,
        seoTitle: formData.seoTitle.trim() || `${formData.name.trim()} in India | Nitya Yantra`,
        seoDescription: formData.seoDescription.trim() || `Discover our curated selection of ${formData.name.trim()}.`,
        products: selectedProducts.map((p) => p._id || p.id),
        isPublished: Boolean(formData.isPublished),
        isFeatured: Boolean(formData.isFeatured),
      };

      if (isEditMode) {
        await collectionService.updateCollection(id, payload);
        setSuccessMsg('Collection updated successfully!');
      } else {
        await collectionService.createCollection(payload);
        setSuccessMsg('Collection created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/collections');
      }, 1200);
    } catch (err) {
      console.error('Failed to save collection:', err);
      setError(err.response?.data?.message || 'Failed to save collection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState message={isEditMode ? 'Loading collection...' : 'Initializing form...'} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/collections"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Back to Collections"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-6 h-6 text-sky-600" />
                <span>{isEditMode ? 'Edit Collection' : 'Create New Collection'}</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Curate landing pages for YouTube descriptions, Instagram links, and direct sharing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/collections"
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Collection'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            Collection Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Collection Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Collection Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Best Air Fryers Under 5000"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            {/* URL Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2.5 text-xs text-slate-500 font-mono">
                  /
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                  placeholder="air-fryers"
                  className="w-full text-xs font-mono font-bold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Your YouTube/bio link will be: <strong className="text-sky-600 font-mono">/{formData.slug || 'air-fryers'}</strong>
              </p>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Description (Displayed at top of landing page)
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Carefully selected air fryers for everyday cooking with direct marketplace links."
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Parent Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Parent Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">-- Select Parent Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                The main category this collection belongs to (e.g. Kitchen).
              </p>
            </div>

            {/* Collection Image URL */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Collection Image URL (External URL)
              </label>
              <div className="flex gap-3 items-start">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://m.media-amazon.com/images/I/...jpg"
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                {formData.image ? (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={formData.image}
                      alt="Collection Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-xs text-slate-400 font-bold">
                    No Img
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Direct external image URL (square or near-square image recommended for Zepto-style tiles).
              </p>
            </div>

            {/* Icon / Emoji */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Collection Icon / Emoji (Fallback)
              </label>
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                  {formData.icon || '🍟'}
                </span>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🍟"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Emoji shown if image is missing (e.g. 🍟, ⚙️, ✨, 📱).
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: SELECTED PRODUCTS & ORDERING */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Selected Products ({selectedProducts.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The order below is the exact order visitors will see on the landing page. Use ↑ / ↓ to reorder.
              </p>
            </div>
          </div>

          {/* Selected Products List */}
          {selectedProducts.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No products selected yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Choose products from the product catalog section below to add them to this collection.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedProducts.map((prod, index) => (
                <div
                  key={prod._id || prod.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Position Display */}
                    <span className="w-6 text-center text-xs font-extrabold text-slate-400">
                      #{index + 1}
                    </span>

                    {/* Numeric Product ID Badge */}
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                      {prod.productId || 1}
                    </span>

                    {/* Image Thumbnail */}
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={prod.images?.[0]?.url || prod.image || 'https://via.placeholder.com/60'}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Title & Price */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {prod.lowestPrice ? `From ${formatINR(prod.lowestPrice)}` : 'Check Store'} • {prod.category?.name || 'General'}
                      </p>
                    </div>
                  </div>

                  {/* Ordering & Remove Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedProducts.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(prod._id || prod.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer ml-1"
                      title="Remove Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Catalog Product Picker */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Add Products from Catalog
              </span>
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by name, ID (#1)..."
                  className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
              {filteredCatalog.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 italic">No matching products found.</p>
              ) : (
                filteredCatalog.map((prod) => {
                  const isSelected = selectedProducts.some((p) => String(p._id || p.id) === String(prod._id || prod.id));

                  return (
                    <div
                      key={prod._id || prod.id}
                      onClick={() => handleToggleProduct(prod)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-50 border border-sky-200 text-sky-950 font-bold'
                          : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                          {prod.productId || 1}
                        </span>
                        <div className="w-8 h-8 rounded bg-slate-100 p-0.5 shrink-0 overflow-hidden">
                          <img
                            src={prod.images?.[0]?.url || prod.image || 'https://via.placeholder.com/40'}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="truncate">{prod.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {prod.lowestPrice ? formatINR(prod.lowestPrice) : ''}
                        </span>
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                            isSelected ? 'bg-sky-600 text-white' : 'border border-slate-300 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: SEO METADATA (OPTIONAL) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-slate-500" />
            <span>Search Engine (SEO) Settings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="e.g. Best Air Fryers in India | Nitya Yantra"
                className="w-full text-xs font-medium px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                SEO Meta Description
              </label>
              <input
                type="text"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="e.g. Discover selected air fryers with prices and direct marketplace buying links."
                className="w-full text-xs font-medium px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: PUBLISHED & FEATURED STATUS */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">
                Published & Publicly Accessible
              </p>
              <p className="text-[11px] text-slate-400">
                When published, this landing page will be live at{' '}
                <strong className="text-sky-600 font-mono">/{formData.slug || 'air-fryers'}</strong>
              </p>
            </div>
          </label>

          <div className="border-t border-slate-100 pt-3">
            <label className="inline-flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Featured Collection (Show in "Popular Collections" on Homepage)
                </p>
                <p className="text-[11px] text-slate-400">
                  Only explicitly featured collections will appear on the homepage popular collections grid.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/collections"
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Collection'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminCollectionForm;
