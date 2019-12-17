const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const { Course, StudentsClass } = require('../../src/app/models');
const factory = require('../factories');
describe('Students Class', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create a new class', async () => {
    const course = await Course.create({
      name: 'Fundamentos da Fé',
      active: true,
    });
    const response = await request(app)
      .post('/students-classes')
      .send({
        name: 'Fundamentos da Fé',
        description: '2° sem - 2019',
        active: true,
        CourseId: course.id,
      });
    const created = response.body.studentsClass;
    const newClass = await StudentsClass.findOne({ where: { id: created.id } });

    expect(newClass).not.toBe(null);
  });
});
