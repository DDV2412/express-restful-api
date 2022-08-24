const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const { getProductByID } = require("../../repository/products");
const { getUserById } = require("../../repository/user");
const {
  quantityValidation,
  reasonValidation,
} = require("../../service/validation-service");
const {
  listCheckout,
  checkout,
  checkoutDetail,
  cancelCheckout,
} = require("../../repository/customer/cru-checkout");
const error_handling = require("../../utils/error-handling");

router.get(
  "/checkout",
  autenticate,
  protectRole("customer"),
  async (req, res, next) => {
    const userId = req.user["id"];
    const { page, size } = req.query;

    const { success, total, currentPage, countPage, data } = await listCheckout(
      userId,
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

router.post(
  "/checkout/:product_id",
  autenticate,
  protectRole("customer"),
  async (req, res, next) => {
    const userId = req.user["id"];
    const productId = req.params["product_id"];
    const { quantity, message } = req.body;

    const { error } = await quantityValidation({ quantity: quantity });
    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const user = await getUserById(userId, next);

    let address = null;

    user["address"].map((add) => {
      if (add.status === "default") {
        address = add.id;
      }
    });

    const product = await getProductByID(productId, next);

    if (product["stock"] == 0)
      return next(new error_handling("Out of stock product", 400));

    const checkoutValue = {
      quantity: quantity,
      customer_address: address,
      price: product["price"],
      message: message,
      stock: product["stock"],
    };

    const data = await checkout(userId, product, checkoutValue, next);

    res.status(200).json({
      success: true,
      data,
    });
  }
);

router.patch(
  "/cancel-checkout/:checkout_id",
  autenticate,
  protectRole("customer"),
  async (req, res, next) => {
    const { reason } = req.body;
    const checkoutId = req.params["checkout_id"];
    const userId = req.user["id"];

    const { error } = await reasonValidation({ reason: reason });
    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const checkout = await checkoutDetail(checkoutId, userId, next);

    const { success, message } = await cancelCheckout(checkout, reason, next);

    res.status(200).json({
      success,
      message,
    });
  }
);

router.get(
  "/detail-checkout/:checkout_id",
  autenticate,
  protectRole("customer"),
  async (req, res, next) => {
    const checkoutId = req.params["checkout_id"];
    const userId = req.user["id"];

    const checkout = await checkoutDetail(checkoutId, userId, next);

    if (checkout) {
      res.status(200).json({
        success: true,
        data: checkout,
      });
    }
  }
);

module.exports = router;
