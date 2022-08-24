"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "customer_id",
        as: "address",
      });

      this.hasMany(models.Checkout, {
        foreignKey: "customer_address",
        as: "user_address",
      });
    }
  }
  Customer_address.init(
    {
      customer_id: DataTypes.UUID,
      city: DataTypes.STRING,
      districts: DataTypes.STRING,
      sub_districts: DataTypes.STRING,
      detail_address: DataTypes.STRING,
      zip_code: DataTypes.INTEGER,
      status: DataTypes.ENUM("default", "office", "store"),
    },
    {
      sequelize,
      modelName: "Customer_address",
    }
  );
  return Customer_address;
};
