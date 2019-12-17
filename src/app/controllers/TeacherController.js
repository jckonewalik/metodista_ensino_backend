const { Teacher } = require('../models');
class TeacherController {
  async store(req, res) {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      birthDate,
      UserId,
    } = req.body;
    try {
      const teacher = await Teacher.create({
        firstName,
        middleName,
        lastName,
        gender,
        birthDate,
        UserId,
      });
      return res.json({ teacher });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req, res) {
    const teachers = await Teacher.findAll({
      attributes: [
        'id',
        ['first_name', 'firstName'],
        ['middle_name', 'middleName'],
        ['last_name', 'lastName'],
      ],
    });
    return res.json({ teachers });
  }

  async show(req, res) {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res
        .status(204)
        .json({ mesage: `Não encontrado professor com o id: ${id}` });
    }
    return res.json({ teacher });
  }
}

module.exports = new TeacherController();
