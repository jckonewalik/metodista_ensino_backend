const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const { Student } = require('../../src/app/models');
const factory = require('../factories');
describe('Students', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should create a new student', async () => {
    const response = await request(app)
      .post('/students')
      .set('Authorization', 'Bearer Test')
      .send({
        birthDate: '1991-06-19',
        firstName: 'João Carlos',
        gender: 'male',
        lastName: 'Konewalik de Souza',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('student');
    const { student } = response.body;
    expect(student.id).not.toBe(undefined);
  });
});
