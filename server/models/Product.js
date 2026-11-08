const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true, index: true },
  name: { type: String, required: true, trim: true },
  sku: { type: String, trim: true, default: '' },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  rating: { type: Number, default: 0 }, reviews: { type: Number, default: 0 },
  sizes: [{ type: String, trim: true }], colors: [{ type: String, trim: true }],
  color: { type: String, default: '' },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
