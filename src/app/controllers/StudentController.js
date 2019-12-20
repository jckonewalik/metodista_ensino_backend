const { Student } = require('../models');
class StudentController {
  async store(req, res) {
    const { ...data } = req.body;
    const student = await Student.create(data);

    return res.status(201).json({ student });
  }
}

module.exports = new StudentController();
