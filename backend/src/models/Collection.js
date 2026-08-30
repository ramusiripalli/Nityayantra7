import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Collection slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    icon: {
      type: String,
      trim: true,
      default: '🍟',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Parent category is required'],
      index: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      default: '',
    },
    seoDescription: {
      type: String,
      trim: true,
      default: '',
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual Helper: Count of products in collection
collectionSchema.virtual('productCount').get(function () {
  return Array.isArray(this.products) ? this.products.length : 0;
});

collectionSchema.set('toJSON', { virtuals: true });
collectionSchema.set('toObject', { virtuals: true });

const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

export default Collection;
