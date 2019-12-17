'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    'Teacher',
    {
      birthDate: DataTypes.DATE,
      firstName: DataTypes.STRING,
      gender: DataTypes.STRING,
      lastName: DataTypes.STRING,
      middleName: DataTypes.STRING,
    },
    {}
  );
  Teacher.associate = function(models) {
    Teacher.belongsTo(models.User);
    Teacher.belongsToMany(models.StudentsClass, {
      through: 'teacher_students_class',
      as: 'studentsClasses',
      foreingKey: 'teacher_id',
      otherKey: 'students_class_id',
    });
  };
  return Teacher;
};
