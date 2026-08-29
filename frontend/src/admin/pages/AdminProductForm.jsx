import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Youtube,
  Instagram,
  ShoppingBag,
  Star,
  ListChecks,
  Sliders,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import LoadingState from '../components/LoadingState';

const SUPPORTED_MARKETPLACES = [
  { id: 'amazon', name: 'Amazon India' },
  { id: 'flipkart', name: 'Flipkart' },
  { id: 'meesho', name: 'Meesho' },
  { id: 'myntra', name: 'Myntra' },
  { id: 'reliance', name: 'Reliance Digital' },
  { id: 'instamart', name: 'Swiggy Instamart' },
  { id: 'other', name: 'Other Store' },
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

  // Form State initialized with defaults
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: '',
    images: [{ url: '', publicId: '', alt: '' }],
    videos: {
      youtubeUrl: '',
      youtubeVideoId: '',
      youtubeTitle: '',
      instagramUrl: '',
    },
    marketplaceOffers: [
      {
        marketplace: 'amazon',
        url: '',
        affiliateUrl: '',
        price: '',
        originalPrice: '',
        discount: 0,
        deliveryText: 'Free delivery',
        isAvailable: true,
      },
    ],
    rating: 4.5,
    reviewCount: 100,
    editorialRating: 4.5,
    discountPercent: 0,
    keyFeatures: [''],
    specs: [{ key: '', value: '' }],
    pros: [''],
    cons: [''],
    isPublished: true,
    isFeatured: false,
    isTrending: false,
    isActive: true,
  });

  // Fetch Categories & Product Data on Mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // 1. Fetch Active Categories for dropdown
        const catsRes = await api.get('/categories?isActive=true');
        const activeCats = catsRes.data || [];
        setCategories(activeCats);

        // Set default category if creating
        if (!isEditMode && activeCats.length > 0) {
          setFormData((prev) => ({ ...prev, category: activeCats[0]._id }));
        }

        // 2. Fetch Product if Edit Mode
        if (isEditMode) {
          const prodRes = await api.get(`/products/${id}`);
          const prod = prodRes.data;

          if (prod) {
            // Convert Mongoose Map specs into Array of {key, value} for form editor
            let specsArray = [{ key: '', value: '' }];
            if (prod.specs && typeof prod.specs === 'object') {
              const entries = Object.entries(prod.specs);
              if (entries.length > 0) {
                specsArray = entries.map(([k, v]) => ({ key: k, value: String(v) }));
              }
            }

            setFormData({
              name: prod.name || '',
              slug: prod.slug || '',
              description: prod.description || '',
              shortDescription: prod.shortDescription || '',
              category: prod.category?._id || prod.category || '',
              images: prod.images && prod.images.length > 0 ? prod.images : [{ url: '', publicId: '', alt: '' }],
              videos: {
                youtubeUrl: prod.videos?.youtubeUrl || '',
                youtubeVideoId: prod.videos?.youtubeVideoId || '',
                youtubeTitle: prod.videos?.youtubeTitle || '',
                instagramUrl: prod.videos?.instagramUrl || '',
              },
              marketplaceOffers: prod.marketplaceOffers && prod.marketplaceOffers.length > 0
                ? prod.marketplaceOffers.map((o) => ({
                    marketplace: o.marketplace || 'amazon',
                    url: o.url || '',
                    affiliateUrl: o.affiliateUrl || '',
                    price: o.price !== undefined ? o.price : '',
                    originalPrice: o.originalPrice !== undefined ? o.originalPrice : '',
                    discount: o.discount || 0,
                    deliveryText: o.deliveryText || 'Free delivery',
                    isAvailable: o.isAvailable !== false,
                  }))
                : [{ marketplace: 'amazon', url: '', affiliateUrl: '', price: '', originalPrice: '', discount: 0, deliveryText: 'Free delivery', isAvailable: true }],
              rating: prod.rating !== undefined ? prod.rating : 4.5,
              reviewCount: prod.reviewCount !== undefined ? prod.reviewCount : 0,
              editorialRating: prod.editorialRating !== undefined ? prod.editorialRating : 4.5,
              discountPercent: prod.discountPercent || 0,
              keyFeatures: prod.keyFeatures && prod.keyFeatures.length > 0 ? prod.keyFeatures : [''],
              specs: specsArray,
              pros: prod.pros && prod.pros.length > 0 ? prod.pros : [''],
              cons: prod.cons && prod.cons.length > 0 ? prod.cons : [''],
              isPublished: prod.isPublished !== false,
              isFeatured: Boolean(prod.isFeatured),
              isTrending: Boolean(prod.isTrending),
              isActive: prod.isActive !== false,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load form data:', err);
        setError(err.message || 'Unable to load product information.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode]);

  // Auto-generate Slug from Name
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (!isEditMode) {
      setFormData((prev) => ({
        ...prev,
        name: val,
        slug: generateSlug(val),
      }));
    } else {
      setFormData((prev) => ({ ...prev, name: val }));
    }
  };

  // Helper: Extract YouTube Video ID
  const extractYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.trim().match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  const handleYouTubeUrlChange = (url) => {
    const videoId = extractYouTubeId(url);
    setFormData((prev) => ({
      ...prev,
      videos: {
        ...prev.videos,
        youtubeUrl: url,
        youtubeVideoId: videoId || prev.videos.youtubeVideoId,
      },
    }));
  };

  // Marketplace Offers Handlers & Auto-Discount Calculation
  const handleOfferChange = (index, field, value) => {
    const updatedOffers = [...formData.marketplaceOffers];
    const currentOffer = { ...updatedOffers[index], [field]: value };

    // Auto-calculate discount percentage if price and originalPrice exist
    if (field === 'price' || field === 'originalPrice') {
      const priceNum = Number(field === 'price' ? value : currentOffer.price);
      const origNum = Number(field === 'originalPrice' ? value : currentOffer.originalPrice);

      if (origNum && origNum > priceNum) {
        currentOffer.discount = Math.round(((origNum - priceNum) / origNum) * 100);
      }
    }

    updatedOffers[index] = currentOffer;

    // Calculate product level max discount
    const maxDiscount = Math.max(
      0,
      ...updatedOffers.map((o) => Number(o.discount) || 0)
    );

    setFormData((prev) => ({
      ...prev,
      marketplaceOffers: updatedOffers,
      discountPercent: maxDiscount,
    }));
  };

  const addOffer = () => {
    // Find first unused marketplace
    const usedMarketplaces = formData.marketplaceOffers.map((o) => o.marketplace);
    const unused = SUPPORTED_MARKETPLACES.find((m) => !usedMarketplaces.includes(m.id)) || SUPPORTED_MARKETPLACES[0];

    setFormData((prev) => ({
      ...prev,
      marketplaceOffers: [
        ...prev.marketplaceOffers,
        {
          marketplace: unused.id,
          url: '',
          affiliateUrl: '',
          price: '',
          originalPrice: '',
          discount: 0,
          deliveryText: 'Free delivery',
          isAvailable: true,
        },
      ],
    }));
  };

  const removeOffer = (index) => {
    if (formData.marketplaceOffers.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      marketplaceOffers: prev.marketplaceOffers.filter((_, i) => i !== index),
    }));
  };

  // Image Handlers
  const handleImageChange = (index, field, value) => {
    const updatedImgs = [...formData.images];
    updatedImgs[index] = { ...updatedImgs[index], [field]: value };
    setFormData((prev) => ({ ...prev, images: updatedImgs }));
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: '', publicId: '', alt: '' }],
    }));
  };

  const removeImage = (index) => {
    if (formData.images.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Dynamic Key Features Handlers
  const handleFeatureChange = (index, value) => {
    const updated = [...formData.keyFeatures];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, keyFeatures: updated }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, keyFeatures: [...prev.keyFeatures, ''] }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({ ...prev, keyFeatures: prev.keyFeatures.filter((_, i) => i !== index) }));
  };

  // Dynamic Specs Map Handlers
  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, specs: updated }));
  };

  const addSpec = () => {
    setFormData((prev) => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }));
  };

  const removeSpec = (index) => {
    setFormData((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  };

  // Dynamic Pros / Cons Handlers
  const handleProConChange = (type, index, value) => {
    const updated = [...formData[type]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [type]: updated }));
  };

  const addProCon = (type) => {
    setFormData((prev) => ({ ...prev, [type]: [...prev[type], ''] }));
  };

  const removeProCon = (type, index) => {
    setFormData((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Client-side Validation
    if (!formData.name.trim()) return setError('Product name is required.');
    if (!formData.slug.trim()) return setError('Product slug is required.');
    if (!formData.category) return setError('Please select a category.');
    if (!formData.description.trim()) return setError('Product description is required.');

    const validImages = formData.images.filter((img) => img.url && img.url.trim());
    if (validImages.length === 0) return setError('At least one product image with a valid URL is required.');

    const validOffers = formData.marketplaceOffers.filter((off) => off.url && off.url.trim() && off.price !== '');
    if (validOffers.length === 0) return setError('At least one marketplace offer with a valid URL and price is required.');

    // Convert Specs Array into Map Object
    const specsObject = {};
    formData.specs.forEach((s) => {
      if (s.key && s.key.trim() && s.value && s.value.trim()) {
        specsObject[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      ...formData,
      name: formData.name.trim(),
      slug: formData.slug.toLowerCase().trim(),
      description: formData.description.trim(),
      shortDescription: formData.shortDescription.trim(),
      images: validImages,
      marketplaceOffers: validOffers.map((o) => ({
        ...o,
        price: Number(o.price),
        originalPrice: o.originalPrice ? Number(o.originalPrice) : undefined,
        discount: Number(o.discount) || 0,
      })),
      keyFeatures: formData.keyFeatures.filter((f) => f && f.trim()),
      pros: formData.pros.filter((p) => p && p.trim()),
      cons: formData.cons.filter((c) => c && c.trim()),
      specs: specsObject,
      rating: Number(formData.rating) || 0,
      reviewCount: Number(formData.reviewCount) || 0,
      editorialRating: formData.editorialRating ? Number(formData.editorialRating) : undefined,
    };

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        setSuccessMsg('Product created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    } catch (err) {
      console.error('Save product error:', err);
      setError(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState message={isEditMode ? 'Loading product details...' : 'Initializing form...'} />;
  }

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto pb-16">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-colors"
            title="Return to Products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-none">
              {isEditMode ? 'Edit Product' : 'Create New Product'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isEditMode ? `Updating product details for ${formData.name}` : 'Fill in the information below to publish a product on Nitya Yantra'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
            </>
          )}
        </button>
      </div>

      {/* Alert Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================================================== */}
        {/* SECTION A — BASIC INFORMATION */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Section A — Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Philips Digital Air Fryer HD9252/90"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-medium outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">URL Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                placeholder="e.g. philips-digital-air-fryer-hd9252-90"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-mono outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-semibold outline-none capitalize"
            >
              <option value="" disabled>-- Select Active Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({cat.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the product, technologies, and features..."
              rows={4}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-medium outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Short Description / Subtitle</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="e.g. 4.1L digital air fryer with Rapid Air Technology"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-medium outline-none"
            />
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION B — PRODUCT IMAGES */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Section B — Product Images (URLs)
              </h3>
            </div>
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.images.map((img, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Image #{idx + 1}</span>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <input
                      type="url"
                      value={img.url}
                      onChange={(e) => handleImageChange(idx, 'url', e.target.value)}
                      placeholder="https://images.unsplash.com/... or CDN image URL"
                      required={idx === 0}
                      className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-sky-600 rounded-lg text-xs font-medium outline-none"
                    />
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => handleImageChange(idx, 'alt', e.target.value)}
                      placeholder="Alt text / image title"
                      className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-sky-600 rounded-lg text-xs font-medium outline-none"
                    />
                  </div>

                  {/* Image Preview Box */}
                  <div className="h-20 w-full sm:w-20 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 mx-auto">
                    {img.url ? (
                      <img src={img.url} alt={img.alt || 'Preview'} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">No Preview</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION C — VIDEO CONTENT */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Youtube className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Section C — Video Content (YouTube / Instagram)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">YouTube Video URL</label>
              <input
                type="url"
                value={formData.videos.youtubeUrl}
                onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-medium outline-none"
              />
              {formData.videos.youtubeVideoId && (
                <p className="text-[11px] text-emerald-600 font-bold">
                  ✓ Extracted Video ID: {formData.videos.youtubeVideoId}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">YouTube Video Title</label>
              <input
                type="text"
                value={formData.videos.youtubeTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    videos: { ...prev.videos, youtubeTitle: e.target.value },
                  }))
                }
                placeholder="e.g. Philips Air Fryer Full Review & Demo"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-medium outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>Instagram Reel / Video URL</span>
            </label>
            <input
              type="url"
              value={formData.videos.instagramUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  videos: { ...prev.videos, instagramUrl: e.target.value },
                }))
              }
              placeholder="https://www.instagram.com/reel/XXXXXXXXXXX"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-medium outline-none"
            />
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION D — MARKETPLACE OFFERS */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Section D — Marketplace Offers *
              </h3>
            </div>

            <button
              type="button"
              onClick={addOffer}
              className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Marketplace</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.marketplaceOffers.map((offer, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Offer #{idx + 1} — {offer.marketplace}
                  </span>
                  {formData.marketplaceOffers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOffer(idx)}
                      className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">Marketplace Store *</label>
                    <select
                      value={offer.marketplace}
                      onChange={(e) => handleOfferChange(idx, 'marketplace', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none capitalize"
                    >
                      {SUPPORTED_MARKETPLACES.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700">Product Store URL *</label>
                    <input
                      type="url"
                      value={offer.url}
                      onChange={(e) => handleOfferChange(idx, 'url', e.target.value)}
                      placeholder="https://www.amazon.in/dp/..."
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={offer.price}
                      onChange={(e) => handleOfferChange(idx, 'price', e.target.value)}
                      placeholder="7499"
                      min="0"
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">Original Price (MRP ₹)</label>
                    <input
                      type="number"
                      value={offer.originalPrice}
                      onChange={(e) => handleOfferChange(idx, 'originalPrice', e.target.value)}
                      placeholder="9999"
                      min="0"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">Discount %</label>
                    <input
                      type="number"
                      value={offer.discount}
                      onChange={(e) => handleOfferChange(idx, 'discount', Number(e.target.value))}
                      placeholder="25"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-emerald-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">Delivery Text</label>
                    <input
                      type="text"
                      value={offer.deliveryText}
                      onChange={(e) => handleOfferChange(idx, 'deliveryText', e.target.value)}
                      placeholder="Free delivery"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`avail-${idx}`}
                    checked={offer.isAvailable}
                    onChange={(e) => handleOfferChange(idx, 'isAvailable', e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor={`avail-${idx}`} className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Offer Currently Available in Stock
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION E — RATINGS */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Section E — Ratings & Review Metadata
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">User Rating (0.0 to 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Review Count</label>
              <input
                type="number"
                min="0"
                value={formData.reviewCount}
                onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Editorial Rating (0.0 to 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.editorialRating}
                onChange={(e) => setFormData({ ...formData, editorialRating: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-bold outline-none"
              />
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION F — KEY FEATURES */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Section F — Key Features
              </h3>
            </div>

            <button
              type="button"
              onClick={addFeature}
              className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Feature</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.keyFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  placeholder={`Feature #${idx + 1} e.g. Rapid Air Technology for 90% less fat`}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-medium outline-none"
                />
                {formData.keyFeatures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION G — SPECS */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Section G — Specifications (Key/Value)
              </h3>
            </div>

            <button
              type="button"
              onClick={addSpec}
              className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specification</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.specs.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  placeholder="Spec Key (e.g. Capacity)"
                  className="px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-bold outline-none"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    placeholder="Spec Value (e.g. 4.1 L)"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-medium outline-none"
                  />
                  {formData.specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION H — PROS & CONS */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Pros</span>
                </div>
                <button
                  type="button"
                  onClick={() => addProCon('pros')}
                  className="text-xs text-sky-600 hover:underline font-bold"
                >
                  + Add Pro
                </button>
              </div>

              <div className="space-y-2">
                {formData.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => handleProConChange('pros', idx, e.target.value)}
                      placeholder={`Pro #${idx + 1} e.g. Easy to clean`}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-medium outline-none"
                    />
                    {formData.pros.length > 1 && (
                      <button type="button" onClick={() => removeProCon('pros', idx)} className="text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-rose-600 font-extrabold text-xs uppercase tracking-wider">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Cons</span>
                </div>
                <button
                  type="button"
                  onClick={() => addProCon('cons')}
                  className="text-xs text-sky-600 hover:underline font-bold"
                >
                  + Add Con
                </button>
              </div>

              <div className="space-y-2">
                {formData.cons.map((con, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => handleProConChange('cons', idx, e.target.value)}
                      placeholder={`Con #${idx + 1} e.g. Slightly loud fan`}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-lg text-xs font-medium outline-none"
                    />
                    {formData.cons.length > 1 && (
                      <button type="button" onClick={() => removeProCon('cons', idx)} className="text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION I — PRODUCT STATUS FLAGS */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Section I — Product Visibility & Status Flags
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Published Status</p>
                <p className="text-[11px] text-slate-500">Controls whether product is visible to public website visitors</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Featured Placement</p>
                <p className="text-[11px] text-slate-500">Display product on homepage featured showcase rows</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Trending / Hot Deal</p>
                <p className="text-[11px] text-slate-500">Display product in trending deals and discount sections</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Active Catalogue Status</p>
                <p className="text-[11px] text-slate-500">Active state in backend catalogue database</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
