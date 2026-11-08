const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ productId: String, name: String, image: String, price: Number, quantity: Number, size: String, color: String }],
  shipping: { name: String, email: String, phone: String, address: String, city: String },
  paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
  subtotal: Number, discount: Number, shippingCharge: Number, total: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", orderSchema);
