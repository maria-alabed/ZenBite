const express = require("express");
const router = express.Router();

const {
  getAddonsByCategory,
  createAddon,
  toggleAddon,
  getAllAddons,
} = require("../controllers/addonsController");

router.get("/", getAllAddons);
// GET by category
router.get("/:categoryId", getAddonsByCategory);

// POST addon
router.post("/", createAddon);

// TOGGLE
router.patch("/:id/toggle", toggleAddon);

module.exports = router;
