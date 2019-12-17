const { StudentsClass, TeacherStudentsClass } = require('../models');

class StudentsClassController {
  async store(req, res) {
    const { name, description, active, CourseId } = req.body;
    try {
      const studentsClass = await StudentsClass.create({
        name,
        description,
        active,
        CourseId,
      });
      return res.json({ studentsClass });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { description, active, teachers } = req.body;

    const studentsClass = await StudentsClass.findByPk(id);
    if (!studentsClass) {
      return res
        .status(204)
        .json({ message: `A turma com id ${id} não existe` });
    }
    await studentsClass.update({ description, active });
    return res.json({ studentsClass });
  }
}

module.exports = new StudentsClassController();
