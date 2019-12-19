const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.VIRTUAL,
      password_hash: DataTypes.STRING,
    },
    {
      hooks: {
        beforeSave: async user => {
          user.email = user.email.toLowerCase();
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8);
          }
        },
      },
    }
  );
  User.associate = function(models) {
    User.hasOne(models.Teacher);
    User.belongsToMany(models.Role, {
      through: 'user_role',
      as: 'roles',
      foreignKey: 'user_id',
    });
  };

  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password_hash);
  };
  User.prototype.generateToken = async function() {
    const roles = await this.getRoles();
    return jwt.sign(
      { id: this.id, roles: roles.map(role => role.id) },
      process.env.APP_SECRET
    );
  };

  return User;
};
