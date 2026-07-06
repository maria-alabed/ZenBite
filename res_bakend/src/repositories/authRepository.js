const db = require("../config/db");

const findAdminByUsername = async (username) => {
  const [rows] = await db.query(
    "SELECT * FROM admin_users WHERE username = ?",
    [username],
  );

  return rows[0];
};

module.exports = { findAdminByUsername };
