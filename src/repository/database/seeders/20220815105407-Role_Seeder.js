"use strict";

const { v4: uuidv4 } = require("uuid");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          id: "2e1954dc-d9b4-4356-a53e-d7319175b6bf",
          name: "admin",
        },
        {
          id: uuidv4(),
          name: "seller",
        },
        {
          id: uuidv4(),
          name: "customer",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
