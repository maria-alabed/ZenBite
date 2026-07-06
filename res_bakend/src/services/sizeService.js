const sizeRepo = require("../repositories/sizeRepository");

const getByProduct = async (productId) => {
  return await sizeRepo.getByProduct(productId);
};

module.exports = {
  getByProduct,
};
