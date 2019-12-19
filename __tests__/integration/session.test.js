const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');
const { User } = require('../../src/app/models');
describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User', { password: '123123' });
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123',
      });
    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid user', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'teste@teste.com.br',
        password: '123',
      });
    expect(response.status).toBe(400);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', { password: '123123' });
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123',
      });
    expect(response.status).toBe(400);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', { password: '123123' });
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123',
      });
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('token');
  });
});
