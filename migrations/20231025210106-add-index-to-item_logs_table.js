'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('item_logs', ['item_id'], {
      name: 'index_item_logs_on_item_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('item_logs', 'index_item_logs_on_item_id');
  }
};
