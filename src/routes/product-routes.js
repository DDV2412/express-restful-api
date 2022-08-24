const router = require("express").Router();
const { getListProduct, getProductByID } = require("../repository/products");

router.get("/", async (req, res, next) => {
  let { category, page, size, name } = req.query;

  let options = {};

  if (typeof category !== "undefined") {
    Object.assign(options, {
      category: category,
    });
  }

  if (typeof name !== "undefined") {
    Object.assign(options, {
      name: name,
    });
  }

  let { success, data, total, currentPage, countPage } = await getListProduct(
    options,
    page,
    size,
    next
  );

  res.status(200).json({
    success,
    total,
    currentPage,
    countPage,
    data,
  });
});

router.get("/detail/:product_id", async (req, res, next) => {
  let id = req.params["product_id"];

  let data = await getProductByID(id, next);

  if (data) {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
module.exports = router;
