const categoryRepo = require("../repositories/categoryRepository");

// GET
const getAllCategories = async () => {
  return await categoryRepo.getAll();
};

// CREATE
const addCategory = async (name, name_ar, image) => {
  if (!name || !name_ar) {
    throw new Error("Name and Arabic name are required");
  }

  return await categoryRepo.create(name, name_ar, image);
};

// UPDATE
const updateCategory = async (id, name, name_ar, image) => {
  if (!id) throw new Error("ID is required");

  return await categoryRepo.update(id, name, name_ar, image);
};

// DELETE (soft)
const deleteCategory = async (id) => {
  if (!id) throw new Error("ID is required");

  return await categoryRepo.remove(id);
};

// TOGGLE
const toggleStatus = async (id) => {
  if (!id) throw new Error("ID is required");

  return await categoryRepo.toggleStatus(id);
};

module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleStatus,
};
