'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('attendance_appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      attendance_id: {
        allowNull: false,
        references: {
          model: 'attendances',
          key: 'id',
        },
        onDelete: 'cascade',
        type: Sequelize.INTEGER,
      },
      student_id: {
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onDelete: 'cascade',
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('attendance_appointments');
  },
};
