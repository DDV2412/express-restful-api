const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const { addCart, deleteCart } = require("../../repository/customer/crud-cart");
const { getProductByID } = require("../../repository/products");
const { getUserById } = require("../../repository/user");
const { quantityValidation } = require("../../service/validation-service");
const error_handling = require("../../utils/error-handling");

router.post(
  "/add-cart/:product_id",
  autenticate,
  protectRole("customer"),
  async (req, res, next) => {
    const productId = req.params["product_id"];
    const userId = req.user["id"];
    const quantity = req.body["quantity"];

    const { error } = await quantityValidation({ quantity: quantity });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const product = await getProductByID(productId, next);

    if (product["stock"] == 0)
      return next(new error_handling("Out of stock product", 400));

    const user = await getUserById(userId, next);

    if (quantity == 0) {
      return next(
        new error_handling("Quantity should have a minimum length of 1", 403)
      );
    }

    const cart = await addCart(product["id"], user["id"], quantity, next);

    res.status(200).json({
      success: true,
      cart,
    });
  }
);

router.delete(
  "/delete-cart/:product_id",
  autenticate,
  protectRole("customer"),
  async (req, res, next) => {
    const productId = req.params["product_id"];
    const userId = req.user["id"];

    const product = await getProductByID(productId, next);

    const user = await getUserById(userId, next);

    const { success, message } = await deleteCart(
      product["id"],
      user["id"],
      next
    );

    res.status(200).json({
      success,
      message,
    });
  }
);

module.exports = router;
