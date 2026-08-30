import mongoose from 'mongoose';

// Subdocument Schema for Reusable Marketplace Offers
const marketplaceOfferSchema = new mongoose.Schema(
  {
    marketplace: {
      type: String,
      required: [true, 'Marketplace name is required'],
      lowercase: true,
      trim: true,
      enum: {
        values: ['amazon', 'flipkart', 'meesho', 'myntra', 'reliance', 'instamart', 'other'],
        message: '{VALUE} is not a supported marketplace',
      },
    },
    url: {
      type: String,
      required: [true, 'Marketplace URL is required'],
      trim: true,
    },
    affiliateUrl: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Marketplace price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      default: 0,
    },
    deliveryText: {
      type: String,
      default: 'Free delivery',
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

// Subdocument Schema for Cloudinary-Ready Product Images
const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
      default: '',
    },
    alt: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: true }
);

// Main Product Schema
const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },

    // Category Relationship (ObjectId Reference)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category reference is required'],
      index: true,
    },

    // Subcategory / Collection Relationship (ObjectId Reference)
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      index: true,
    },

    // Images List
    images: {
      type: [productImageSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A product must have at least one image',
      },
    },

    // Video Content (Optional YouTube & Instagram Links)
    videos: {
      youtubeUrl: { type: String, trim: true, default: '' },
      youtubeVideoId: { type: String, trim: true, default: '' },
      youtubeTitle: { type: String, trim: true, default: '' },
      instagramUrl: { type: String, trim: true, default: '' },
    },

    // Marketplace Price Comparison Offers
    marketplaceOffers: {
      type: [marketplaceOfferSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A product must have at least one marketplace offer',
      },
    },

    // Rating & Review Metadata
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be greater than 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    editorialRating: {
      type: Number,
      min: [0, 'Editorial rating cannot be less than 0'],
      max: [5, 'Editorial rating cannot be greater than 5'],
    },

    // Discounts & Technical Specs
    discountPercent: {
      type: Number,
      default: 0,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100%'],
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    pros: {
      type: [String],
      default: [],
    },
    cons: {
      type: [String],
      default: [],
    },

    // Status Flags
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Helper: Dynamic Lowest Price Calculation
productSchema.virtual('lowestPrice').get(function () {
  if (!this.marketplaceOffers || this.marketplaceOffers.length === 0) return 0;
  const availableOffers = this.marketplaceOffers.filter((o) => o.isAvailable !== false);
  const activeOffers = availableOffers.length > 0 ? availableOffers : this.marketplaceOffers;
  return Math.min(...activeOffers.map((o) => o.price));
});

// Virtual Helper: Marketplace Name Offering Lowest Price
productSchema.virtual('lowestMarketplace').get(function () {
  if (!this.marketplaceOffers || this.marketplaceOffers.length === 0) return '';
  const availableOffers = this.marketplaceOffers.filter((o) => o.isAvailable !== false);
  const activeOffers = availableOffers.length > 0 ? availableOffers : this.marketplaceOffers;
  const cheapest = activeOffers.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), activeOffers[0]);
  return cheapest ? cheapest.marketplace : '';
});

// Indexing Strategy for Fast Catalog Queries & Search
productSchema.index({ name: 'text', description: 'text', keyFeatures: 'text' });
productSchema.index({ category: 1, isPublished: 1 });
productSchema.index({ isPublished: 1, isFeatured: 1 });
productSchema.index({ isPublished: 1, isTrending: 1 });

// Auto-increment productId for new products if not provided
productSchema.pre('save', async function (next) {
  if (this.isNew && !this.productId) {
    try {
      const lastProduct = await mongoose.model('Product').findOne({}, { productId: 1 }).sort({ productId: -1 });
      this.productId = (lastProduct && lastProduct.productId) ? lastProduct.productId + 1 : 1;
    } catch (err) {
      this.productId = 1;
    }
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
