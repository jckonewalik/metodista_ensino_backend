'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('teacher', {
    birthDate: DataTypes.DATE,
    firstName: DataTypes.STRING,
    gender: DataTypes.STRING,
    lastName: DataTypes.STRING,
    middleName: DataTypes.STRING
  }, {});
  Teacher.associate = function (models) {
    Teacher.belongsTo(models.User)
  };
  return Teacher;
};