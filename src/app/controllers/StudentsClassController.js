const { StudentsClass, Teacher, Student } = require('../models');
const { sequelize } = require('../models');
class StudentsClassController {
  async store(req, res) {
    const { teachers, students, ...data } = req.body;
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const studentsClass = await StudentsClass.create(data, { transaction });
      if (teachers && teachers.length > 0) {
        await studentsClass.addTeachers(
          teachers.map(teacher => teacher.id),
          { transaction }
        );
      }
      if (students && students.length > 0) {
        await studentsClass.addStudents(
          students.map(student => student.id),
          { transaction }
        );
      }
      transaction = await transaction.commit();
      const classStudents = await studentsClass.getStudents();
      return res.status(201).json({
        studentsClass: {
          ...studentsClass.dataValues,
          amountOfStudents: classStudents.length,
        },
      });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      return res.status(400).json({ message: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const studentsClass = await StudentsClass.findByPk(id, {
      include: [
        {
          model: Teacher,
          as: 'teachers',
          attributes: ['id', 'firstName', 'lastName'],
          through: { attributes: [] },
        },
        {
          model: Student,
          as: 'students',
          attributes: ['id', 'firstName', 'lastName'],
          through: { attributes: [] },
        },
      ],
    });

    if (!studentsClass) {
      return res.status(204).send();
    }

    return res.json({ studentsClass });
  }

  async list(req, res) {
    const { userId } = req;
    const teacher = await Teacher.findOne({
      where: { UserId: userId },
      attributes: [],
      include: [
        {
          as: 'classes',
          model: StudentsClass,
          attributes: ['id', 'name', 'description'],
          include: [
            {
              model: Student,
              as: 'students',
              attributes: ['id'],
              through: { attributes: [] },
            },
          ],
          where: { active: true },
          through: { attributes: [] },
        },
      ],
    });
    if (!teacher || teacher.classes.length < 1) {
      return res.status(204).send();
    }
    return res.json({
      studentsClasses: teacher.classes.map(studentClass => ({
        id: studentClass.id,
        name: studentClass.name,
        description: studentClass.description,
        amountOfStudents: studentClass.students.length,
      })),
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const { teachers, students, ...data } = req.body;
    let studentsClass = await StudentsClass.findByPk(id);
    if (!studentsClass) {
      return res.status(204).send();
    }

    let transaction;
    try {
      transaction = await sequelize.transaction();
      await studentsClass.update(data, { transaction });
      if (teachers) {
        await studentsClass.setTeachers(
          teachers.map(teacher => teacher.id),
          { transaction }
        );
      }
      if (students) {
        await studentsClass.setStudents(
          students.map(student => student.id),
          { transaction }
        );
      }
      transaction = await transaction.commit();
      studentsClass = await StudentsClass.findByPk(id, {
        include: [
          {
            model: Teacher,
            as: 'teachers',
            attributes: ['id', 'firstName', 'lastName'],
            through: { attributes: [] },
          },
          {
            model: Student,
            as: 'students',
            attributes: ['id', 'firstName', 'lastName'],
            through: { attributes: [] },
          },
        ],
      });
      return res.json({ studentsClass });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new StudentsClassController();
