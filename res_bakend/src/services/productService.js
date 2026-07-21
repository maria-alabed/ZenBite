const productRepo = require("../repositories/productRepository");

const getAllProducts = async () => {
  return await productRepo.getAll();
};
const getProductsByCategory = async (categoryId) => {
  return await productRepo.getByCategory(categoryId);
};

const addProduct = async (
  name,
  name_ar,
  description,
  description_ar,
  price,
  image,
  categoryId,
  calories,
) => {
  if (!name) throw new Error("Name is required");

  return await productRepo.create(
    name,
    name_ar,
    description,
    description_ar,
    price,
    image,
    categoryId,
    calories,
  );
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

const getTopProducts = async () => {
  return await productRepo.getTopProducts();
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  toggleStatus,
  getTopProducts,
};
