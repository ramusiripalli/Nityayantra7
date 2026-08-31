import mongoose from 'mongoose';

/**
 * Reusable Marketplace Offer Schema
 * Used both as an embedded subdocument in Product and as an exportable model
 */
export const marketplaceOfferSchema = new mongoose.Schema(
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
    productUrl: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    affiliateUrl: {
      type: String,
      trim: true,
      default: '',
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
    lastCheckedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Virtual sync: Ensure productUrl and url can be used interchangeably
marketplaceOfferSchema.pre('save', function (next) {
  if (!this.url && this.productUrl) {
    this.url = this.productUrl;
  }
  if (!this.productUrl && this.url) {
    this.productUrl = this.url;
  }
  next();
});

const MarketplaceOffer =
  mongoose.models.MarketplaceOffer ||
  mongoose.model('MarketplaceOffer', marketplaceOfferSchema);

export default MarketplaceOffer;
