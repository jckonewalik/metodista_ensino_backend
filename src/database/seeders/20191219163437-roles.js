'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'roles',
      [
        {
          id: 'ROLE_ADMIN',
          description: 'Administrator',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'ROLE_TEACHER',
          description: 'Professor',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
