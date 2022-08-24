const { Checkout, Cart, Product } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const pagination = require("../../utils/pagination-option");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  listCheckout: async (userId, page, size, next) => {
    try {
      const { limit, offset } = new pagination(page, size);

      const data = await Checkout.findAndCountAll({
        where: {
          customer_id: userId,
        },
        limit,
        offset,
      });

      return {
        success: true,
        total: data.count,
        currentPage: page ? +page : 0,
        countPage: Math.ceil(data.count / limit),
        data: data.rows,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  checkout: async (userId, product, checkoutValue, next) => {
    try {
      const data = await Checkout.create({
        id: uuidv4(),
        customer_id: userId,
        product_id: product["id"],
        quantity: parseInt(checkoutValue["quantity"]),
        customer_address: checkoutValue["customer_address"],
        total_payment:
          parseInt(checkoutValue["price"]) *
          parseInt(checkoutValue["quantity"]),
        message: checkoutValue["message"] ? checkoutValue["message"] : null,
      });

      await Cart.destroy({
        where: {
          customer_id: userId,
          product_id: product["id"],
        },
      });

      await product.update({
        stock:
          parseInt(checkoutValue["stock"]) -
          parseInt(checkoutValue["quantity"]),
      });

      return data;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  checkoutDetail: async (checkoutId, userId, next) => {
    try {
      const checkout = await Checkout.findOne({
        where: {
          id: checkoutId,
          customer_id: userId,
        },
      });

      if (!checkout)
        return next(new error_handling("Checkout product not found", 404));

      return checkout;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  cancelCheckout: async (checkout, reason, next) => {
    try {
      console.log(checkout);
      await checkout.update({
        message: reason,
        status: "cancel order",
      });

      const product = await Product.findOne({
        where: {
          id: checkout["product_id"],
        },
      });

      await product.update({
        stock: parseInt(product["stock"]) + parseInt(checkout["quantity"]),
      });

      return {
        success: true,
        message: "Successfully canceled checkout",
      };
    } catch (error) {
      console.log(error);
    }
  },
};
