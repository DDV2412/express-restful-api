const { User, Reset_Password, Sequelize, Role } = require("./database/models");
const logger = require("../utils/logger-winston");
const error_handling = require("../utils/error-handling");
const mail_service = require("../service/mail-service");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");

module.exports = {
  getUserByEmail: async (email, next) => {
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) return next(new error_handling("User not found", 404));

      return user;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  userRegister: async (data, next) => {
    try {
      const user = await User.create({
        id: uuidv4(),
        firstname: data["firstname"],
        lastname: data["lastname"],
        email: data["email"],
        password: data["password"],
        photo_profile: data["photo_profile"],
      });

      const role = await Role.findOne({
        where: {
          name: "customer",
        },
      });

      await user.addRole(role);

      return user;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  forgotPassword: async (user, req, next) => {
    try {
      const reset_token = await Reset_Password.findOne({
        where: {
          email: user["email"],
        },
      });

      const fpSalt = await crypto.randomBytes(64).toString("base64");

      const expired_Token = new Date(new Date().getTime() + 15 * 60 * 1000);

      if (!reset_token) {
        await Reset_Password.create({
          email: user["email"],
          reset_token: fpSalt,
          expired_token: expired_Token,
        });
      } else {
        await reset_token.update({
          reset_token: fpSalt,
          expired_token: expired_Token,
        });
      }

      await mail_service({
        to: user["email"],
        replyTo: "dhyanputra24@gmail.com",
        subject: `Password Reset Request for Mailtrap Testing`,
        message:
          "To reset your password, please click the link below.\n\n" +
          req.protocol +
          "://" +
          req.get("host") +
          "\n" +
          "/api/auth/reset-password?token=" +
          encodeURIComponent(fpSalt) +
          "&email=" +
          user["email"],
      });

      return {
        success: true,
        message: `Email sent to ${user["email"]} successfully`,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  resetPassword: async (user, options, next) => {
    try {
      await Reset_Password.destroy({
        where: {
          expired_token: {
            [Sequelize.Op.lte]: Sequelize.fn(
              "date_trunc",
              "day",
              Sequelize.col("expired_token")
            ),
          },
        },
      });

      const token = await Reset_Password.findOne({
        where: {
          email: options["email"],
          reset_token: options["token"],
          expired_token: {
            [Sequelize.Op.gte]: Sequelize.fn(
              "date_trunc",
              "day",
              Sequelize.col("expired_token")
            ),
          },
        },
      });

      if (!token)
        return new error_handling(
          "Token has expired. Please try password reset again.",
          400
        );

      if (options["password"] !== options["confirmPassword"]) {
        return new errorHandler("Passwords do not match", 400);
      }

      let newPassword = await bcryptjs.hashSync(options["password"], 12);

      user.password = newPassword;

      await user.save();

      await token.destroy({ force: true });

      await mail_service({
        to: user.email,
        replyTo: "dhyanputra24@gmail.com",
        subject: `Mailtrap Testing Password Changed`,
        message: `We've channeled our psionic energy to change your Mailtrap Testing account password. Gonna go get a seltzer to calm down.`,
      });

      return {
        success: true,
        message: `Password reset. Please login with your new password.`,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
