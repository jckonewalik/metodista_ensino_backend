const { Lesson } = require('../models');

class LessonController {
  async delete(req, res) {
    const { id } = req.params;
    try {
      await Lesson.destroy({ where: { id } });
      return res.status(200).json({ message: 'Lição removida com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new LessonController();
