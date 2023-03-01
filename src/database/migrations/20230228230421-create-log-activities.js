'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logActivities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdBy: {
        type: Sequelize.STRING
      },
      target: {
        type: Sequelize.STRING
      },
      targetId: {
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('logActivities');
  }
};