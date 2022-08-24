const {
  Checkout,
  Product,
  User,
  Customer_address,
  Sequelize,
  Store,
} = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const pagination = require("../../utils/pagination-option");

module.exports = {
  my_order: async (storeId, page, size, next) => {
    try {
      const { limit, offset } = new pagination(page, size);

      const myOrders = await Checkout.findAndCountAll({
        where: {
          status: {
            [Sequelize.Op.not]: ["waiting for payment", "cancel order"],
          },
          "$product.store_id$": storeId,
        },
        include: [
          {
            model: Product,
            as: "product",
            include: [
              {
                model: Store,
                as: "product-store",
              },
            ],
          },
        ],
        limit,
        offset,
      });

      return {
        success: true,
        total: myOrders.count,
        currentPage: page ? +page : 0,
        countPage: Math.ceil(myOrders.count / limit),
        data: myOrders.rows,
      };
    } catch (error) {
      console.log(error);
    }
  },

  orderDetail: async (checkoutId, next) => {
    try {
      const product = await Checkout.findOne({
        where: {
          id: checkoutId,
          status: {
            [Sequelize.Op.and]: {
              [Sequelize.Op.not]: "waiting for payment",
              [Sequelize.Op.not]: "cancel order",
            },
          },
        },
      });

      if (!product) {
        return next(new error_handling("Checkout product not found", 404));
      }

      return product;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  arrangeDelivery: async (checkoutId, next) => {
    try {
      const data = await Checkout.update(
        {
          status: "delivery process",
        },
        {
          where: {
            id: checkoutId,
            status: "waiting for seller verification",
          },
        }
      );

      return data;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
