const router = require("express").Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
router.post("/", auth, async (req, res) => {
  try {
    const { items, shipping, paymentMethod, subtotal, discount, shippingCharge, total } = req.body;
    if (!items?.length || !shipping?.name || !shipping?.phone || !shipping?.address) return res.status(400).json({ message: "Please complete your shipping information and cart." });
    const order = await Order.create({ user: req.userId, items, shipping, paymentMethod, subtotal, discount, shippingCharge, total });
    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (_e) { res.status(500).json({ message: "Could not place order." }); }
});
router.get("/mine", auth, async (req, res) => {
  try { res.json(await Order.find({ user: req.userId }).sort({ createdAt: -1 })); }
  catch (_e) { res.status(500).json({ message: "Could not load orders." }); }
});
module.exports = router;
