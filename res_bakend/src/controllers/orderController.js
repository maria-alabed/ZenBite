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
const getRecentOrders = async (req, res) => {
  try {
    const orders = await orderService.getRecentOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getRecentOrders,
};
