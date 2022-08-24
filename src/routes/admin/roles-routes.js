const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const {
  createRole,
  updateRole,
  deleteRole,
  getRoleId,
  getRoles,
} = require("../../repository/admin/crud-role");
const error_handling = require("../../utils/error-handling");
const { roleValidation } = require("../../service/admin-validation");

router.post(
  "/add-role",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const role_name = req.body["role_name"];

    const { error } = await roleValidation({
      role_name: role_name,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const data = await createRole(role_name, next);

    res.status(201).json({
      success: true,
      data,
    });
  }
);

router.put(
  "/update-role/:role_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const role_name = req.body["role_name"];
    const roleId = req.params["role_id"];

    const { error } = await roleValidation({
      role_name: role_name,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const role = await getRoleId(roleId, next);

    const update = await updateRole(role, role_name, next);

    if (update) {
      res.status(201).json({
        success: true,
        data: update,
      });
    }
  }
);

router.delete(
  "/delete-role/:role_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const roleId = req.params["role_id"];

    const role = await getRoleId(roleId, next);

    const { success, message } = await deleteRole(role, next);

    res.status(201).json({
      success,
      message,
    });
  }
);

router.get(
  "/role",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const data = await getRoles(next);

    res.status(200).json({
      success: true,
      data,
    });
  }
);

module.exports = router;
