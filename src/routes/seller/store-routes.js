const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const { registerStore, storeDetail } = require("../../repository/seller/store");
const error_handling = require("../../utils/error-handling");
const { storeValidation } = require("../../service/validation-service");

router.post("/add-store", autenticate, async (req, res, next) => {
  const userId = req.user["id"];

  const {
    store_name,
    city,
    districts,
    sub_districts,
    detail_address,
    zip_code,
  } = req.body;

  const { error } = await storeValidation({
    store_name,
    city,
    districts,
    sub_districts,
    detail_address,
    zip_code,
  });

  if (error) return next(new error_handling(error["details"][0].message, 400));

  const store = await registerStore(userId, req.body, next);

  res.status(201).json({
    success: true,
    data: store,
  });
});

router.get(
  "/store",
  autenticate,
  protectRole("seller"),
  async (req, res, next) => {
    const userId = req.user["id"];

    const store = await storeDetail(userId, next);

    if (store) {
      res.status(200).json({
        success: true,
        data: store,
      });
    }
  }
);
module.exports = router;
