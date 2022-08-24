const jwt = require("jsonwebtoken");
const { User, Role } = require("../repository/database/models");
const error_handling = require("../utils/error-handling");

const autenticate = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new error_handling("Please login to access this resource", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findOne({
    where: {
      id: decoded.id,
      email: decoded.email,
    },
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
    },
    include: [{ model: Role, as: "role" }],
  });

  if (!req.user) {
    return next(
      new error_handling("Please login to access this resource", 401)
    );
  }

  next();
};

const protectRole = (...roles) => {
  return async (req, res, next) => {
    let role = false;

    req.user.role.map((r) => {
      if (roles.includes(r.name)) {
        role = true;
      }
    });

    if (!role) {
      return next(
        new error_handling(
          "You are not authorized to access this resource",
          401
        )
      );
    }

    next();
  };
};

module.exports = {
  autenticate,
  protectRole,
};
