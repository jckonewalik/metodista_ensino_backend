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
        type: Sequelize.INTEGER,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
      students_class_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students_classes',
          key: 'id',
        },
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
