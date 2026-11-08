require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const storeRoutes = require("./routes/store");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(x => x.trim()) : true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  app: "SMART OUTFIT",
  database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
}));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/store", storeRoutes);
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "../public/index.html")));

async function createAdminIfMissing() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("Admin bootstrap skipped: set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD to create an admin.");
    return;
  }
  if (ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("Existing account promoted to admin:", email);
    } else {
      console.log("Admin account already exists:", email);
    }
    return;
  }
  await User.create({
    name: ADMIN_NAME.trim(), email,
    password: await bcrypt.hash(ADMIN_PASSWORD, 12), role: "admin"
  });
  console.log("Admin account created:", email);
}

const PORT = process.env.PORT || 5000;
async function start() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing. Add your MongoDB Atlas connection string in Render Environment Variables.");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET is missing or too short. Set a random secret of at least 32 characters in Render Environment Variables.");
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000
  });
  console.log("MongoDB connected successfully");
  await createAdminIfMissing();
  app.listen(PORT, () => console.log(`SMART OUTFIT running on port ${PORT}`));
}
start().catch(error => {
  console.error("SMART OUTFIT startup failed:", error.message);
  process.exit(1);
});
