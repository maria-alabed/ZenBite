const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");

const login = async (username, password) => {
  const admin = await authRepository.findAdminByUsername(username);

  if (!admin) {
    throw new Error("Invalid username or password");
  }

  // ⚠️ password column fix
  const isMatch = await bcrypt.compare(password, admin.password_hash);

  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    {
      id: admin.id,
      username: admin.username,
      role: "admin",
    },
    process.env.JWT_SECRET || "SECRET_KEY",
    { expiresIn: "1d" },
  );

  return token;
};

module.exports = { login };
