const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryId,
} = require("../../repository/admin/crud-category");
const error_handling = require("../../utils/error-handling");
const { categoryValidation } = require("../../service/admin-validation");

router.post(
  "/add-category",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const category_name = req.body["category_name"];

    const { error } = await categoryValidation({
      category_name: category_name,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const data = await createCategory(category_name, next);

    res.status(201).json({
      success: true,
      data,
    });
  }
);

router.put(
  "/update-category/:category_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const category_name = req.body["category_name"];
    const categoryId = req.params["category_id"];

    const { error } = await categoryValidation({
      category_name: category_name,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const category = await getCategoryId(categoryId, next);

    const update = await updateCategory(category, category_name, next);

    if (update) {
      res.status(201).json({
        success: true,
        data: update,
      });
    }
  }
);

router.delete(
  "/delete-category/:category_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const categoryId = req.params["category_id"];

    const category = await getCategoryId(categoryId, next);

    const { success, message } = await deleteCategory(category, next);

    res.status(201).json({
      success,
      message,
    });
  }
);

router.get(
  "/category",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { page, size } = req.query;

    const { success, total, currentPage, countPage, data } =
      await getCategories(page, size, next);

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
