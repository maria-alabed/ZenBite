const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const homeRoutes = require("./routes/homeRoutes");
app.use("/api/home", homeRoutes);

const addonsRoutes = require("./routes/addonsRoutes");
app.use("/api/addons", addonsRoutes);

const sizeRoutes = require("./routes/sizeRoutes");
app.use("/api/sizes", sizeRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const offerRoutes = require("./routes/offerRoutes");
app.use("/api/offers", offerRoutes);

module.exports = app;
