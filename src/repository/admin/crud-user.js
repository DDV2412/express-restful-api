const { User, User_has_role, Role } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const pagination = require("../../utils/pagination-option");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createUser: async (userData, role, next) => {
    try {
      const user = await User.create({
        id: uuidv4(),
        firstname: userData["firstname"],
        lastname: userData["lastname"],
        email: userData["email"],
        password: userData["password"],
        photo_profile: userData["photo_profile"],
      });

      await user.addRole(role);

      return user;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  updateUser: async (user, userData, next) => {
    try {
      const update = await user.update({
        firstname: userData["firstname"],
        lastname: userData["lastname"],
        email: userData["email"],
        password: userData["password"],
        photo_profile: userData["photo_profile"],
      });

      return update;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  deleteUser: async (user, next) => {
    try {
      await user.destroy();

      return {
        success: true,
        message: "Successfully deleted User",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getUserId: async (userId, next) => {
    try {
      const user = await User.findOne({
        where: {
          id: userId,
        },
        include: [{ model: Role, as: "role" }],
      });

      if (!user) return next(new error_handling("User not found", 404));

      return user;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getUsers: async (page, size, next) => {
    try {
      const { limit, offset } = new pagination(page, size);
      const user = await User.findAndCountAll({
        limit,
        offset,
        include: [{ model: Role, as: "role" }],
      });

      return {
        success: true,
        total: user.count,
        currentPage: page ? +page : 0,
        countPage: Math.ceil(user.count / limit),
        data: user.rows,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  addRoleUser: async (user, role, next) => {
    try {
      await user.addRole(role);

      return {
        success: true,
        message: "Successfully add new role",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  deleteRoleUser: async (user, role, next) => {
    try {
      await User_has_role.destroy({
        where: {
          user_id: user["id"],
          role_id: role["id"],
        },
      });

      return {
        success: true,
        message: "Successfully delete role for user",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
