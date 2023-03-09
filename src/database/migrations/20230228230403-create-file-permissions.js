'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('masterFilePermissions', {
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
      masterFileId: {
        type: Sequelize.INTEGER
      },
      permissionId: {
        type: Sequelize.INTEGER
      },
      stauts: {
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
    await queryInterface.dropTable('masterFilePermissions');
  }
};