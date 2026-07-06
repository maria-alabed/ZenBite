const sizeService = require("../services/sizeService");

// GET /api/sizes/:productId
const getSizesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const data = await sizeService.getByProduct(productId);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getSizesByProduct,
};
