const jwt = require('jsonwebtoken');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING
    }
  );
  User.associate = function (models) {
    User.hasOne(models.Teacher);
    User.belongsToMany(models.Role, {
      through: 'user_role',
      as: 'roles',
      foreignKey: 'user_id',
    });
  };

  User.prototype.generateToken = async function () {
    const roles = await this.getRoles();
    return jwt.sign(
      { id: this.id, roles: roles.map(role => role.id) },
      process.env.APP_SECRET
    );
  };

  return User;
};
