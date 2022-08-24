const { Category } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const pagination = require("../../utils/pagination-option");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createCategory: async (categoryName, next) => {
    try {
      const category = await Category.create({
        id: uuidv4(),
        name: categoryName,
      });

      return category;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  updateCategory: async (category, changeValue, next) => {
    try {
      const update = await category.update({
        name: changeValue,
      });

      return update;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  deleteCategory: async (category, next) => {
    try {
      await category.destroy();

      return {
        success: true,
        message: "Successfully deleted category",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getCategoryId: async (categoryId, next) => {
    try {
      const category = await Category.findOne({
        where: {
          id: categoryId,
        },
      });

      if (!category) return next(new error_handling("Category not found", 404));

      return category;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getCategories: async (page, size, next) => {
    try {
      const { limit, offset } = new pagination(page, size);
      const categories = await Category.findAndCountAll({
        limit,
        offset,
      });

      return {
        success: true,
        total: categories.count,
        currentPage: page ? +page : 0,
        countPage: Math.ceil(categories.count / limit),
        data: categories.rows,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
