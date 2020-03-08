'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    'Student',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      birthDate: DataTypes.DATE,
      gender: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
    },
    {}
  );
  Student.associate = function(models) {};
  return Student;
};
