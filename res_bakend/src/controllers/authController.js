const authService = require("../services/authService");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    res.json({
      message: "Login successful",
      token: result.token,
      admin: result.admin,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = { login };
