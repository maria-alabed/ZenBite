const db = require("../config/db");

const getByProduct = async (productId) => {
  const [rows] = await db.query(
    `SELECT id, product_id, size_name, price
     FROM product_sizes
     WHERE product_id = ?`,
    [productId],
  );

  return rows;
};

module.exports = { getByProduct };
