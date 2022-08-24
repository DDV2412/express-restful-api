const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductId,
  getProducts,
} = require("../../repository/admin/crud-product");
const { getStoreId } = require("../../repository/admin/crud-store");
const { getCategoryId } = require("../../repository/admin/crud-category");
const error_handling = require("../../utils/error-handling");
const { productValidation } = require("../../service/admin-validation");

router.post(
  "/add-product",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { store_id, product_name, description, category_id, price, stock } =
      req.body;

    const { error } = await productValidation({
      store_id,
      name: product_name,
      description,
      category_id,
      price,
      stock,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const store = await getStoreId(store_id, next);

    const category = await getCategoryId(category_id, next);

    const product = await createProduct(
      {
        store_id: store["id"],
        product_name,
        description,
        category_id: category["id"],
        price,
        stock,
      },
      next
    );

    res.status(201).json({
      success: true,
      data: product,
    });
  }
);

router.put(
  "/update-product/:product_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { store_id, product_name, description, category_id, price, stock } =
      req.body;

    const product_id = req.params["product_id"];

    const { error } = await productValidation({
      store_id,
      name: product_name,
      description,
      category_id,
      price,
      stock,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const product = await getProductId(product_id, next);

    const store = await getStoreId(store_id, next);

    const category = await getCategoryId(category_id, next);

    const update = await updateProduct(
      product,
      {
        store_id: store["id"],
        product_name,
        description,
        category_id: category["id"],
        price,
        stock,
      },
      next
    );

    res.status(200).json({
      success: true,
      data: update,
    });
  }
);

router.delete(
  "/delete-product/:product_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const product_id = req.params["product_id"];

    const product = await getProductId(product_id, next);

    const { success, message } = await deleteProduct(product, next);

    res.status(201).json({
      success,
      message,
    });
  }
);

router.get(
  "/product/:product_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const product_id = req.params["product_id"];

    const product = await getProductId(product_id, next);

    if (product) {
      res.status(201).json({
        success: true,
        data: product,
      });
    }
  }
);

router.get(
  "/product",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { page, size } = req.query;

    const { success, total, currentPage, countPage, data } = await getProducts(
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
  }
);

module.exports = router;
