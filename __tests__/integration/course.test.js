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
      .set('Authorization', 'Bearer Test')
      .send({
        name: 'Fundamentos da Fé',
        active: true,
        lessons: [
          {
            number: 1,
            name: 'Lição 1',
          },
        ],
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('course');
    const created = response.body.course;
    expect(created).toHaveProperty('lessons');
    expect(created.lessons.length).toBe(1);
  });
  it('should not create a course with same name', async () => {
    const course1 = await Course.create({ name: 'Curso 1', active: true });
    const response = await request(app)
      .post('/courses')
      .set('Authorization', 'Bearer Test')
      .send({ name: course1.name, active: true });
    expect(response.status).toBe(400);
  });
  it('should access courses get endpoint', async () => {
    const response = await request(app)
      .get('/courses')
      .set('Authorization', 'Bearer Test');
    expect(response.status).toBe(200);
  });
  it('should return the course with theirs lessons when request with id', async () => {
    const course1 = await Course.create({ name: 'CDV', active: true });
    const response = await request(app)
      .get(`/courses/${course1.id}`)
      .set('Authorization', 'Bearer Test');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('course');
    const { course } = response.body;
    expect(course).toHaveProperty('lessons');
  });
  it('should return a list of active courses', async () => {
    await Course.create({ name: 'CDV', active: true });
    await Course.create({
      name: 'Fundamentos da Fé',
      active: false,
    });
    const response = await request(app)
      .get('/courses')
      .set('Authorization', 'Bearer Test')
      .query({ active: 'true' });
    const { courses } = response.body;
    expect(courses.length).toBe(1);
  });

  it('should update a course passing id as parameter', async () => {
    const newCourse = await Course.create({
      name: 'CDV',
      active: true,
    });

    const response = await request(app)
      .put(`/courses/${newCourse.id}`)
      .set('Authorization', 'Bearer Test')
      .send({ active: false, lessons: [{ number: 1, name: 'Lição 1' }] });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('course');
    const { course } = response.body;
    expect(course).toHaveProperty('lessons');
    expect(course.active).not.toBe(newCourse.active);
  });

  it('should return a list of lessons passing id of course', async () => {
    const course = await Course.create({
      name: 'CDV',
      active: true,
    });
    await factory.create('Lesson', { CourseId: course.id });
    await factory.create('Lesson', {
      number: 2,
      CourseId: course.id,
    });

    const response = await request(app)
      .get(`/courses/${course.id}/lessons`)
      .set('Authorization', 'Bearer Test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('lessons');
  });

  it('should delete a course passing the id as parameter', async () => {
    const course = await Course.create({ name: 'Fundamentos', active: true });
    const response = await request(app)
      .delete(`/courses/${course.id}`)
      .set('Authorization', 'Bearer Test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Curso removido com sucesso');
  });
});
