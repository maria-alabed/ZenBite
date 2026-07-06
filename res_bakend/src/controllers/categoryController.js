const categoryService = require("../services/categoryService");

// GET
const getAll = async (req, res) => {
  try {
    const data = await categoryService.getAllCategories();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
const create = async (req, res) => {
  try {
    const { name, name_ar, image } = req.body;

    const result = await categoryService.addCategory(name, name_ar, image);

    res.status(201).json({
      message: "Category created",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, name_ar, image } = req.body;

    const result = await categoryService.updateCategory(
      id,
      name,
      name_ar,
      image,
    );

    res.json({
      message: "Category updated",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await categoryService.deleteCategory(id);

    res.json({
      message: "Category disabled",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await categoryService.toggleStatus(id);

    res.json({
      message: "Category status updated",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
  toggleStatus,
};
