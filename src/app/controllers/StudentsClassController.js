const { StudentsClass, Teacher } = require('../models');
const { sequelize } = require('../models');
class StudentsClassController {
  async store(req, res) {
    const { teachers, ...data } = req.body;
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const studentsClass = await StudentsClass.create(data, { transaction });
      if (teachers && teachers.length > 0) {
        await studentsClass.addTeachers(
          teachers.map(teacher => teacher.id),
          { transaction }
        );
      }
      await transaction.commit();
      return res.json({ studentsClass });
    } catch (error) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { teachers, ...data } = req.body;
    let transaction;
    try {
      transaction = await sequelize.transaction();
      let studentsClass = await StudentsClass.findByPk(id);
      if (!studentsClass) {
        return res
          .status(204)
          .json({ message: `A turma com id ${id} não existe` });
      }
      await studentsClass.update(data, { transaction });
      if (teachers && teachers.length > 0) {
        await studentsClass.setTeachers(
          teachers.map(teacher => teacher.id),
          { transaction }
        );
      }
      await transaction.commit();
      studentsClass = await StudentsClass.findByPk(id, {
        include: [
          {
            model: Teacher,
            as: 'teachers',
            attributes: ['id', 'firstName', 'lastName'],
            through: { attributes: [] },
          },
        ],
      });
      return res.json({ studentsClass });
    } catch (error) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new StudentsClassController();
