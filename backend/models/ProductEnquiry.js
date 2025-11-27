// models/ProductEnquiry.js
import mongoose from 'mongoose';

const productEnquirySchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessRegistration',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

productEnquirySchema.index({ businessId: 1, createdAt: -1 });
productEnquirySchema.index({ status: 1 });

const ProductEnquiry = mongoose.models.ProductEnquiry || mongoose.model('ProductEnquiry', productEnquirySchema);

export default ProductEnquiry;