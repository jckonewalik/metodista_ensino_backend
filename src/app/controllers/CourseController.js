const { Course, Lesson, StudentsClass, sequelize } = require('../models');

class CourseController {
  async store(req, res) {
    const { lessons, ...data } = req.body;
    let transaction;
    try {
      transaction = await sequelize.transaction();

      let course = await Course.create(data, { transaction });

      for (const l in lessons) {
        await Lesson.create(
          {
            ...lessons[l],
            CourseId: course.id,
          },
          { transaction }
        );
      }

      transaction = await transaction.commit();
      course = await Course.findByPk(course.id, {
        include: [
          {
            model: Lesson,
            as: 'lessons',
            attributes: ['id', 'number', 'name'],
          },
        ],
      });
      return res.status(201).json({ course });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      const errorMessage =
        (error && error.errors && error.errors[0].message) || error.message;
      return res.status(400).json({ message: errorMessage });
    }
  }
  async update(req, res) {
    const { id } = req.params;
    const { lessons, ...data } = req.body;
    let transaction;
    try {
      transaction = await sequelize.transaction();

      await Course.update(data, { where: { id } }, { transaction });
      for (const l in lessons) {
        if (!lessons[l].id) {
          await Lesson.create(
            {
              ...lessons[l],
              CourseId: id,
            },
            { transaction }
          );
        }
      }
      transaction = await transaction.commit();
      const course = await Course.findByPk(id, {
        include: [
          {
            model: Lesson,
            as: 'lessons',
            attributes: ['id', 'number', 'name'],
          },
        ],
      });
      return res.json({ course });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      const errorMessage =
        (error && error.errors && error.errors[0].message) || error.message;
      return res.status(400).json({ message: errorMessage });
    }
  }
  async delete(req, res) {
    const { id } = req.params;
    try {
      const classes = await StudentsClass.findAll({ where: { CourseId: id } });
      if (classes.length > 0) {
        return res
          .status(400)
          .json({ message: 'O Curso está sendo usado, tente desativá-lo' });
      }

      await Course.destroy({ where: { id } });
      return res.status(200).json({ message: 'Curso removido com sucesso' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  async list(req, res) {
    const { active } = req.query;
    let where;

    if (active) {
      where = { where: { active: active === 'true' } };
    }
    const courses = await Course.findAll(where);
    return res.json({ courses });
  }
  async show(req, res) {
    const { id } = req.params;
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Lesson,
          as: 'lessons',
          attributes: ['id', 'number', 'name'],
        },
      ],
    });

    return res.json({ course });
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
