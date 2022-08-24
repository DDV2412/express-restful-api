/*  import Model
    import logger
    import error handling
    read data product to database
    import pagination class
*/

const { Product, Category, Store, Sequelize } = require("./database/models");
const logger = require("../utils/logger-winston");
const error_handling = require("../utils/error-handling");
const pagination = require("../utils/pagination-option");

module.exports = {
  getListProduct: async (filters, page, size, next) => {
    try {
      const { limit, offser } = new pagination(page, size);

      let where =
        Object.keys(filters).length !== 0
          ? {
              [Sequelize.Op.or]: [
                filters["category"]
                  ? {
                      "$category.name$": {
                        [Sequelize.Op.iLike]: `%${filters["category"]}%`,
                      },
                    }
                  : {},
                filters["name"]
                  ? {
                      name: {
                        [Sequelize.Op.iLike]: `%${filters["name"]}%`,
                      },
                    }
                  : {},
              ],
            }
          : {};

      const products = await Product.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Store,
            as: "product-store",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        limit,
        offser,
        distinct: true,
      });

      return {
        success: true,
        total: products.count,
        currentPage: page ? +page : 0,
        countPage: Math.ceil(products.count / limit),
        data: products.rows,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getProductByID: async (id, next) => {
    try {
      const product = await Product.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Store,
            as: "product-store",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });

      if (!product) return next(new error_handling("Product not found", 404));

      return product;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
