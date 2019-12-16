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
      return res.status(401).json({ message: error.message });
    }
  }
}

module.exports = new TeacherController();
