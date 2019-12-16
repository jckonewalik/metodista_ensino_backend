const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const { Lesson, Course } = require('../../src/app/models');
const factory = require('../factories');

describe('Lessons', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should access lesson get endpoint', async () => {
    const response = await request(app).get('/lessons');
    expect(response.status).toBe(200);
  });

  it('should return a list of active lessons', async () => {
    const course = await Course.create({ name: 'Fundamentos', active: true });
    await factory.create('Lesson', { CourseId: course.id });

    await factory.create('Lesson', {
      number: 2,
      name: 'Arrependimento',
      active: false,
      CourseId: course.id,
    });

    const response = await request(app)
      .get('/lessons')
      .query({ active: 'true' });

    const { lessons } = response.body;
    expect(lessons.length).toBe(1);
  });

  it('should include a new lesson', async () => {
    const course = await Course.create({ name: 'Fundamentos', active: true });
    const response = await request(app)
      .post('/lessons')
      .send({
        number: 1,
        name: 'Batismo',
        active: true,
        CourseId: course.id,
      });
    const created = response.body.lesson;
    const lesson = await Lesson.findOne({ where: { id: created.id } });
    expect(lesson).not.toBe(null);
  });

  it('should throw an excepcion when include a new lesson without course', async () => {
    const response = await request(app)
      .post('/lessons')
      .send({
        number: 1,
        name: 'Batismo',
        active: true,
      });
    expect(response.status).toBe(401);
  });
  it('should not create a lesson with same number and course id', async () => {
    const course = await Course.create({ name: 'Fundamentos', active: true });
    await factory.create('Lesson', { CourseId: course.id });

    const response = await request(app)
      .post('/lessons')
      .send({
        number: 1,
        name: 'Batismo',
        active: true,
        CourseId: course.id,
      });
    expect(response.status).toBe(401);
  });
  it('should return an error when create a lesson with reference an course that doesnt exists', async () => {
    const response = await request(app)
      .post('/lessons')
      .send({
        number: 1,
        name: 'Batismo',
        active: true,
        CourseId: 1,
      });
    expect(response.status).toBe(401);
  });
});
