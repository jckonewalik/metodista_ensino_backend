const request = require('supertest');
const app = require('../../src/app');
const factory = require('../factories');
const truncate = require('../utils/truncate');
const { Course } = require('../../src/app/models');
describe('Course', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should create a new course', async () => {
    const response = await request(app)
      .post('/courses')
      .send({ name: 'Fundamentos da Fé', active: true });
    const created = response.body.course;
    const course = await Course.findOne({ where: { id: created.id } });
    expect(course).not.toBe(null);
  });
  it('should access courses get endpoint', async () => {
    const response = await request(app).get('/courses');
    expect(response.status).toBe(200);
  });
  it('should return a list of active courses', async () => {
    const course1 = await Course.create({ name: 'CDV', active: true });
    const course2 = await Course.create({
      name: 'Fundamentos da Fé',
      active: false,
    });
    const response = await request(app)
      .get('/courses')
      .query({ active: 'true' });
    const { courses } = response.body;
    expect(courses.length).toBe(1);
  });
});
