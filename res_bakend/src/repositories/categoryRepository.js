const db = require("../config/db");

const getAll = async () => {
  const [rows] = await db.query(
    `SELECT id, name, name_ar, image, icon
     FROM categories
     WHERE is_active = TRUE
     ORDER BY display_order ASC`,
  );

  return rows;
};

module.exports = { getAll };

// CREATE
const create = async (name, name_ar, image) => {
  const [result] = await db.query(
    `INSERT INTO categories (name, name_ar, image)
     VALUES (?, ?, ?)`,
    [name, name_ar, image],
  );
  return result;
};

// UPDATE
const update = async (id, name, name_ar, image) => {
  const [result] = await db.query(
    `UPDATE categories
     SET name = ?, name_ar = ?, image = ?
     WHERE id = ?`,
    [name, name_ar, image, id],
  );
  return result;
};

// SOFT DELETE (بدل حذف نهائي)
const remove = async (id) => {
  const [result] = await db.query(
    `UPDATE categories
     SET is_active = FALSE
     WHERE id = ?`,
    [id],
  );
  return result;
};

// TOGGLE STATUS
const toggleStatus = async (id) => {
  const [result] = await db.query(
    `UPDATE categories
     SET is_active = NOT is_active
     WHERE id = ?`,
    [id],
  );
  return result;
};

module.exports = {
  getAll,
  create,
  update,
  remove,
  toggleStatus,
};
