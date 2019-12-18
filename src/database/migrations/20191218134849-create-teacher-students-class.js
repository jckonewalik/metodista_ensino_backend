'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teacher_students_class', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      teacher_id: {
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
        type: Sequelize.INTEGER,
      },
      students_class_id: {
        allowNull: false,
        references: {
          model: 'students_classes',
          key: 'id',
        },
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('teacher_students_class');
  },
};
