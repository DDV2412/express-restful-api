"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "User_has_roles",
      [
        {
          user_id: "5fd82285-2a15-4e0a-b32a-dd198ceb8072",
          role_id: "2e1954dc-d9b4-4356-a53e-d7319175b6bf",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User_has_roles", null, {});
  },
};
