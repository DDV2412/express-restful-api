const router = require("express").Router();
const { autenticate, protectRole } = require("../../middlewares/auth");
const {
  getUserId,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  addRoleUser,
  deleteRoleUser,
} = require("../../repository/admin/crud-user");
const { getRoleId } = require("../../repository/admin/crud-role");
const error_handling = require("../../utils/error-handling");
const {
  userValidation,
  userUpdateValidation,
} = require("../../service/admin-validation");
const bcryptjs = require("bcryptjs");

router.post(
  "/add-user",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { firstname, lastname, email, role_id, password, confirmPassword } =
      req.body;

    const { error } = await userValidation({
      firstname,
      lastname,
      email,
      role_id,
      password,
      confirmPassword,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    if (password !== confirmPassword)
      return next(new error_handling("Passwords do not match", 400));

    const hashPassword = bcryptjs.hashSync(password, 12);

    const photo_profile = `https://ui-avatars.com/api/?name=${firstname}+${lastname.replaceAll(
      " ",
      "_"
    )}&background=random&size=128`;

    const role = await getRoleId(role_id, next);

    const data = await createUser(
      {
        firstname,
        lastname,
        email,
        password: hashPassword,
        photo_profile,
      },
      role,
      next
    );

    if (data) {
      res.status(201).json({
        success: true,
        data,
      });
    }
  }
);

router.put(
  "/update-user/:user_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;

    const userId = req.params["user_id"];

    const { error } = await userUpdateValidation({
      firstname,
      lastname,
      email,
      password,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const hashPassword = bcryptjs.hashSync(password, 12);

    const photo_profile = `https://ui-avatars.com/api/?name=${firstname}+${lastname.replaceAll(
      " ",
      "_"
    )}&background=random&size=128`;

    const user = await getUserId(userId, next);

    if (user) {
      const data = await updateUser(
        user,
        {
          firstname,
          lastname,
          email,
          password: hashPassword,
          photo_profile,
        },
        next
      );

      res.status(201).json({
        success: true,
        data,
      });
    }
  }
);

router.delete(
  "/delete-user/:user_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const userId = req.params["user_id"];

    const user = await getUserId(userId, next);

    if (user) {
      const { success, message } = await deleteUser(user, next);

      res.status(201).json({
        success,
        message,
      });
    }
  }
);

router.get(
  "/user/:user_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const userId = req.params["user_id"];

    const user = await getUserId(userId, next);

    if (user) {
      res.status(201).json({
        success: true,
        data: user,
      });
    }
  }
);

router.get(
  "/user",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const { page, size } = req.query;

    const { success, total, currentPage, countPage, data } = await getUsers(
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

router.patch(
  "/add-role/:user_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const userId = req.params["user_id"];

    const role_id = req.body["role_id"];

    if (!role_id)
      return next(
        new error_handling("Role ID not found, please insert in body", 404)
      );

    const role = await getRoleId(role_id, next);

    const user = await getUserId(userId, next);

    if (user) {
      const { success, message } = await addRoleUser(user, role, next);

      res.status(201).json({
        success,
        message,
      });
    }
  }
);

router.delete(
  "/change-role/:user_id",
  autenticate,
  protectRole("admin"),
  async (req, res, next) => {
    const userId = req.params["user_id"];

    const role_id = req.body["role_id"];

    const role = await getRoleId(role_id, next);

    const user = await getUserId(userId, next);

    if (user) {
      const { success, message } = await deleteRoleUser(user, role, next);

      res.status(201).json({
        success,
        message,
      });
    }
  }
);

module.exports = router;
