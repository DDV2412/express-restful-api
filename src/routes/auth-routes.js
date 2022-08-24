const router = require("express").Router();
const {
  getUserByEmail,
  userRegister,
  forgotPassword,
  resetPassword,
} = require("../repository/auth");
const bcryptjs = require("bcryptjs");
const error_handling = require("../utils/error-handling");
const jwt_token = require("../utils/jwt-token");
const {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../service/validation-service");

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = await loginValidation({
    email: email,
    password: password,
  });

  if (error) return next(new error_handling(error["details"][0].message, 400));

  const user = await getUserByEmail(email, next);

  const checkPassword = bcryptjs.compareSync(password, user["password"]);

  if (!checkPassword) return next(new error_handling("Password is wrong", 400));

  jwt_token(user, 200, res);
});

router.post("/register", async (req, res, next) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  const { error } = await registerValidation({
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
  });

  if (error) return next(new error_handling(error["details"][0].message, 400));

  if (password !== confirmPassword)
    return next(new error_handling("Passwords do not match", 400));

  const hashPassword = bcryptjs.hashSync(password, 12);

  const photo_profile = `https://ui-avatars.com/api/?name=${firstname}+${lastname.replaceAll(
    " ",
    "_"
  )}&background=random&size=128`;

  const user = await userRegister(
    {
      firstname,
      lastname,
      email,
      password: hashPassword,
      photo_profile,
    },
    next
  );

  jwt_token(user, 200, res);
});

router.post("/forgot-password", async (req, res, next) => {
  const { email } = req.body;

  const { error } = await forgotPasswordValidation({
    email,
  });

  if (error) return next(new error_handling(error["details"][0].message, 400));

  const user = await getUserByEmail(email, next);

  const { success, message } = await forgotPassword(user, req, next);

  res.status(200).json({
    success,
    message,
  });
});

router.post("/reset-password", async (req, res, next) => {
  const { token, email } = req.query;
  const { password, confirmPassword } = req.body;

  const { error } = await resetPasswordValidation({
    password: password,
    confirmPassword: confirmPassword,
  });

  if (error) return next(new error_handling(error["details"][0].message, 400));

  if (password !== confirmPassword)
    return next(new error_handling("Passwords do not match", 400));

  const user = await getUserByEmail(email, next);

  const { success, message } = await resetPassword(
    user,
    {
      token: token,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    },
    next
  );

  res.status(200).json({
    success,
    message,
  });
});

module.exports = router;
