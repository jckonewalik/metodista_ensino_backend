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
      foreingKey: 'id',
      otherKey: 'teacher_id',
    });
  };
  return StudentsClass;
};
