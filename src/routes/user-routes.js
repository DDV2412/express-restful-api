const router = require("express").Router();
const {
  getUserById,
  deleteAccount,
  createAddress,
  detailAddress,
  deleteAddress,
  updateAddress,
  updatePassword,
  updateProfile,
} = require("../repository/user");
const { autenticate } = require("../middlewares/auth");
const {
  addressValidation,
  profileValidation,
  passwordValidation,
} = require("../service/validation-service");
const error_handling = require("../utils/error-handling");

router.get("/profile", autenticate, async (req, res, next) => {
  const userId = req.user["id"];

  const user = await getUserById(userId, next);

  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    });
  }
});

router.delete("/delete-account", autenticate, async (req, res, next) => {
  const userId = req.user["id"];

  const user = await getUserById(userId, next);

  const { success, message } = await deleteAccount(user, next);

  res.status(200).json({
    success,
    message,
  });
});

router.post("/add-address", autenticate, async (req, res, next) => {
  const { city, districts, sub_districts, detail_address, zip_code, status } =
    req.body;

  const { error } = await addressValidation({
    city,
    districts,
    sub_districts,
    detail_address,
    zip_code,
    status,
  });

  if (error) return next(new error_handling(error["details"][0].message, 400));

  const data = await createAddress(
    {
      city,
      customer_id: req.user.id,
      districts,
      sub_districts,
      detail_address,
      zip_code,
      status,
    },
    next
  );

  res.status(201).json({
    success: true,
    data,
  });
});

router.get(
  "/detail/address/:address_id",
  autenticate,
  async (req, res, next) => {
    const userId = req.user["id"];
    const id = req.params["address_id"];

    const address = await detailAddress(id, userId, next);

    res.status(200).json({
      success: true,
      data: address,
    });
  }
);

router.delete(
  "/delete/address/:address_id",
  autenticate,
  async (req, res, next) => {
    const userId = req.user["id"];
    const id = req.params["address_id"];

    const address = await detailAddress(id, userId, next);

    const { success, message } = await deleteAddress(address, next);

    res.status(200).json({
      success,
      message,
    });
  }
);

router.get("/logout", autenticate, async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
  });
});

router.put(
  "/update-address/:address_id",
  autenticate,
  async (req, res, next) => {
    const { city, districts, sub_districts, detail_address, zip_code } =
      req.body;

    const { error } = await addressValidation({
      city,
      districts,
      sub_districts,
      detail_address,
      zip_code,
    });

    if (error)
      return next(new error_handling(error["details"][0].message, 400));

    const userId = req.user["id"];
    const id = req.params["address_id"];

    const address = await detailAddress(id, userId, next);

    const data = await updateAddress(
      address,
      {
        city,
        customer_id: req.user.id,
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

router.put("/profile/update", autenticate, async (req, res, next) => {
  const { firstname, lastname, email } = req.body;

  const { error } = await profileValidation({
    firstname,
    lastname,
    email,
  });

  if (error) return next(new error_handling(error["details"][0].message, 400));

  const userId = req.user["id"];

  const user = await getUserById(userId, next);

  const data = await updateProfile(
    user,
    {
      firstname,
      lastname,
      email,
    },
    next
  );

  res.status(201).json({
    success: true,
    data,
  });
});

router.patch("/password/update", autenticate, async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const { error } = await passwordValidation({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (error) return next(new error_handling(error["details"][0].message, 400));

  if (newPassword !== confirmPassword)
    return next(new error_handling("Password not match", 403));

  const userId = req.user["id"];

  const { success, message } = await updatePassword(
    { userId, currentPassword, newPassword, confirmPassword },
    next
  );

  res.status(201).json({
    success,
    message,
  });
});

module.exports = router;
