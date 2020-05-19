const { Attendance, AttendanceAppointment, Teacher, Lesson, Student } = require('../models');
const { sequelize, Sequelize } = require('../models');

const Op = Sequelize.Op;

const service = require('../services/AttendanceService');

class AttendanceController {
  async find(req, res) {
    const { date, StudentsClassId } = req.query;

    if (!date || !StudentsClassId) {
      return res.status(400).json({ message: 'Informe a data e a classe da busca' });
    }

    try {
      const attendance = await service.findAttendance({ StudentsClassId, date });
      if (attendance) {
        return res.status(200).json(attendance);
      } else {
        return res.status(204).json({ message: 'Nenhuma chamada encontrada' });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  async store(req, res) {
    const {
      Lesson,
      StudentsClassId,
      Teacher,
      appointments,
      date,
      id
    } = req.body;

    if (!appointments || appointments.length < 1) {
      return res
        .status(400)
        .json({ message: 'Chamada sem registro de presença' });
    }

    if (!Teacher) {
      return res.status(400).json({ message: 'Informe o professor da aula' });
    }

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const attendance = await Attendance.create(
        {
          date,
          StudentsClassId,
          TeacherId: Teacher.id,
          LessonId: Lesson && Lesson.id,
        },
        { transaction }
      );

      for (const x in appointments) {
        const { Student, status } = appointments[x];
        await AttendanceAppointment.create(
          {
            AttendanceId: attendance.id,
            StudentId: Student && Student.id,
            status,
          },
          { transaction }
        );
      }

      transaction = await transaction.commit();
      return res.status(201).json({ attendance });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AttendanceController();
