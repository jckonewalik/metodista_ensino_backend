'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  Group.associate = function (models) {
    Group.belongsTo(models.Course, {
      as: 'course',
      constraints: false
    });
  };
  return Group;
};