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
    Teacher.belongsToMany(models.Group, {
      through: 'teacher_groups',
      as: 'groups',
      foreingKey: 'teacher_id',
      otherKey: 'group_id',
    });
  };
  return Teacher;
};
