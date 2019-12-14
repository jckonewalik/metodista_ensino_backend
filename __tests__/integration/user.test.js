const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'João',
        email: 'jckonewalik@gmail.com',
        password: '123123',
      });
    expect(response.status).toBe(200);
  });
});
