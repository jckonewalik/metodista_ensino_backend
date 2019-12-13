module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define(
    'Lesson',
    {
      number: DataTypes.INTEGER,
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    {}
  );
  Lesson.associate = function(models) {
    Lesson.belongsTo(models.Course, {
      as: 'course',
      constraints: true,
    });
  };
  return Lesson;
};
