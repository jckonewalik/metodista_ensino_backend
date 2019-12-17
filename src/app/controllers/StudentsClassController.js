const { StudentsClass } = require('../models');
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
      return res.status().json({ message: error.message });
    }
  }
}

module.exports = new StudentsClassController();
