const { Lesson } = require('../models');

class LessonController {
  async list(req, res) {
    const { active } = req.query;
    let where;

    if (active) {
      where = { active: active === 'true' };
    }
    const lessons = await Lesson.findAll({
      where,
      attributes: ['id', 'number', 'name'],
    });
    return res.json({ lessons });
  }

  async store(req, res) {
    const { CourseId, number, ...data } = req.body;

    if (!CourseId) {
      return res.status(400).json({ message: 'Informe o curso dessa lição' });
    }

    if (await Lesson.findOne({ where: { number, CourseId } })) {
      return res
        .status(400)
        .json({ message: `A lição ${number} já foi cadastrada nesse curso` });
    }
    try {
      const lesson = await Lesson.create({ ...data, number, CourseId });
      return res.json({ lesson });
    } catch (error) {
      return res.status(400).json({ message: `${error.message}` });
    }
  }
}

module.exports = new LessonController();
