'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    {}
  );
  Group.associate = function(models) {
    Group.belongsTo(models.Course, {
      constraints: false,
    });
    Group.belongsToMany(models.Teacher, {
      through: 'teacher_groups',
      as: 'teachers',
      foreingKey: 'groupId',
      otherKey: 'teacherId',
    });
  };
  return Group;
};
