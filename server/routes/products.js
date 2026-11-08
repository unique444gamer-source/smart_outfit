const router = require('express').Router();
const Product = require('../models/Product');
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    let list = await Product.find(filter).sort({ createdAt: -1 }).lean();
    const q = (req.query.q || '').toLowerCase();
    if (q) list = list.filter(p => (p.name + ' ' + p.category + ' ' + p.description).toLowerCase().includes(q));
    if (req.query.sort === 'price-low') list.sort((a,b) => a.price-b.price);
    if (req.query.sort === 'price-high') list.sort((a,b) => b.price-a.price);
    res.json(list);
  } catch (e) { res.status(500).json({ message: 'Could not load products.' }); }
});
router.get('/:id', async (req, res) => {
  try { let item = await Product.findOne({ id: req.params.id, isActive: true });
    if (!item && require('mongoose').isValidObjectId(req.params.id)) item = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!item) return res.status(404).json({ message: 'Product not found' }); res.json(item);
  } catch (e) { res.status(404).json({ message: 'Product not found' }); }
});
module.exports = router;
