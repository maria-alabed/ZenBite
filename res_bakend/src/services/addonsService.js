const addonsRepository = require("../repositories/addonsRepository");

const getByCategory = async (categoryId) => {
  return await addonsRepository.getByCategory(categoryId);
};

const getAll = async () => {
  return await addonsRepository.getAll();
};

const createAddon = async (data) => {
  return await addonsRepository.createAddon(data);
};

const toggleAddon = async (id) => {
  return await addonsRepository.toggleAddon(id);
};

module.exports = {
  getByCategory,
  createAddon,
  toggleAddon,
  getAll,
};
