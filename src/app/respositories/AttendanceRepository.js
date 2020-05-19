const { Attendance, AttendanceAppointment, Teacher, Lesson, Student, StudentsClass } = require('../models');
const { sequelize, Sequelize } = require('../models');

const Op = Sequelize.Op;

const findAttendancesByStudentsClassAndDate = async ({ StudentsClassId, dateStart, dateEnd }) => {
  const attendances = await Attendance.findAll({
    attributes: ['id', 'date', ['students_class_id', 'StudentsClassId']],
    include: [
      {
        model: StudentsClass,
        attributes: [],
        where: {
          id: StudentsClassId
        }
      },
      {
        model: Teacher,
        attributes: ['id', ['first_name', 'name']]
      },
      {
        model: Lesson,
        attributes: ['id', 'name']
      },
      {
        model: AttendanceAppointment,
        as: 'appointments',
        attributes: ['id', 'status'],
        include: [
          {
            model: Student,
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      }
    ],
    where: {
      date: {
        [Op.and]: {
          [Op.gte]: dateStart,
          [Op.lt]: dateEnd
        }
      }
    }
  });
  return attendances;
}

module.exports = { findAttendancesByStudentsClassAndDate };