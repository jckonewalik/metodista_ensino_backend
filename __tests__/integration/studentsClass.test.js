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
  it('should update the students class with the teachers list', async () => {
    const user1 = await factory.create('User', {
      email: 'jckonewalik@gmail.com',
    });
    const user2 = await factory.create('User', {
      email: 'jckonewalik@hotmail.com',
    });
    const teacher1 = await factory.create('Teacher', { UserId: user1.id });
    const teacher2 = await factory.create('Teacher', { UserId: user2.id });

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
        description: myClass.description,
        active: !myClass.active,
        teachers: [teacher1, teacher2],
      });

    const { studentsClass } = response.body;

    expect(response.status).toBe(200);
    expect(studentsClass).not.toBe(undefined);
    expect(studentsClass.active).toBe(!myClass.active);
    // expect(studentsClass.teachers).toHaveLength(2);
  });
});
