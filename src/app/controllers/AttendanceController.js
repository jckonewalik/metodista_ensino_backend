const { Attendance, AttendanceAppointment, StudentsClass } = require('../models');
const { sequelize, Sequelize } = require('../models');
class AttendanceController {
  async find(req, res) {
    const Op = Sequelize.Op;
    const { date, StudentsClassId } = req.query;

    if (!date || !StudentsClassId) {
      return res.status(400).json({ message: 'Informe a data e a classe da busca'});
    }

    const dateStart = new Date(date);
    if (isNaN(dateStart.getTime())) {  
      return res.status(400).json({ message: 'Infome uma data valida para busca'});
    }
    
    let dateEnd = new Date(dateStart);
    dateEnd = dateEnd.setDate(dateEnd.getDate() + 1);
    const attendance = await Attendance.findOne({
      include: [
        {
          model: StudentsClass,
          where: {
            id: StudentsClassId
          }
        },
        {
          model: AttendanceAppointment,
          as: 'appointments'
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
      date,
      StudentsClassId,
      TeacherId,
      LessonId,
      appointments,
    } = req.body;

    if (!appointments || appointments.length < 1) {
      return res
        .status(400)
        .json({ message: 'Chamada sem registro de presença' });
    }

    if (!TeacherId) {
      return res.status(400).json({ message: 'Informe o professor da aula' });
    }

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const attendance = await Attendance.create(
        {
          date,
          StudentsClassId,
          TeacherId,
          LessonId,
        },
        { transaction }
      );

      for (const x in appointments) {
        const { StudentId, status } = appointments[x];
        await AttendanceAppointment.create(
          {
            AttendanceId: attendance.id,
            StudentId,
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
