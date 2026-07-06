const router = require("express").Router();

const controller = require("../controllers/productController");

router.get("/", controller.getAll);

router.get("/by-category/:categoryId", controller.getByCategory);
router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

router.patch("/:id/status", controller.toggleStatus);

module.exports = router;
