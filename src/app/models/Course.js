module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  });
  Course.associate = function(models) {
    Course.hasMany(models.Lesson, { as: 'lessons' });
  };
  return Course;
};
