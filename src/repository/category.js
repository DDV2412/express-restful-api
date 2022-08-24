const { Category } = require("./database/models");
const logger = require("../utils/logger-winston");
const error_handling = require("../utils/error-handling");

module.exports = {
  getCategories: async (next) => {
    try {
      const category = await Category.findAll();

      return category;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  getCategoryId: async (category_id, next) => {
    try {
      const category = await Category.findOne({
        where: {
          id: category_id,
        },
      });

      if (!category) return next(new error_handling("Category not found", 404));

      return category;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
