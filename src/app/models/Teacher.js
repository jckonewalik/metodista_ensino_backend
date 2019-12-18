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
      as: 'classes',
      foreignKey: 'teacher_id',
    });
  };
  return Teacher;
};
