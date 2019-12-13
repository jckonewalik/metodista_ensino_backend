const { Lesson } = require('../models');

class LessonController {
  async show(req, res) {
    const lessons = await Lesson.findAll({ where: { active: true } });
    return res.json({ lessons });
  }

  async store(req, res) {
    const { number, name, active, courseId } = req.body;
    if (!courseId) {
      return res.status(401).json({ message: 'Informe o curso dessa lição' });
    }
    if (await Lesson.findOne({ where: { number, courseId } })) {
      return res
        .status(401)
        .json({ message: `A lição ${number} já foi cadastrada nesse curso` });
    }
    const lesson = await Lesson.create({ number, name, active, courseId });
    return res.json({ lesson });
  }
}

module.exports = new LessonController();
