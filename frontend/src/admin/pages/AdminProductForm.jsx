import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  ShoppingBag,
  Star,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Percent
} from 'lucide-react';
import api from '../../services/api';
import LoadingState from '../components/LoadingState';

const SUPPORTED_MARKETPLACES = [
  { id: 'amazon', name: 'Amazon', dot: '🟠', badge: 'bg-amber-50 text-amber-900 border-amber-300' },
  { id: 'flipkart', name: 'Flipkart', dot: '🟡', badge: 'bg-yellow-50 text-yellow-900 border-yellow-300' },
  { id: 'meesho', name: 'Meesho', dot: '🟣', badge: 'bg-purple-50 text-purple-900 border-purple-300' },
  { id: 'myntra', name: 'Myntra', dot: '🩷', badge: 'bg-pink-50 text-pink-900 border-pink-300' },
  { id: 'other', name: 'Other', dot: '⚪', badge: 'bg-slate-50 text-slate-900 border-slate-300' },
];

export const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Clean Form State
  const [formData, setFormData] = useState({
    productId: null,
    name: '',
    slug: '',
    category: '',
    shortDescription: '',
    description: '',
    images: [{ url: '', alt: '' }],
    marketplaceOffers: [
      {
        marketplace: 'amazon',
        customMarketplace: '',
        url: '',
        price: '',
        originalPrice: '',
        discount: 0,
        isAvailable: true,
      },
    ],
    rating: 4.5,
    reviewCount: 100,
    isPublished: true,
  });

  // Fetch real categories and product data (if editing)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Fetch real active categories from MongoDB
        const catsRes = await api.get('/categories?isActive=true');
        const activeCats = catsRes.data || [];
        setCategories(activeCats);

        if (!isEditMode && activeCats.length > 0) {
          setFormData((prev) => ({ ...prev, category: activeCats[0]._id || activeCats[0].id }));
        }

        // If edit mode, load existing product
        if (isEditMode) {
          const prodRes = await api.get(`/products/${id}`);
          const prod = prodRes.data;

          if (prod) {
            setFormData({
              productId: prod.productId || null,
              name: prod.name || '',
              slug: prod.slug || '',
              category: prod.category?._id || prod.category || '',
              shortDescription: prod.shortDescription || '',
              description: prod.description || '',
              images: prod.images && prod.images.length > 0 
                ? prod.images.map((img) => ({ url: img.url || '', alt: img.alt || '' }))
                : [{ url: '', alt: '' }],
              marketplaceOffers: prod.marketplaceOffers && prod.marketplaceOffers.length > 0
                ? prod.marketplaceOffers.map((o) => {
                    const isKnown = ['amazon', 'flipkart', 'meesho', 'myntra'].includes(o.marketplace?.toLowerCase());
                    return {
                      marketplace: isKnown ? o.marketplace.toLowerCase() : 'other',
                      customMarketplace: isKnown ? '' : o.marketplace,
                      url: o.affiliateUrl || o.url || '',
                      price: o.price !== undefined ? String(o.price) : '',
                      originalPrice: o.originalPrice ? String(o.originalPrice) : '',
                      discount: o.discount || 0,
                      isAvailable: o.isAvailable !== false,
                    };
                  })
                : [
                    {
                      marketplace: 'amazon',
                      customMarketplace: '',
                      url: '',
                      price: '',
                      originalPrice: '',
                      discount: 0,
                      isAvailable: true,
                    },
                  ],
              rating: prod.rating !== undefined ? prod.rating : 4.5,
              reviewCount: prod.reviewCount !== undefined ? prod.reviewCount : 100,
              isPublished: prod.isPublished !== false,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load form data:', err);
        setError(err.response?.data?.message || 'Failed to load initial data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode]);

  // Auto-generate URL slug when Product Name changes
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
      slug: autoSlug,
    }));
  };

  // Image Management
  const handlePrimaryImageChange = (url) => {
    setFormData((prev) => {
      const nextImages = [...prev.images];
      nextImages[0] = { url: url.trim(), alt: prev.name };
      return { ...prev, images: nextImages };
    });
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: '', alt: prev.name }],
    }));
  };

  const handleAdditionalImageChange = (index, url) => {
    setFormData((prev) => {
      const nextImages = [...prev.images];
      nextImages[index] = { url: url.trim(), alt: prev.name };
      return { ...prev, images: nextImages };
    });
  };

  const handleRemoveImage = (index) => {
    if (formData.images.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Marketplace Offers Management & Real-Time Discount Calculation
  const calculateDiscount = (sellingPrice, originalPrice) => {
    const sp = Number(sellingPrice);
    const op = Number(originalPrice);
    if (!op || op <= 0 || !sp || sp <= 0 || sp >= op) return 0;
    return Math.round(((op - sp) / op) * 100);
  };

  const handleOfferChange = (index, field, value) => {
    setFormData((prev) => {
      const nextOffers = [...prev.marketplaceOffers];
      const current = { ...nextOffers[index], [field]: value };

      if (field === 'price' || field === 'originalPrice') {
        const sp = field === 'price' ? value : current.price;
        const op = field === 'originalPrice' ? value : current.originalPrice;
        current.discount = calculateDiscount(sp, op);
      }

      nextOffers[index] = current;
      return { ...prev, marketplaceOffers: nextOffers };
    });
  };

  const handleAddOffer = () => {
    setFormData((prev) => ({
      ...prev,
      marketplaceOffers: [
        ...prev.marketplaceOffers,
        {
          marketplace: 'flipkart',
          customMarketplace: '',
          url: '',
          price: '',
          originalPrice: '',
          discount: 0,
          isAvailable: true,
        },
      ],
    }));
  };

  const handleRemoveOffer = (index) => {
    if (formData.marketplaceOffers.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      marketplaceOffers: prev.marketplaceOffers.filter((_, i) => i !== index),
    }));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validation
    if (!formData.name.trim()) {
      setError('Product Name is required.');
      return;
    }
    if (!formData.category) {
      setError('Please select a Category.');
      return;
    }
    if (!formData.images[0]?.url?.trim()) {
      setError('Primary Product Image URL is required.');
      return;
    }

    // Validate Image URLs start with http:// or https://
    for (const img of formData.images) {
      if (img.url && !/^https?:\/\//i.test(img.url.trim())) {
        setError('Image URLs must begin with http:// or https://');
        return;
      }
    }

    // Validate Marketplace Offers
    if (!formData.marketplaceOffers || formData.marketplaceOffers.length === 0) {
      setError('At least one marketplace offer is required.');
      return;
    }

    for (let i = 0; i < formData.marketplaceOffers.length; i++) {
      const offer = formData.marketplaceOffers[i];
      if (!offer.url?.trim() || !/^https?:\/\//i.test(offer.url.trim())) {
        setError(`Offer #${i + 1}: Valid product URL starting with http:// or https:// is required.`);
        return;
      }
      const priceNum = Number(offer.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        setError(`Offer #${i + 1}: Selling price must be a valid number greater than 0.`);
        return;
      }
      if (offer.originalPrice) {
        const origNum = Number(offer.originalPrice);
        if (!isNaN(origNum) && origNum < priceNum) {
          setError(`Offer #${i + 1}: Original Price (MRP) cannot be less than Selling Price.`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      // Clean Payload matching MongoDB Product schema
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim() || formData.shortDescription.trim() || formData.name.trim(),
        images: formData.images
          .filter((img) => img.url?.trim())
          .map((img) => ({ url: img.url.trim(), alt: formData.name.trim() })),
        marketplaceOffers: formData.marketplaceOffers.map((o) => {
          const mName = o.marketplace === 'other' && o.customMarketplace?.trim()
            ? o.customMarketplace.trim()
            : o.marketplace;
          const sp = Number(o.price);
          const op = o.originalPrice ? Number(o.originalPrice) : undefined;
          return {
            marketplace: ['amazon', 'flipkart', 'meesho', 'myntra'].includes(o.marketplace) ? o.marketplace : 'other',
            url: o.url.trim(),
            affiliateUrl: o.url.trim(),
            price: sp,
            originalPrice: op,
            discount: calculateDiscount(sp, op),
            isAvailable: o.isAvailable !== false,
          };
        }),
        rating: Number(formData.rating || 4.5),
        reviewCount: Number(formData.reviewCount || 0),
        isPublished: Boolean(formData.isPublished),
        isActive: true,
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        const createRes = await api.post('/products', payload);
        const newProd = createRes.data;
        setSuccessMsg(`Product created successfully with Product ID: #${newProd?.productId || '1'}!`);
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
    } catch (err) {
      console.error('Failed to save product:', err);
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState message={isEditMode ? 'Loading product details...' : 'Initializing form...'} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Product' : 'Create New Product'}
              </h1>
              {formData.productId && (
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs">
                  ID: #{formData.productId}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Add product information, image URLs, prices, and direct marketplace store links.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products"
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
            <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Product'}</span>
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

        {/* SECTION A — PRODUCT INFORMATION */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            Product Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Philips Air Fryer HD9200/90, 4.1 Litre"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                required
              />
              {formData.slug && (
                <p className="text-[11px] text-slate-400 font-mono">
                  Slug: <span className="text-slate-600">{formData.slug}</span>
                </p>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors cursor-pointer"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Short Description (Optional)
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="e.g. Rapid Air Technology with touch controls"
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
            </div>

            {/* Full Product Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Product Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter detailed product description..."
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors resize-y"
              />
            </div>
          </div>
        </div>

        {/* SECTION B — PRODUCT IMAGES */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Product Images
            </h2>
            <button
              type="button"
              onClick={handleAddImage}
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image</span>
            </button>
          </div>

          {/* Primary Image with Live Preview */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Primary Product Image URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={formData.images[0]?.url || ''}
                onChange={(e) => handlePrimaryImageChange(e.target.value)}
                placeholder="https://m.media-amazon.com/images/I/..."
                className="w-full text-xs font-mono px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                required
              />
              <p className="text-[11px] text-slate-400">
                Direct external image URL (e.g. Amazon or Flipkart product image link).
              </p>
            </div>

            {/* Live Preview Box */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
              {formData.images[0]?.url ? (
                <img
                  src={formData.images[0].url}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                  }}
                />
              ) : (
                <div className="text-center p-2">
                  <ImageIcon className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 block">Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Images (if any) */}
          {formData.images.slice(1).map((img, idx) => (
            <div key={idx + 1} className="flex flex-col sm:flex-row gap-4 items-start pt-3 border-t border-slate-100">
              <div className="flex-1 w-full space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Additional Image #{idx + 2}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx + 1)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => handleAdditionalImageChange(idx + 1, e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs font-mono px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>

              {/* Preview Box */}
              <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                {img.url ? (
                  <img
                    src={img.url}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/100?text=Invalid+URL';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-300" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SECTION C — WHERE TO BUY (MARKETPLACE OFFERS) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Where to Buy (Marketplace Offers)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add store links and prices. Customers will click directly to these stores.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddOffer}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Marketplace</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.marketplaceOffers.map((offer, idx) => {
              const currentCfg = SUPPORTED_MARKETPLACES.find((m) => m.id === offer.marketplace) || SUPPORTED_MARKETPLACES[4];

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
                >
                  {/* Top Bar of Offer Card */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{currentCfg.dot}</span>
                      <select
                        value={offer.marketplace}
                        onChange={(e) => handleOfferChange(idx, 'marketplace', e.target.value)}
                        className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                      >
                        {SUPPORTED_MARKETPLACES.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      {offer.marketplace === 'other' && (
                        <input
                          type="text"
                          value={offer.customMarketplace || ''}
                          onChange={(e) => handleOfferChange(idx, 'customMarketplace', e.target.value)}
                          placeholder="Store name (e.g. Croma)"
                          className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg w-36"
                        />
                      )}
                    </div>

                    {formData.marketplaceOffers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOffer(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove Offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Product URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Product Store / Affiliate URL <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={offer.url}
                        onChange={(e) => handleOfferChange(idx, 'url', e.target.value)}
                        placeholder="https://..."
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                      {offer.url && /^https?:\/\//i.test(offer.url) && (
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-sky-600 bg-white border border-slate-200 rounded-xl shrink-0"
                          title="Open Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Price & Auto-Calculated Discount Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    {/* Selling Price */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Selling Price (₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={offer.price}
                        onChange={(e) => handleOfferChange(idx, 'price', e.target.value)}
                        placeholder="e.g. 7499"
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    {/* Original Price / MRP */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Original Price / MRP (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={offer.originalPrice}
                        onChange={(e) => handleOfferChange(idx, 'originalPrice', e.target.value)}
                        placeholder="e.g. 9999"
                        className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    {/* Auto Discount Visual Badge */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Discount (Auto-calculated)
                      </label>
                      <div className="h-[38px] flex items-center">
                        {offer.discount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-extrabold text-xs">
                            <Percent className="w-3 h-3" />
                            <span>{offer.discount}% OFF</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold italic">
                            No discount
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock Availability */}
                  <label className="inline-flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={offer.isAvailable}
                      onChange={(e) => handleOfferChange(idx, 'isAvailable', e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-700">In Stock / Available to Buy</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION D — RATINGS & REVIEWS (SIMPLE) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            Ratings & Reviews
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                User Rating (0.0 to 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Review Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.reviewCount}
                onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SECTION E — VISIBILITY */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">
                Published on Public Website
              </p>
              <p className="text-[11px] text-slate-400">
                When checked, this product will be visible in its category on the public store.
              </p>
            </div>
          </label>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/products"
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
            <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProductForm;
