const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const { Lesson, Course } = require('../../src/app/models');
const factory = require('../factories');

describe('Lessons', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should delete a lessons passing the id as parameter', async () => {
    const course = await Course.create({ name: 'Fundamentos', active: true });
    const lesson = await factory.create('Lesson', { CourseId: course.id });

    const response = await request(app)
      .delete(`/lessons/${lesson.id}`)
      .set('Authorization', 'Bearer Test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Lição removida com sucesso');
  });
});
