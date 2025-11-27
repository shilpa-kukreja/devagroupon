import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  img: String,
  maincategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCategory',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default CategoryModel;