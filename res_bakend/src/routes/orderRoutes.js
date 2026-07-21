const express = require("express");
const router = express.Router();

const {
  createOrder,
  getRecentOrders,
} = require("../controllers/orderController");

router.post("/", createOrder);

router.get("/recent", getRecentOrders);

module.exports = router;
