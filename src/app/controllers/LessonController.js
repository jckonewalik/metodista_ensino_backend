const { Lesson } = require('../models');

class LessonController {
  async show(req, res) {
    const lessons = await Lesson.findAll({ where: { active: true } });
    return res.json({ lessons });
  }

  async store(req, res) {
    const { number, name, active, courseId } = req.body;
    if (!courseId) {
      res.status(401).json({ message: 'Informe o curso dessa lição' });
    }
    const lesson = await Lesson.create({ number, name, active });
    return res.json({ lesson });
  }
}

module.exports = new LessonController();
