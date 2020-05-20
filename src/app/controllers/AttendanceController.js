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
    try {
      const attendance = await service.saveOrUpdate({
        Lesson,
        StudentsClassId,
        Teacher,
        appointments,
        date,
        id
      });
      return res.status(201).json({ attendance });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AttendanceController();
