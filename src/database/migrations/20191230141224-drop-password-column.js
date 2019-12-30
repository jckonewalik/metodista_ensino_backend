'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'password_hash'
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'password_hash',
      Sequelize.STRING
    )
  },
};
