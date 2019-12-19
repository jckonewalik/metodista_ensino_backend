'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Administrator',
          email: 'administrator@metodistaensino.com.br',
          password_hash:
            '$2a$08$M4Oof16YdlBU6U5QL0PKNuvqCBiCt8tK19HGZQRXiqkMgkW1aUXGy',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
