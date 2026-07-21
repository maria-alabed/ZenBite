const addonsService = require("../services/addonsService");

// GET by category
const getAddonsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const data = await addonsService.getByCategory(categoryId);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAddons = async (req, res) => {
  try {
    const data = await addonsService.getAll();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// CREATE
const createAddon = async (req, res) => {
  try {
    const result = await addonsService.createAddon(req.body);

    res.status(201).json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE
const toggleAddon = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await addonsService.toggleAddon(id);

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAddons,
  getAddonsByCategory,
  createAddon,
  toggleAddon,
};
