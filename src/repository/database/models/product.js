"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "product-store",
      });
      this.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      this.belongsToMany(models.User, {
        through: "Cart",
        foreignKey: "product_id",
        as: "cart",
      });

      this.hasMany(models.Checkout, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  Product.init(
    {
      store_id: DataTypes.UUID,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      category_id: DataTypes.UUID,
      price: DataTypes.STRING,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
