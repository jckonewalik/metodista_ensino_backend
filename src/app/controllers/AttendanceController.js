const { Attendance, AttendanceAppointment, Teacher, Lesson, Student } = require('../models');
const { sequelize, Sequelize } = require('../models');
class AttendanceController {
  async find(req, res) {
    const Op = Sequelize.Op;
    const { date, StudentsClassId } = req.query;

    if (!date || !StudentsClassId) {
      return res.status(400).json({ message: 'Informe a data e a classe da busca' });
    }

    const dateStart = new Date(date);
    if (isNaN(dateStart.getTime())) {
      return res.status(400).json({ message: 'Infome uma data valida para busca' });
    }

    let dateEnd = new Date(dateStart);
    dateEnd = dateEnd.setDate(dateEnd.getDate() + 1);
    const attendance = await Attendance.findOne({
      include: [
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
    if (attendance) {
      return res.status(200).json(attendance);
    } else {
      return res.status(204).json({ message: "Nenhuma chamada realizada nessa data" })
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
