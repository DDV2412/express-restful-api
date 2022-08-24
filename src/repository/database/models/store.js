"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "seller_id",
        as: "seller",
      });

      this.hasMany(models.Product, {
        foreignKey: "store_id",
        as: "product-store",
      });
    }
  }
  Store.init(
    {
      name: DataTypes.INTEGER,
      seller_id: DataTypes.UUID,
      city: DataTypes.STRING,
      districts: DataTypes.STRING,
      sub_districts: DataTypes.STRING,
      detail_address: DataTypes.STRING,
      zip_code: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
