const { Store, Product, User, Role } = require("../database/models");
const logger = require("../../utils/logger-winston");
const error_handling = require("../../utils/error-handling");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  registerStore: async (sellerId, storeData, next) => {
    try {
      const user = await User.findOne({
        where: {
          id: sellerId,
        },
        include: [{ model: Role, as: "role" }],
      });

      const role = await Role.findOne({
        where: {
          name: "seller",
        },
      });

      user.role.map((r) => {
        if (r.name !== "seller") {
          user.addRole(role);
        }
      });

      const checkStore = await Store.findOne({
        where: {
          seller_id: user["id"],
        },
      });

      let store = {};

      if (checkStore) {
        store = checkStore;
      } else {
        store = await Store.create({
          id: uuidv4(),
          name: storeData["store_name"],
          seller_id: user["id"],
          city: storeData["city"],
          districts: storeData["districts"],
          sub_districts: storeData["sub_districts"],
          detail_address: storeData["detail_address"],
          zip_code: storeData["zip_code"],
        });
      }

      return store;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
  storeDetail: async (sellerId, next) => {
    try {
      const store = await Store.findOne({
        where: {
          seller_id: sellerId,
        },
        include: [
          {
            model: Product,
            as: "product-store",
          },
        ],
      });

      if (!store)
        return next(
          new error_handling("The seller doesn't have a shop yet", 404)
        );

      return store;
    } catch (error) {
      logger.error(error["errors"][0].message);
      return next(new error_handling(error["errors"][0].message, 500));
    }
  },
};
