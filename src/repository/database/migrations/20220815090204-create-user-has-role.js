"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User_has_roles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "Roles",
          },
          key: "id",
        },
        onDeleted: "cascade",
        onUpdated: "cascase",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("User_has_roles");
  },
};
