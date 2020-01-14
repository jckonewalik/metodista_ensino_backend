'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('lessons', 'active');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('lessons', 'active', Sequelize.BOOLEAN);
  },
};
