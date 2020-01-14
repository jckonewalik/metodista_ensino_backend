module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    number: DataTypes.INTEGER,
    name: DataTypes.STRING,
  });
  Lesson.associate = function(models) {
    Lesson.belongsTo(models.Course);
  };
  return Lesson;
};
