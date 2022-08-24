"use strict";

const bcryptjs = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcryptjs.hashSync("D12345678#", 12);
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: "5fd82285-2a15-4e0a-b32a-dd198ceb8072",
          firstname: "Dian",
          lastname: "Dwi Vaputra",
          email: "dhyanputra24@gmail.com",
          password: password,
          photo_profile: `https://ui-avatars.com/api/?name=Dian+Dwi_Vaputra&background=random&size=128`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
