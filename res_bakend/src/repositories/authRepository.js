const db = require("../config/db");

const findAdminByUsername = async (username) => {
  const [rows] = await db.query(
    "SELECT * FROM admin_users WHERE username = ?",
    [username],
  );

  console.log("USERNAME RECEIVED:", username);
  console.log("ADMIN FOUND:", rows);

  return rows[0];
};

module.exports = { findAdminByUsername };
