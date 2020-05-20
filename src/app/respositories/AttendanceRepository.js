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

const save = async (attendance) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const savedAttendance = await Attendance.create(
      {
        date: attendance.date,
        StudentsClassId: attendance.StudentsClassId,
        TeacherId: attendance.Teacher.id,
        LessonId: attendance.Lesson && attendance.Lesson.id,
      },
      { transaction }
    );

    for (const x in attendance.appointments) {
      const { Student, status } = attendance.appointments[x];
      await AttendanceAppointment.create(
        {
          AttendanceId: savedAttendance.id,
          StudentId: Student && Student.id,
          status,
        },
        { transaction }
      );
    }

    transaction = await transaction.commit();
    return savedAttendance;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw new Error('Erro ao salvar a chamada');
  }
}

const update = async (attendance) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const updatedAttendances = await Attendance.update(
      {
        TeacherId: attendance.Teacher.id,
        LessonId: attendance.Lesson && attendance.Lesson.id,
      },
      {
        where: { id: attendance.id }
      },
      { transaction }
    );

    const newAppointments = attendance.appointments.filter(a => !a.id);
    const updatedAppointments = attendance.appointments.filter(a => a.id);

    for (const x in newAppointments) {
      const { Student, status } = newAppointments[x];
      await AttendanceAppointment.create(
        {
          AttendanceId: attendance.id,
          StudentId: Student && Student.id,
          status,
        },
        { transaction }
      );
    }

    for (const x in updatedAppointments) {
      const { status } = updatedAppointments[x];
      await AttendanceAppointment.update(
        {
          status,
        },
        {
          where: { id: updatedAppointments[x].id }
        },
        { transaction }
      );
    }

    transaction = await transaction.commit();
    return updatedAttendances;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw new Error('Erro ao salvar a chamada');
  }
}

module.exports = { findAttendancesByStudentsClassAndDate, save, update };