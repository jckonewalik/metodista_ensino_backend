const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const { Course, StudentsClass } = require('../../src/app/models');
const factory = require('../factories');
describe('Students Class', () => {
  beforeEach(async () => {
    try {
      await truncate();
    } catch (error) {
      console.log(error);
    }
  });
  it('should create a new class', async () => {
    const user1 = await factory.create('User');
    const teacher1 = await factory.create('Teacher', { UserId: user1.id });
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
        teachers: [teacher1],
      });
    const created = response.body.studentsClass;
    const newClass = await StudentsClass.findOne({ where: { id: created.id } });

    expect(newClass).not.toBe(undefined);
  });

  it('should update class when pass the id', async () => {
    const user1 = await factory.create('User');
    const teacher1 = await factory.create('Teacher', { UserId: user1.id });
    const course = await Course.create({
      name: 'Fundamentos da Fé',
      active: true,
    });
    const myClass = await factory.create('StudentsClass', {
      CourseId: course.id,
    });
    const response = await request(app)
      .put(`/students-classes/${myClass.id}`)
      .send({
        teachers: [teacher1],
      });
    const { studentsClass } = response.body;
    expect(studentsClass.teachers).toHaveLength(1);
  });

  it('should return an error when try update class that doesnt exists', async () => {
    const response = await request(app)
      .put('/students-classes/1')
      .send({
        description: 'myClass.description',
        active: true,
      });

    expect(response.status).toBe(204);
  });
});
