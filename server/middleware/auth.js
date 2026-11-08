const jwt = require("jsonwebtoken");
module.exports = function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ message: "Please log in first." });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET || "development_secret_change_me").id;
    next();
  } catch (_e) { return res.status(401).json({ message: "Session expired. Please log in again." }); }
};
