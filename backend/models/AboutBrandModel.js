// models/AboutBrand.js
import mongoose from "mongoose";

const aboutBrandSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  color: {
    type: String,
    default: ""
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  sectionType: {
    type: String,
    enum: ['main', 'usp', 'blend', 'flavors'],
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique sections per brand
aboutBrandSchema.index({ brand: 1, sectionType: 1 }, { unique: true });

const AboutBrandModel = mongoose.models.AboutBrand || mongoose.model('AboutBrand', aboutBrandSchema);
export default AboutBrandModel;