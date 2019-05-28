'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Products',
      'isAvailable',{
        type : Sequelize.BOOLEAN,
      }
    )
  },

  down: (queryInterface, Sequelize) => {

   return queryInterface.removeColumn(
      'Products',
      'isAvailable'
    )
  }
  };
