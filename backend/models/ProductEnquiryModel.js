// models/ProductEnquiry.js
import mongoose from 'mongoose';

const productEnquirySchema = new mongoose.Schema({
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


const ProductEnquiryModel = mongoose.models.directProductEnquiry || mongoose.model('directProductEnquiry', productEnquirySchema);

export default ProductEnquiryModel;