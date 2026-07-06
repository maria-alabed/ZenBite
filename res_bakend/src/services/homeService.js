const categoryRepo = require("../repositories/categoryRepository");
const productRepo = require("../repositories/productRepository");

const getHomeData = async () => {
  const categories = await categoryRepo.getAll();
  const topProducts = await productRepo.getTopProducts();

  return {
    categories,
    topProducts,
  };
};

module.exports = { getHomeData };
