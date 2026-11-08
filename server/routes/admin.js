const router = require("express").Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const User = require("../models/User");
const Order = require("../models/Order");
const products = require("../data/products");
router.use(auth, adminOnly);
router.get("/stats", async (_req,res)=>{
  try {
    const [users,orders,revenue,pending] = await Promise.all([
      User.countDocuments({role:"customer"}), Order.countDocuments(),
      Order.aggregate([{$match:{status:{$ne:"Cancelled"}}},{$group:{_id:null,total:{$sum:"$total"}}}]),
      Order.countDocuments({status:"Pending"})
    ]);
    res.json({users,orders,revenue:revenue[0]?.total||0,pending,products:products.length});
  } catch(e){res.status(500).json({message:"Could not load dashboard."});}
});
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
