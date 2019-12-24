const { Course, Lesson } = require('../models');
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

  async listLessons(req, res) {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(204).send();
    }
    const lessons = await course.getLessons();
    return res.json({ lessons });
  }
}

module.exports = new CourseController();
