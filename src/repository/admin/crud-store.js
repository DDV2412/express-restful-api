const { Store } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const pagination = require("../../utils/pagination-option");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createStore: async (storeData, next) => {
    try {
      const store = await Store.create({
        id: uuidv4(),
        name: storeData["store_name"],
        seller_id: storeData["seller_id"],
        city: storeData["city"],
        districts: storeData["districts"],
        sub_districts: storeData["sub_districts"],
        detail_address: storeData["detail_address"],
        zip_code: storeData["zip_code"],
      });

      return store;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  updateStore: async (store, storeData, next) => {
    try {
      const update = await store.update({
        name: storeData["store_name"],
        seller_id: storeData["seller_id"],
        city: storeData["city"],
        districts: storeData["districts"],
        sub_districts: storeData["sub_districts"],
        detail_address: storeData["detail_address"],
        zip_code: storeData["zip_code"],
      });

      return update;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  deleteStore: async (store, next) => {
    try {
      await store.destroy();

      return {
        success: true,
        message: "Successfully deleted store",
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getStoreId: async (storeId, next) => {
    try {
      const store = await Store.findOne({
        where: {
          id: storeId,
        },
      });

      if (!store) return next(new error_handling("Store not found", 404));

      return store;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },

  getStores: async (page, size, next) => {
    try {
      const { limit, offset } = new pagination(page, size);
      const store = await Store.findAndCountAll({
        limit,
        offset,
      });

      return {
        success: true,
        total: store.count,
        currentPage: page ? +page : 0,
        countPage: Math.ceil(store.count / limit),
        data: store.rows,
      };
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
