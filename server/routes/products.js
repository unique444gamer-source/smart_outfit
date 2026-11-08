const router = require("express").Router();
const products = require("../data/products");
router.get("/", (req, res) => {
  let list = [...products];
  const q = (req.query.q || "").toLowerCase();
  if (q) list = list.filter(p => (p.name + " " + p.category).toLowerCase().includes(q));
  if (req.query.category) list = list.filter(p => p.category === req.query.category);
  if (req.query.sort === "price-low") list.sort((a,b) => a.price-b.price);
  if (req.query.sort === "price-high") list.sort((a,b) => b.price-a.price);
  res.json(list);
});
router.get("/:id", (req, res) => {
  const item = products.find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Product not found" });
  res.json(item);
});
module.exports = router;
