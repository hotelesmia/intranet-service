'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [{
      permission: 'view',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      permission: 'create',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      permission: 'download',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
