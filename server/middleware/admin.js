const User = require("../models/User");
module.exports = async function adminOnly(req,res,next){
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user || user.role !== "admin") return res.status(403).json({message:"Admin access only."});
    req.admin = user; next();
  } catch(e){ return res.status(500).json({message:"Could not verify admin role."}); }
};
