const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, trim: true, lowercase: true },
  sku: { type: String, trim: true, uppercase: true, index: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 95 },
  description: { type: String, default: "", maxlength: 10000 },
  shortDescription: { type: String, default: "", maxlength: 300 },
  images: { type: [String], default: [] },
  image: { type: String, default: "" },
  sizes: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  stock: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["Active", "Draft", "Archived"], default: "Active" },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
productSchema.pre("validate", function(next) { if (!this.image && this.images.length) this.image = this.images[0]; if (this.image && !this.images.includes(this.image)) this.images.unshift(this.image); next(); });
module.exports = mongoose.model("Product", productSchema);
