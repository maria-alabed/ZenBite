const productService = require("../services/productService");

const getAll = async (req, res) => {
  try {
    const data = await productService.getAllProducts();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getByCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const data = await productService.getProductsByCategory(categoryId);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, price, image, categoryId } = req.body;

    const result = await productService.addProduct(
      name,
      name_ar,
      description,
      description_ar,
      price,
      image_url,
      category_id,
      calories,
    );

    res.status(201).json({
      message: "Product created",
      result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, image, categoryId } = req.body;

    const result = await productService.updateProduct(
      id,
      name,
      description,
      price,
      image,
      categoryId,
      calories,
    );

    res.json({
      message: "Product updated",
      result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await productService.deleteProduct(id);

    res.json({
      message: "Product deleted",
      result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await productService.toggleStatus(id);

    res.json({
      message: "Product status updated",
      result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAll,
  getByCategory,
  create,
  update,
  remove,
  toggleStatus,
};
