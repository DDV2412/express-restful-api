const { Cart } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");

module.exports = {
  addCart: async (productId, userId, quantity, next) => {
    let data = {};
    try {
      const cart = await Cart.findOne({
        where: {
          product_id: productId,
          customer_id: userId,
        },
      });

      if (!cart) {
        data = await Cart.create({
          product_id: productId,
          customer_id: userId,
          quantity: parseInt(quantity),
        });
      } else {
        data = await cart.update({
          quantity: cart.quantity + parseInt(quantity),
        });
      }
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }

    return data;
  },

  deleteCart: async (productId, userId, next) => {
    try {
      const cart = await Cart.findOne({
        where: {
          product_id: productId,
          customer_id: userId,
        },
      });

      if (!cart)
        return next(new error_handling("Product in cart not found", 404));

      await cart.destroy();

      return {
        success: true,
        message: "Successfully delete product in cart",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
