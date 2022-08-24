const router = require("express").Router();
const { getCategories } = require("../repository/category");

router.get("/", async (req, res, next) => {
  const category = await getCategories(next);

  res.status(200).json({
    success: true,
    data: category,
  });
});
module.exports = router;
