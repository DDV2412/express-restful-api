const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const {
  getListCheckout,
  updateStatusCheckout,
} = require("../../repository/admin/ru-checkout");
const error_handling = require("../../utils/error-handling");

router.get(
  "/checkout",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { page, size } = req.query;

    const { success, total, currentPage, countPage, data } =
      await getListCheckout(page, size, next);

    res.status(200).json({
      success,
      total,
      currentPage,
      countPage,
      data,
    });
  }
);

router.patch(
  "/checkout/:checkout_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const checkoutId = req.params["checkout_id"];

    const { status } = req.body;

    if (!status)
      return next(new error_handling("Status change not found", 404));

    const data = await updateStatusCheckout(checkoutId, status, next);

    if (data) {
      res.status(200).json({
        success: true,
        data,
      });
    }
  }
);

module.exports = router;
