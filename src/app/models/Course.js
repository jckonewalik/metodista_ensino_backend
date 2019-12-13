'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Course.associate = function(models) {
    // associations can be defined here
  };
  return Course;
};
