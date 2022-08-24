const router = require("express").Router();
const { generateProduct } = require("../mocks/mock-data");
const { autenticate, protectRole } = require("../middlewares/auth");

router.get(
  "/mock-generate",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const data = await generateProduct();

    res.status(200).json({
      success: true,
      data,
    });
  }
);

module.exports = router;
