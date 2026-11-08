const router = require("express").Router();
const Product = require("../models/Product");
const seed = require("../data/products");
let seeded = false;
async function ensureSeed(){ if(seeded) return; const count=await Product.countDocuments(); if(!count) await Product.insertMany(seed.map(p=>({...p,images:p.images||[p.image],stock:20,status:"Active"}))); seeded=true; }
router.get("/", async (req,res)=>{ try { await ensureSeed(); const filter={status:"Active"}; if(req.query.q) filter.$or=[{name:new RegExp(req.query.q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i")},{category:new RegExp(req.query.q,"i")}]; if(req.query.category) filter.category=req.query.category; let q=Product.find(filter); if(req.query.sort==="price-low")q=q.sort({price:1}); if(req.query.sort==="price-high")q=q.sort({price:-1}); res.json(await q.lean()); } catch(e){res.status(500).json({message:"Could not load products."});} });
router.get("/:id", async(req,res)=>{try{await ensureSeed();const key=mongooseId(req.params.id);const p=await Product.findOne({...key,status:"Active"}).lean();if(!p)return res.status(404).json({message:"Product not found"});res.json(p);}catch(e){res.status(404).json({message:"Product not found"});}});
function mongooseId(id){return /^[0-9a-fA-F]{24}$/.test(id)?{_id:id}:{id};}
module.exports=router;
