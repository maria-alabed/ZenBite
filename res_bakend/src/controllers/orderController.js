const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const { table_id, total_price, items } = req.body;

    const result = await orderService.createOrder(table_id, total_price, items);

    res.status(201).json({
      message: "Order created",
      order_id: result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createOrder,
};
