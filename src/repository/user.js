const {
  User,
  Role,
  Customer_address,
  Checkout,
  Product,
} = require("./database/models");
const logger = require("../utils/logger-winston");
const error_handling = require("../utils/error-handling");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");

module.exports = {
  getUserById: async (id, next) => {
    try {
      const user = await User.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Role,
            as: "role",
          },
          {
            model: Customer_address,
            as: "address",
          },
          {
            model: Product,
            as: "cart",
          },
          {
            model: Checkout,
            as: "checkout",
          },
        ],
        attributes: {
          exclude: ["password"],
        },
      });

      if (!user) return next(new error_handling("User not found", 404));

      return user;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  deleteAccount: async (user, next) => {
    try {
      await user.destroy();

      return {
        success: true,
        message: "Successully deleted account",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  createAddress: async (data, next) => {
    try {
      const address = await Customer_address.create({
        id: uuidv4(),
        customer_id: data["customer_id"],
        city: data["city"],
        districts: data["districts"],
        sub_districts: data["sub_districts"],
        detail_address: data["detail_address"],
        zip_code: data["zip_code"],
        status: data["status"],
      });

      return address;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  detailAddress: async (id, userId, next) => {
    try {
      const address = await Customer_address.findOne({
        where: {
          id: id,
          customer_id: userId,
        },
      });

      if (!address)
        return next(new error_handling("Customer address not found", 404));

      return address;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  deleteAddress: async (address, next) => {
    try {
      await address.destroy();
      return {
        success: true,
        message: "Successfully deleted customer address",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  updateProfile: async (user, data, next) => {
    try {
      const update = await user.update(data);

      return update;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  updatePassword: async (data, next) => {
    try {
      const user = await User.findOne({
        where: {
          id: data["userId"],
        },
      });

      const checkPassword = bcryptjs.compareSync(
        data["currentPassword"],
        user["password"]
      );

      if (!checkPassword)
        return next(new error_handling("Current password is incorrect", 403));

      const checkNewPassword = bcryptjs.compareSync(
        data["newPassword"],
        user["password"]
      );

      if (checkNewPassword)
        return next(
          new error_handling(
            "The current password is the same as the new password",
            403
          )
        );

      let password = bcryptjs.hashSync(data["newPassword"], 12);

      user["password"] = password;

      await user.save();

      return {
        success: true,
        message: "Successfully updated password",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  updateAddress: async (address, data, next) => {
    try {
      const update = await address.update(data);

      return update;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
