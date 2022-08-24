"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: "User_has_role",
        foreignKey: "user_id",
        as: "role",
      });

      this.belongsToMany(models.Product, {
        through: "Cart",
        foreignKey: "customer_id",
        as: "cart",
      });

      this.hasOne(models.Store, {
        foreignKey: "seller_id",
        as: "seller",
      });

      this.hasMany(models.Customer_address, {
        foreignKey: "customer_id",
        as: "address",
      });

      this.hasMany(models.Checkout, {
        foreignKey: "customer_id",
        as: "checkout",
      });
    }
  }
  User.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      photo_profile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
    }
  );
  return User;
};
