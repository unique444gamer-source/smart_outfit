const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secret = () => process.env.JWT_SECRET || "development_secret_change_me";
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: "Name, email and a password of at least 6 characters are required." });
    if (await User.findOne({ email })) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 12) });
    const token = jwt.sign({ id: user._id }, secret(), { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (e) { res.status(500).json({ message: "Could not create account." }); }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: (req.body.email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) return res.status(401).json({ message: "Invalid email or password." });
    const token = jwt.sign({ id: user._id }, secret(), { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (e) { res.status(500).json({ message: "Login failed. Check your database connection." }); }
});
module.exports = router;
