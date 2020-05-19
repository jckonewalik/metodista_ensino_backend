const repository = require('../respositories/AttendanceRepository');

const findAttendance = async ({ StudentsClassId, date }) => {
  let dateStart = new Date(date);
  if (isNaN(dateStart.getTime())) {
    throw new Error('Infome uma data valida para busca');
  }
  dateStart = new Date(dateStart.toDateString());

  let dateEnd = new Date(dateStart);
  dateEnd = dateEnd.setDate(dateEnd.getDate() + 1);

  try {
    const attendances = await repository.findAttendancesByStudentsClassAndDate({ StudentsClassId, dateStart, dateEnd });
    return attendances && attendances[0];
  } catch (erro) {
    throw new Error(erro);
  }
}

module.exports = { findAttendance };