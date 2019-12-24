'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATE,
      },
      teacher_id: {
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
        onDelete: 'cascade',
        type: Sequelize.INTEGER,
      },
      lesson_id: {
        allowNull: true,
        references: {
          model: 'lessons',
          key: 'id',
        },
        onDelete: 'set null',
        type: Sequelize.INTEGER,
      },
      students_class_id: {
        allowNull: false,
        references: {
          model: 'students_classes',
          key: 'id',
        },
        onDelete: 'cascade',
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
    return queryInterface.dropTable('attendances');
  },
};
