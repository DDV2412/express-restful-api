const jwt = require("jsonwebtoken");
const error_handling = require("./error-handling");
const { User, Role } = require("../repository/database/models");
const logger = require("./logger-winston");

const jwt_token = async (user, statusCode, callback) => {
  try {
    const token = await jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const data = await User.findOne({
      where: {
        id: user.id,
        email: user.email,
      },
      include: [{ model: Role, as: "role" }],
      attributes: {
        exclude: ["password"],
      },
    });

    const options = {
      expires: new Date(Date.now() + 1 * 1 * 60 * 60 * 1000),
      httpOnly: true,
    };

    callback.status(statusCode).cookie("token", token, options).json({
      success: true,
      token,
      data,
    });
  } catch (error) {
    logger.error(error["errors"][0].message);
    return new error_handling(error["errors"][0].message, 500);
  }
};

module.exports = jwt_token;
