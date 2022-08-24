"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Checkout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "customer_id",
        as: "checkout",
      });
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      this.belongsTo(models.Customer_address, {
        foreignKey: "customer_address",
        as: "user_address",
      });
    }
  }
  Checkout.init(
    {
      customer_id: DataTypes.UUID,
      product_id: DataTypes.UUID,
      quantity: DataTypes.INTEGER,
      customer_address: DataTypes.UUID,
      total_payment: DataTypes.STRING,
      message: DataTypes.STRING,
      status: DataTypes.ENUM(
        "waiting for payment",
        "waiting for seller verification",
        "delivery process",
        "package received",
        "cancel order"
      ),
    },
    {
      sequelize,
      modelName: "Checkout",
    }
  );
  return Checkout;
};
