"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_has_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_has_role.init(
    {
      user_id: DataTypes.UUID,
      role_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "User_has_role",
      timestamps: false,
    }
  );
  return User_has_role;
};
