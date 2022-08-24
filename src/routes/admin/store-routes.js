const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const {
  createStore,
  updateStore,
  deleteStore,
  getStoreId,
  getStores,
} = require("../../repository/admin/crud-store");
const { getUserId } = require("../../repository/admin/crud-user");
const error_handling = require("../../utils/error-handling");
const { storeValidation } = require("../../service/admin-validation");

router.post(
  "/add-store",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const {
      store_name,
      seller_id,
      city,
      districts,
      sub_districts,
      detail_address,
      zip_code,
    } = req.body;

    const { error } = await storeValidation({
      store_name,
      seller_id,
      city,
      districts,
      sub_districts,
      detail_address,
      zip_code,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const seller = await getUserId(seller_id, next);

    let roleCheck = false;

    seller.role.map((role) => {
      if (role["name"] === "seller") {
        roleCheck = true;
      }
    });

    if (roleCheck !== true) {
      return next(
        new error_handling("User has not got a role as a seller", 400)
      );
    }

    const data = await createStore(
      {
        store_name,
        seller_id: seller["id"],
        city,
        districts,
        sub_districts,
        detail_address,
        zip_code,
      },
      next
    );

    res.status(201).json({
      success: true,
      data,
    });
  }
);

router.put(
  "/update-store/:store_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const storeId = req.params["store_id"];

    const {
      store_name,
      seller_id,
      city,
      districts,
      sub_districts,
      detail_address,
      zip_code,
    } = req.body;

    const { error } = await storeValidation({
      store_name,
      seller_id,
      city,
      districts,
      sub_districts,
      detail_address,
      zip_code,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const store = await getStoreId(storeId, next);

    const update = await updateStore(
      store,
      {
        store_name,
        seller_id,
        city,
        districts,
        sub_districts,
        detail_address,
        zip_code,
      },
      next
    );

    if (update) {
      res.status(201).json({
        success: true,
        data: update,
      });
    }
  }
);

router.delete(
  "/delete-store/:store_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const storeId = req.params["store_id"];

    const store = await getStoreId(storeId, next);

    const { success, message } = await deleteStore(store, next);

    res.status(200).json({
      success,
      message,
    });
  }
);

router.get(
  "/store",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { page, size } = req.query;

    const { success, total, currentPage, countPage, data } = await getStores(
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

router.get(
  "/store/:store_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const storeId = req.params["store_id"];

    const store = await getStoreId(storeId, next);

    if (store) {
      res.status(200).json({
        success: true,
        data: store,
      });
    }
  }
);

module.exports = router;
