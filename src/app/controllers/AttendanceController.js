const { Attendance, AttendanceAppointment } = require('../models');
const { sequelize } = require('../models');
class AttendanceController {
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
      return res
        .status(400)
        .json({ message: 'Informe o professor da aula' })
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
