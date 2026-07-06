const homeService = require("../services/homeService");

const getHome = async (req, res) => {
  try {
    const data = await homeService.getHomeData();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getHome };
