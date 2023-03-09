'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('directoryPermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      allowTo: {
        type: Sequelize.INTEGER
      },
      roleGroupKey: {
        type: Sequelize.STRING
      },
      directoryId: {
        type: Sequelize.INTEGER
      },
      permissionId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('directoryPermissions');
  }
};