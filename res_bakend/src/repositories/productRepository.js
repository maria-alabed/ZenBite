const db = require("../config/db");
const sizeRepository = require("./sizeRepository");
// GET ALL
const getAll = async () => {
  const [allProducts] = await db.query("SELECT * FROM products");

  console.log("DIRECT PRODUCTS:", allProducts);

  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.name,
      p.name_ar,
      p.description,
      p.price,
      p.image,
      p.calories,
      p.is_available,
      c.name AS category
    FROM products p
    LEFT JOIN categories c 
    ON p.category_id = c.id
  `);

  console.log("JOIN PRODUCTS:", rows);

  return rows;
};
const getByCategory = async (categoryId) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE category_id = ?",
    [categoryId],
  );
  const result = await Promise.all(
    rows.map(async (p) => {
      const sizes = await sizeRepository.getByProduct(p.id);

      return {
        ...p,
        sizes: sizes || [],
      };
    }),
  );
  return result;
};

// CREATE
const create = async (
  name,
  name_ar,
  description,
  description_ar,
  price,
  image,
  categoryId,
  calories,
) => {
  const [result] = await db.query(
    `INSERT INTO products 
(name, name_ar, description, description_ar, price, image, category_id, calories)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      name_ar,
      description,
      description_ar,
      price,
      image,
      categoryId,
      calories,
    ],
  );

  return result;
};

// UPDATE
const update = async (
  id,
  name,
  name_ar,
  description,
  description_ar,
  price,
  image,
  category_id,
) => {
  const [result] = await db.query(
    `UPDATE products
     SET name = ?,
         name_ar = ?,
         description = ?,
         description_ar = ?,
         price = ?,
         image = ?,
         category_id = ?
     WHERE id = ?`,
    [name, name_ar, description, description_ar, price, image, category_id, id],
  );

  return result;
};

// DELETE (soft أفضل)
const remove = async (id) => {
  const [result] = await db.query(
    `UPDATE products
     SET is_available = FALSE
     WHERE id = ?`,
    [id],
  );

  return result;
};

// TOGGLE
const toggleStatus = async (id) => {
  const [result] = await db.query(
    `UPDATE products
     SET is_available = NOT is_available
     WHERE id = ?`,
    [id],
  );

  return result;
};

// TOP PRODUCTS
const getTopProducts = async () => {
  const [rows] = await db.query(
    `SELECT 
      id,
      name,
      name_ar,
      description,
      price,
      image,
      rating
     FROM products
     WHERE is_available = TRUE
     ORDER BY rating DESC
     LIMIT 4`,
  );

  return rows;
};

const getRecentOrders = async () => {
  const [rows] = await db.query(`
SELECT 
orders.id,
orders.status,
orders.total_price,
tables.table_number
FROM orders
LEFT JOIN tables 
ON orders.table_id=tables.id
ORDER BY orders.id DESC
LIMIT 5
`);

  return rows;
};

module.exports = {
  getAll,
  getByCategory,
  create,
  update,
  remove,
  toggleStatus,
  getTopProducts,
  getRecentOrders,
};
