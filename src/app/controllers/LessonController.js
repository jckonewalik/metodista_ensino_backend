const { Lesson } = require('../models');

class LessonController {
  async show(req, res) {
    const { active } = req.query;
    let where;

    if (active) {
      where = { where: { active: active === 'true' } };
    }
    const lessons = await Lesson.findAll(where);
    return res.json({ lessons });
  }

  async store(req, res) {
    const { number, name, active, CourseId } = req.body;

    if (!CourseId) {
      return res.status(401).json({ message: 'Informe o curso dessa lição' });
    }

    if (await Lesson.findOne({ where: { number, CourseId } })) {
      return res
        .status(401)
        .json({ message: `A lição ${number} já foi cadastrada nesse curso` });
    }
    try {
      const lesson = await Lesson.create({ number, name, active, CourseId });
      return res.json({ lesson });
    } catch (error) {
      return res.status(401).json({ message: `${error.message}` });
    }
  }
}

module.exports = new LessonController();
