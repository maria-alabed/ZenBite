const express = require("express");
const router = express.Router();

const {
  getOffers,
  createOffer,
  toggleOffer,
} = require("../controllers/offerController");

router.get("/", getOffers);
router.post("/", createOffer);

router.patch("/:id", toggleOffer);

module.exports = router;
