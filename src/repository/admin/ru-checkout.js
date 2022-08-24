const { Checkout, Sequelize } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const pagination = require("../../utils/pagination-option");

module.exports = {
  getListCheckout: async (page, size, next) => {
    try {
      const { limit, offset } = new pagination(page, size);

      const checoutList = await Checkout.findAndCountAll({
        limit,
        offset,
      });

      return {
        success: true,
        total: checoutList.count,
        currentPage: page ? +page : 0,
        countPage: Math.ceil(checoutList.count / limit),
        data: checoutList.rows,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  updateStatusCheckout: async (checkoutId, statusUpdate, next) => {
    try {
      const checkout = await Checkout.findOne({
        where: {
          id: checkoutId,
          status: { [Sequelize.Op.not]: "cancel order" },
        },
      });

      if (!checkout) return next(new error_handling("Ordered not found", 404));

      const update = await checkout.update({
        status: statusUpdate,
      });

      return update;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
