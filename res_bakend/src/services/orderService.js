const orderRepo = require("../repositories/orderRepository");

const createOrder = async (table_id, total_price, items) => {
  const order_id = await orderRepository.createOrder(table_id, total_price);

  for (const item of items) {
    const order_item_id = await orderRepository.addOrderItem(
      order_id,
      item.product_id,
      item.quantity,
      item.price,
      item.note,
      item.selected_s,
    );

    if (item.addons) {
      for (const addon of item.addons) {
        await orderRepository.addAddon(
          order_item_id,
          addon.addon_id,
          addon.price,
        );
      }
    }
  }

  return order_id;
};

const getRecentOrders = async () => {
  return await orderRepo.getRecentOrders();
};

module.exports = {
  createOrder,
  getRecentOrders,
};
