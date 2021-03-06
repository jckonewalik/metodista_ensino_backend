const { Teacher, StudentsClass } = require('../models');
class TeacherController {
  async store(req, res) {
    const { UserId, ...data } = req.body;
    if (UserId) {
      const teacher = await Teacher.findOne({ where: { UserId } });
      if (teacher) {
        return res.status(400).send({
          message: 'O usuário informado já esta cadastrado como professor',
        });
      }
    }
    try {
      const teacher = await Teacher.create({ ...data, UserId });
      return res.status(201).json({ teacher });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req, res) {
    const teachers = await Teacher.findAll({
      attributes: [
        'id',
        ['first_name', 'firstName'],
        ['last_name', 'lastName'],
      ],
    });
    return res.json({ teachers });
  }

  async show(req, res) {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id, {
      include: [
        {
          model: StudentsClass,
          as: 'classes',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] },
        },
      ],
    });

    if (!teacher) {
      return res
        .status(204)
        .json({ mesage: `Não encontrado professor com o id: ${id}` });
    }
    return res.json({ teacher });
  }
}

module.exports = new TeacherController();
