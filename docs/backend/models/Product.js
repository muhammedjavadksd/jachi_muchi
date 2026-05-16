const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: String,
  price: { type: Number, required: true },
  mrp: Number,
  description: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  images: [String],
  colors: [{
    name: String,
    hex: String,
    image: String,
  }],
  brand: {
    name: String,
    logo: String,
  },
  category: {
    name: String,
    slug: String,
  },
  frameType: String,
  shape: String,
  inStock: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  variants: [{
    color: String,
    size: String,
    stock: Number,
  }],
}, { timestamps: true });

productSchema.index({ 'category.slug': 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
