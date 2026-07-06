const db = require("../config/db");

const createOrder = async (table_id, total_price) => {
  const [result] = await db.query(
    `
    INSERT INTO orders
    (table_id, status, total_price)
    VALUES (?, ?, ?)
    `,
    [table_id, "pending", total_price],
  );

  return result.insertId;
};

const addOrderItem = async (
  order_id,
  product_id,
  quantity,
  price,
  note,
  selected_size,
) => {
  const [result] = await db.query(
    `
    INSERT INTO order_items
    (
      order_id,
      product_id,
      quantity,
      price,
      note,
      selected_size
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [order_id, product_id, quantity, price, note, selected_size],
  );

  return result.insertId;
};

const addAddon = async (order_item_id, addon_id, price) => {
  const [result] = await db.query(
    `
    INSERT INTO order_addons
    (
      order_item_id,
      addon_id,
      price
    )
    VALUES (?, ?, ?)
    `,
    [order_item_id, addon_id, price],
  );

  return result.insertId;
};

module.exports = {
  createOrder,
  addOrderItem,
  addAddon,
};
