'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      description: DataTypes.STRING,
    },
    {}
  );
  return Role;
};
