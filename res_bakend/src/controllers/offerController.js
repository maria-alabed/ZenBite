const offerService = require("../services/offerService");

const getOffers = async (req, res) => {
  try {
    const offers = await offerService.getOffers();

    res.json(offers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const createOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      old_price,
      discount_percent,
      new_price,
      start_date,
      end_date,
    } = req.body;

    const id = await offerService.createOffer([
      title,
      description,
      image,
      old_price,
      discount_percent,
      new_price,
      start_date,
      end_date,
    ]);

    res.json({
      message: "Offer created",
      id,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const toggleOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await offerService.toggleOffer(id, is_active);

    res.json({
      message: "Offer updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getOffers,
  createOffer,
  toggleOffer,
};
