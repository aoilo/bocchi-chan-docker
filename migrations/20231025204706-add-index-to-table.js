'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('item_logs', ['created_at'], {
      name: 'index_item_logs_on_created_at'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('item_logs', 'index_item_logs_on_created_at');
  }
};
