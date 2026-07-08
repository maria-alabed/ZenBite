const offerRepository = require("../repositories/offerRepository");

const getOffers = async () => {
  return await offerRepository.getOffers();
};

const createOffer = async (
  title,
  description,
  image,
  discount_percent,
  start_date,
  end_date,
) => {
  return await offerRepository.createOffer(
    title,
    description,
    image,
    discount_percent,
    start_date,
    end_date,
  );
};

const toggleOffer = async (id, is_active) => {
  await offerRepository.toggleOffer(id, is_active);
};

module.exports = {
  getOffers,
  createOffer,
  toggleOffer,
};
