const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');
const factory = require('../factories');
describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer Test')
      .send({
        name: 'João',
        email: 'jckonewalik@gmail.com',
        password: '123123',
      });
    const { user } = response.body;
    const newUser = await User.findByPk(user.id);

    expect(response.status).toBe(200);
    expect(newUser).not.toBe(undefined);
  });
  it('should not create a new user with same email', async () => {
    const user1 = await factory.create('User');
    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer Test')
      .send({
        name: 'João',
        email: user1.email,
        password: '123123',
      });
    expect(response.status).toBe(400);
  });
});
