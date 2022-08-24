const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const {
  my_order,
  orderDetail,
  arrangeDelivery,
} = require("../../repository/seller/ru-checkout");
const { storeDetail } = require("../../repository/seller/store");
const error_handling = require("../../utils/error-handling");

router.get(
  "/my-order",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const userId = req.user["id"];

    const store = await storeDetail(userId, next);

    const { page, size } = req.query;

    if (store) {
      const { success, total, currentPage, countPage, data } = await my_order(
        store["id"],
        page,
        size,
        next
      );

      res.status(200).json({ success, total, currentPage, countPage, data });
    }
  }
);

router.get(
  "/order/:checkout_id",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const checkoutId = req.params["checkout_id"];

    const order = await orderDetail(checkoutId, next);

    if (order) {
      res.status(200).json({ success: true, data: order });
    }
  }
);

router.patch(
  "/order/:checkout_id",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const checkoutId = req.params["checkout_id"];

    const order = await orderDetail(checkoutId, next);

    if (order) {
      const update = await arrangeDelivery(order["id"], next);

      res
        .status(200)
        .json({ success: true, message: "Successully arrange delivery" });
    }
  }
);
module.exports = router;
