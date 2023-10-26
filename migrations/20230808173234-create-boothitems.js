'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('boothitems', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      data_product_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shop_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      data_product_category: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      img: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('boothitems');
  }
};
