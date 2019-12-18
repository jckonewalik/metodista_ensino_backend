const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const { Teacher } = require('../../src/app/models');
const factory = require('../factories');
describe('Teacher', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should create a new teacher', async () => {
    const user = await factory.create('User');
    const response = await request(app)
      .post('/teachers')
      .send({
        birthDate: '1991-06-19',
        firstName: 'João Carlos',
        gender: 'male',
        lastName: 'de Souza',
        middleName: 'Konewalik',
        UserId: user.id,
      });
    const created = response.body.teacher;
    const newTeacher = await Teacher.findOne({ where: { id: created.id } });

    expect(newTeacher).not.toBe(undefined);
  });

  it('should not create a new teacher without user', async () => {
    const response = await request(app)
      .post('/teachers')
      .send({
        birthDate: '1991-06-19',
        firstName: 'João Carlos',
        gender: 'male',
        lastName: 'de Souza',
        middleName: 'Konewalik',
      });
    expect(response.status).toBe(400);
  });

  it('should not create a two teachers with the same user', async () => {
    const user = await factory.create('User');
    await factory.create('Teacher', { UserId: user.id });
    const response = await request(app)
      .post('/teachers')
      .send({
        birthDate: '1991-06-19',
        firstName: 'João Carlos',
        gender: 'male',
        lastName: 'de Souza',
        middleName: 'Konewalik',
        UserId: user.id,
      });

    expect(response.status).toBe(400);
  });

  it('should return a list of teachers', async () => {
    const response = await request(app).get('/teachers');
    expect(response.status).toBe(200);
  });

  it('should return a teacher when pass the id as parameter', async () => {
    const user = await factory.create('User');
    const newTeacher = await factory.create('Teacher', { UserId: user.id });
    const response = await request(app).get(`/teachers/${newTeacher.id}`);

    const { teacher } = response.body;
    expect(response.status).toBe(200);
    expect(teacher.name).toBe(newTeacher.name);
    expect(teacher).toHaveProperty('classes');
  });

  it('should return not content status when pass and id that not exists', async () => {
    const response = await request(app).get(`/teachers/1`);
    expect(response.status).toBe(204);
  });
});
