const { Student } = require('../models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

class StudentController {
  async store(req, res) {
    const { ...data } = req.body;
    const student = await Student.create(data);

    return res.status(201).json({ student });
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      await Student.destroy({ where: { id } });
      return res.status(200).json({ message: 'Aluno removido com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req, res) {
    const { page = 0, pageSize = 20 } = req.query;
    let { name = '' } = req.query;
    name = name.toLowerCase();

    const offset = page * pageSize;
    const limit = pageSize;

    const students = await Student.findAll({
      limit,
      offset,
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC'],
      ],
      where: {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('first_name')), {
            [Op.like]: `%${name}%`,
          }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('last_name')), {
            [Op.like]: `%${name}%`,
          }),
        ],
      },
    });
    if (students.length) {
      return res.status(200).json({ students });
    } else {
      return res.status(204).send();
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { ...data } = req.body;

    try {
      await Student.update(data, { where: { id } });
      const student = await Student.findByPk(id);
      return res.json({ student });
    } catch (error) {
      const errorMessage =
        (error && error.errors && error.errors[0].message) || error.message;
      return res.status(400).json({ message: errorMessage });
    }
  }
}

module.exports = new StudentController();
