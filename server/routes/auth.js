const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const secret = () => process.env.JWT_SECRET;
const publicUser = user => ({
  id: user._id, name: user.name, email: user.email,
  phone: user.phone || "", role: user.role
});
const ensureDatabase = (res) => {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({ message: "Database is not connected. Please check the MongoDB connection configured in Render." });
  return false;
};

router.post("/register", async (req, res) => {
  if (!ensureDatabase(res)) return;
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
      return res.status(400).json({ message: "Enter your name, a valid email and a password of at least 6 characters." });
    }
    if (await User.findOne({ email })) return res.status(409).json({ message: "An account with this email already exists. Please log in." });
    const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 12) });
    const token = jwt.sign({ id: user._id }, secret(), { expiresIn: "7d" });
    return res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists. Please log in." });
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  if (!ensureDatabase(res)) return;
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!email || !password) return res.status(400).json({ message: "Enter your email and password." });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ id: user._id }, secret(), { expiresIn: "7d" });
    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
});
module.exports = router;
