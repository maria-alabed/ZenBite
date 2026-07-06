const productRepo = require("../repositories/productRepository");

const getProductsByCategory = async (categoryId) => {
  return await productRepo.getByCategory(categoryId);
};

const addProduct = async (name, description, price, image, categoryId) => {
  if (!name) throw new Error("Name is required");

  return await productRepo.create(name, description, price, image, categoryId);
};

const updateProduct = async (
  id,
  name,
  description,
  price,
  image,
  categoryId,
  calories,
) => {
  if (!id) throw new Error("ID is required");

  return await productRepo.update(
    id,
    name,
    description,
    price,
    image,
    categoryId,
    calories,
  );
};

const deleteProduct = async (id) => {
  if (!id) throw new Error("ID is required");

  return await productRepo.remove(id);
};

const toggleStatus = async (id) => {
  if (!id) throw new Error("ID is required");

  return await productRepo.toggleStatus(id);
};

module.exports = {
  addProduct,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  toggleStatus,
};
