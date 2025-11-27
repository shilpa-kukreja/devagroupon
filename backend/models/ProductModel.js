// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  shortDescription: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  thumbImg: {
    type: String,
    required: true
  },
  galleryImg: [{
    type: String
  }],
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number
  },
  ml: String,
  kg: String,
  maincategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCategory',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  sku: {
    type: String,
    unique: true
  },
  languageoflabels: String,
  NewProduct: {
    type: Boolean,
    default: false
  },
  ProductEan: String,
  Halal: Boolean,
  Vegan: Boolean,
  Frozen: Boolean,
  Kosher: Boolean,
  Allergens: String,
  Spiciness: String,
  Salt: String,
  Fat: String,
  ofwhichSugars: String,
  PackingComposition: String,
  variant: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  width: Number,
  height: Number,
  weight: Number,
  length: Number,
  metatitle: String,
  metadescription: String,
 
}, {
  timestamps: true
});

// Auto-generate slug before saving
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;