'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentsClass = sequelize.define(
    'StudentsClass',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    { tableName: 'students_classes' }
  );
  StudentsClass.associate = function(models) {
    StudentsClass.belongsTo(models.Course, {
      constraints: false,
    });
    StudentsClass.belongsToMany(models.Teacher, {
      through: 'teacher_students_class',
      as: 'teachers',
      foreignKey: 'students_class_id',
    });
    StudentsClass.belongsToMany(models.Student, {
      through: 'student_students_class',
      as: 'students',
      foreignKey: 'students_class_id',
    });
  };
  return StudentsClass;
};
