const { Product } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const pagination = require("../../utils/pagination-option");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createProduct: async (productData, next) => {
    try {
      const product = await Product.create({
        id: uuidv4(),
        store_id: productData["store_id"],
        name: productData["product_name"],
        description: productData["description"],
        category_id: productData["category_id"],
        price: productData["price"],
        stock: productData["stock"],
      });

      return product;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  updateProduct: async (product, productData, next) => {
    try {
      const update = await product.update({
        store_id: productData["seller_id"],
        name: productData["product_name"],
        description: productData["description"],
        category_id: productData["category_id"],
        price: productData["price"],
        stock: productData["stock"],
      });

      return update;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  deleteProduct: async (product, next) => {
    try {
      await product.destroy();

      return {
        success: true,
        message: "Successfully deleted product",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getProductId: async (productId, next) => {
    try {
      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (!product) return next(new error_handling("Product not found", 404));

      return product;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getProducts: async (page, size, next) => {
    try {
      const { limit, offset } = new pagination(page, size);
      const product = await Product.findAndCountAll({
        limit,
        offset,
      });

      return {
        success: true,
        total: product.count,
        currentPage: page ? +page : 0,
        countPage: Math.ceil(product.count / limit),
        data: product.rows,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
