require("dotenv").config();
const mongoose=require("mongoose"),bcrypt=require("bcryptjs"),User=require("./models/User");
(async()=>{
 if(!process.env.MONGODB_URI){console.error("Set MONGODB_URI in .env first.");process.exit(1);}
 if(!process.env.ADMIN_NAME||!process.env.ADMIN_EMAIL||!process.env.ADMIN_PASSWORD){console.error("Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");process.exit(1);}
 if(process.env.ADMIN_PASSWORD.length<12){console.error("ADMIN_PASSWORD must be at least 12 characters.");process.exit(1);}
 await mongoose.connect(process.env.MONGODB_URI);
 const email=process.env.ADMIN_EMAIL.toLowerCase();
 const hash=await bcrypt.hash(process.env.ADMIN_PASSWORD,12);
 await User.findOneAndUpdate({email},{name:process.env.ADMIN_NAME,email,password:hash,role:"admin"},{upsert:true,new:true,setDefaultsOnInsert:true});
 console.log("Admin account created/updated:",email);
 await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
