const router=require('express').Router();
const auth=require('../middleware/auth');
const Order=require('../models/Order');
const Product=require('../models/Product');
const {Coupon,StoreConfig}=require('../models/StoreData');
router.post('/',auth,async(req,res)=>{
  try{
    const {items,shipping,paymentMethod='cod',couponCode}=req.body;
    if(!Array.isArray(items)||!items.length||!shipping?.name||!shipping?.phone||!shipping?.address)return res.status(400).json({message:'Please complete your shipping information and cart.'});
    if(paymentMethod!=='cod')return res.status(400).json({message:'Online payment is not live yet. Please choose Cash on Delivery.'});
    let cleanItems=[],subtotal=0,stockChanges=[];
    for(const item of items){const qty=Math.max(1,Math.floor(Number(item.quantity)||1));const p=await Product.findOne({id:String(item.productId)});if(!p||p.status!=='Active')return res.status(400).json({message:`${item.name||'A product'} is no longer available.`});if(p.stock<qty)return res.status(400).json({message:`Insufficient stock for ${p.name}. Available: ${p.stock}`});cleanItems.push({productId:p.id,name:p.name,image:p.image,price:p.price,quantity:qty,size:String(item.size||''),color:String(item.color||'')});subtotal+=p.price*qty;stockChanges.push({product:p,qty});}
    let couponDiscount=0,coupon=null;
    if(couponCode){coupon=await Coupon.findOne({code:String(couponCode).toUpperCase(),active:true});if(!coupon||(coupon.expiresAt&&coupon.expiresAt<new Date())||(coupon.usageLimit>0&&coupon.usedCount>=coupon.usageLimit))return res.status(400).json({message:'Coupon is invalid or expired.'});if(subtotal<coupon.minOrder)return res.status(400).json({message:`Minimum order is ৳${coupon.minOrder}`});couponDiscount=coupon.type==='percent'?Math.min(subtotal*coupon.value/100,coupon.maxDiscount||subtotal):Math.min(subtotal,coupon.value);}
    const cfg=await StoreConfig.findOne({key:'store'});const delivery=cfg?.delivery||{};const city=String(shipping.city||'').toLowerCase();const inside=/dhaka/.test(city);const threshold=Number(delivery.freeShippingOver??999);const shippingCharge=subtotal>=threshold?0:Number(inside?delivery.insideDhaka??60:delivery.outsideDhaka??120);
    const total=Math.max(0,subtotal-couponDiscount+shippingCharge);
    const order=await Order.create({user:req.userId,items:cleanItems,shipping,paymentMethod,subtotal,discount:couponDiscount,shippingCharge,total,status:'Pending'});
    for(const x of stockChanges){x.product.stock-=x.qty;await x.product.save();}
    if(coupon){coupon.usedCount+=1;await coupon.save();}
    res.status(201).json({message:'Order placed successfully.',order});
  }catch(e){res.status(500).json({message:'Could not place order.'});}
});
router.get('/mine',auth,async(req,res)=>{try{res.json(await Order.find({user:req.userId}).sort({createdAt:-1}));}catch(e){res.status(500).json({message:'Could not load orders.'});}});
module.exports=router;
