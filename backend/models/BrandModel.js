import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: String,
    required: true
  },
  description: String,
  populerbrand: {
    type: Boolean,
    default: false
  },
  maincategory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCategory'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const BrandModel = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
export default BrandModel;