'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    'Attendance',
    {
      date: DataTypes.DATE,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING
    },
    {}
  );
  Attendance.associate = function (models) {
    Attendance.belongsTo(models.StudentsClass);
    Attendance.belongsTo(models.Teacher);
    Attendance.belongsTo(models.Lesson);
    Attendance.hasMany(models.AttendanceAppointment, { as: 'appointments' });
  };
  return Attendance;
};
