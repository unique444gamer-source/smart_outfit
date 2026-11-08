require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "SMART OUTFIT" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "../public/index.html")));

const PORT = process.env.PORT || 5000;
async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
    } catch (e) {
      console.warn("MongoDB unavailable; catalog fallback is active:", e.message);
    }
  }
  app.listen(PORT, () => console.log(`SMART OUTFIT running at http://localhost:${PORT}`));
}
start();
