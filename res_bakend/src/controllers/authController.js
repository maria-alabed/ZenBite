const authService = require("../services/authService");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const token = await authService.login(username, password);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = { login };
