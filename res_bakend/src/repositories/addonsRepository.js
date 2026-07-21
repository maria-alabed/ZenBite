const db = require("../config/db");

// GET by category
const getByCategory = async (categoryId) => {
  const [rows] = await db.query(
    `
    SELECT a.*
    FROM addons a
    JOIN category_addons ca ON a.id = ca.addon_id
    WHERE ca.category_id = ? AND a.is_active = 1
  `,
    [categoryId],
  );

  return rows;
};

const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM addons WHERE is_active = 1");

  return rows;
};

// CREATE
const createAddon = async (data) => {
  const [result] = await db.query(
    `
    INSERT INTO addons 
    (name, name_ar, price, emoji, is_active)
    VALUES (?, ?, ?, ?, 1)
    `,
    [data.name, data.name_ar || "", Number(data.price), data.emoji || ""],
  );

  const addonId = result.insertId;

  if (data.category_id) {
    await db.query(
      `
      INSERT INTO category_addons
      (category_id, addon_id)
      VALUES (?, ?)
      `,
      [data.category_id, addonId],
    );
  }

  return addonId;
};

// TOGGLE
const toggleAddon = (id) => {
  return db.query("UPDATE addons SET is_active = NOT is_active WHERE id = ?", [
    id,
  ]);
};

module.exports = {
  getByCategory,
  createAddon,
  toggleAddon,
  getAll,
};
