const { Role } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createRole: async (roleName, next) => {
    try {
      const role = await Role.create({
        id: uuidv4(),
        name: roleName,
      });

      return role;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  updateRole: async (role, changeValue, next) => {
    try {
      const update = await role.update({
        name: changeValue,
      });

      return update;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  deleteRole: async (role, next) => {
    try {
      await role.destroy();

      return {
        success: true,
        message: "Successfully deleted role",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getRoleId: async (roleId, next) => {
    try {
      const role = await Role.findOne({
        where: {
          id: roleId,
        },
      });

      if (!role) return next(new error_handling("Role not found", 404));

      return role;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getRoles: async (next) => {
    try {
      const roles = await Role.findAll();

      return roles;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
