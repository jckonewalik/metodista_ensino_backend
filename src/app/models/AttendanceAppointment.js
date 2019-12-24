'use strict';
module.exports = (sequelize, DataTypes) => {
  const AttendanceAppointment = sequelize.define(
    'AttendanceAppointment',
    {
      status: DataTypes.BOOLEAN,
    },
    {}
  );
  AttendanceAppointment.associate = function(models) {
    AttendanceAppointment.belongsTo(models.Attendance);
    AttendanceAppointment.belongsTo(models.Student);
  };
  return AttendanceAppointment;
};
