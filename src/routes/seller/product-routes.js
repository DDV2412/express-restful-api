const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../../repository/seller/crud-product");
const { storeDetail } = require("../../repository/seller/store");
const error_handling = require("../../utils/error-handling");
const { getCategoryId } = require("../../repository/category");
const { productValidation } = require("../../service/validation-service");

router.post(
  "/add-product",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const { name, description, category_id, price, stock } = req.body;
    const userId = req.user["id"];

    const store = await storeDetail(userId, next);

    const { error } = await productValidation(req.body);

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const category = await getCategoryId(category_id, next);

    const product = await createProduct(
      store["id"],
      { name, description, category_id: category["id"], price, stock },
      next
    );

    res.status(201).json({
      success: true,
      data: product,
    });
  }
);

router.get(
  "/product",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const userId = req.user["id"];
    const { page, size } = req.query;

    const { success, data, total, currentPage, countPage } = await getProducts(
      userId,
      page,
      size,
      next
    );

    res.status(200).json({
      success,
      data,
      total,
      currentPage,
      countPage,
    });
  }
);

router.get(
  "/product/:product_id",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const userId = req.user["id"];
    const productId = req.params["product_id"];

    const product = await getProductById(productId, userId, next);

    if (product) {
      res.status(200).json({
        success: true,
        data: product,
      });
    }
  }
);

router.put(
  "/update-product/:product_id",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const { name, description, category_id, price, stock } = req.body;
    const userId = req.user["id"];
    const productId = req.params["product_id"];

    const productByID = await getProductById(productId, userId, next);

    const { error } = await productValidation(req.body);

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const category = await getCategoryId(category_id, next);

    const product = await updateProduct(
      productByID,
      { name, description, category_id: category["id"], price, stock },
      next
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

router.delete(
  "/delete-product/:product_id",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const { name, description, category_id, price, stock } = req.body;
    const userId = req.user["id"];
    const productId = req.params["product_id"];

    const productByID = await getProductById(productId, userId, next);

    const { success, message } = await deleteProduct(productByID, next);

    res.status(200).json({
      success,
      message,
    });
  }
);
module.exports = router;
