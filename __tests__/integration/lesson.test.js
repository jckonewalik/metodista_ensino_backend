const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const { Lesson } = require('../../src/app/models');
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
    const course = await factory.create('Course');
    const sin = await factory.create('Lesson');
    await sin.setCourse(course);

    const repentance = await factory.create('Lesson', {
      number: 2,
      name: 'Arrependimento',
      active: false,
    });
    await repentance.setCourse(course);

    const response = await request(app).get('/lessons');
    expect(response.body.lessons).toHaveLength(1);
  });

  it('should include a new lesson', async () => {
    const course = await factory.create('Course');
    const response = await request(app)
      .post('/lessons')
      .send({
        number: 1,
        name: 'Batismo',
        active: true,
        courseId: course.id,
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
});
