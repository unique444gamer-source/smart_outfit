const router = require("express").Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const slugify = value => String(value || "product").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") + "-" + Date.now().toString(36);
const cleanProduct = body => {
  const images = Array.isArray(body.images) ? body.images : String(body.images || "").split(/\r?\n/);
  const list = [...new Set(images.map(x => String(x).trim()).filter(Boolean))];
  const price = Number(body.price), oldPrice = Number(body.oldPrice || body.price || 0);
  return { name:String(body.name||"").trim(), sku:String(body.sku||"").trim(), category:String(body.category||"").trim(), price, oldPrice, discount:oldPrice > price && oldPrice ? Math.round((oldPrice-price)/oldPrice*100) : 0, sizes:Array.isArray(body.sizes)?body.sizes:String(body.sizes||"").split(",").map(x=>x.trim()).filter(Boolean), colors:Array.isArray(body.colors)?body.colors:String(body.colors||"").split(",").map(x=>x.trim()).filter(Boolean), color:String(body.color||"").trim(), image:String(body.image||list[0]||"").trim(), images:list, description:String(body.description||""), stock:Math.max(0,Number(body.stock||0)), isActive:body.isActive !== false && body.isActive !== "false" };
};
router.use(auth, adminOnly);
router.get("/stats", async (_req,res)=>{
  try {
    const [users,orders,revenue,pending] = await Promise.all([
      User.countDocuments({role:"customer"}), Order.countDocuments(),
      Order.aggregate([{$match:{status:{$ne:"Cancelled"}}},{$group:{_id:null,total:{$sum:"$total"}}}]),
      Order.countDocuments({status:"Pending"})
    ]);
    res.json({users,orders,revenue:revenue[0]?.total||0,pending,products:await Product.countDocuments()});
  } catch(e){res.status(500).json({message:"Could not load dashboard."});}
});

router.get("/products", async (_req,res)=>{ try { res.json(await Product.find().sort({createdAt:-1})); } catch(e){res.status(500).json({message:"Could not load products."});} });
router.post("/products", async (req,res)=>{ try { const data=cleanProduct(req.body); if(!data.name||!data.category||!Number.isFinite(data.price)||data.price<0||!data.image) return res.status(400).json({message:"Name, category, valid price and primary image are required."}); data.id=slugify(data.name); const product=await Product.create(data); res.status(201).json(product); } catch(e){res.status(400).json({message:e.code===11000?"SKU or product ID already exists.":"Could not create product."});} });
router.put("/products/:id", async (req,res)=>{ try { const data=cleanProduct(req.body); if(!data.name||!data.category||!Number.isFinite(data.price)||data.price<0||!data.image) return res.status(400).json({message:"Name, category, valid price and primary image are required."}); const product=await Product.findByIdAndUpdate(req.params.id,data,{new:true,runValidators:true}); if(!product)return res.status(404).json({message:"Product not found."}); res.json(product); } catch(e){res.status(400).json({message:"Could not update product."});} });
router.delete("/products/:id", async (req,res)=>{ try { const product=await Product.findByIdAndDelete(req.params.id); if(!product)return res.status(404).json({message:"Product not found."}); res.json({message:"Product deleted."}); } catch(e){res.status(400).json({message:"Could not delete product."});} });

router.get("/orders", async (_req,res)=>{
  try { res.json(await Order.find().populate("user","name email").sort({createdAt:-1})); }
  catch(e){res.status(500).json({message:"Could not load orders."});}
});
router.patch("/orders/:id", async (req,res)=>{
  const allowed=["Pending","Processing","Shipped","Delivered","Cancelled"];
  if(!allowed.includes(req.body.status)) return res.status(400).json({message:"Invalid order status."});
  try { const order=await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true}); if(!order)return res.status(404).json({message:"Order not found."}); res.json(order); }
  catch(e){res.status(400).json({message:"Could not update order."});}
});
router.get("/customers", async (_req,res)=>{
  try {res.json(await User.find({role:"customer"}).select("name email phone createdAt").sort({createdAt:-1}));}
  catch(e){res.status(500).json({message:"Could not load customers."});}
});
module.exports=router;
