const { Course } = require('../models');
class CourseController {
  async store(req, res) {
    const { ...data } = req.body;
    try {
      const course = await Course.create(data);
      return res.status(201).json({ course });
    } catch (error) {
      return res.status(400).json({ message: error.errors[0].message });
    }
  }
  async show(req, res) {
    const { active } = req.query;
    let where;

    if (active) {
      where = { where: { active: active === 'true' } };
    }
    const courses = await Course.findAll(where);
    return res.json({ courses });
  }
}

module.exports = new CourseController();
