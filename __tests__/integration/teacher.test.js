const request = require('supertest');
const app = require('../../src/app');
const { Teacher } = require('../../src/app/models');
const factory = require('../factories');
describe('Teacher', () => {
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

    expect(newTeacher).not.toBe(null);
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
    expect(response.status).toBe(401);
  });
});
