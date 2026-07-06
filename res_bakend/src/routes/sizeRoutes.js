const express = require("express");
const router = express.Router();

const sizeController = require("../controllers/sizeController");

// GET sizes for product
router.get("/:productId", sizeController.getSizesByProduct);

module.exports = router;
