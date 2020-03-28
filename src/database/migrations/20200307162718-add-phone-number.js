'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'students',
      'phone_number',
      Sequelize.STRING
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('students', 'phone_number');
  },
};
