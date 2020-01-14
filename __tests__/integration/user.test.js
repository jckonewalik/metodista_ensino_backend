const request = require('supertest');
const app = require('../../src/app');
const { Role } = require('../../src/app/models');
const truncate = require('../utils/truncate');
const factory = require('../factories');
const auth = require('../../src/firebase/firebase.utils');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should create a new user', async () => {
    const user1 = await factory.create('User');
    const role = await Role.create({
      id: 'ROLE_ADMIN',
      description: 'Administrator',
    });
    await user1.setRoles([role]);
    const token = await user1.generateToken();
    jest
      .spyOn(auth, 'createUserWithEmailAndPassword')
      .mockImplementation(() => Promise.resolve({}));
    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'João',
        email: 'jckonewalik@gmail.com',
        password: '123123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
  });
  it('should not create a new user with same email', async () => {
    const user1 = await factory.create('User');
    const role = await Role.create({
      id: 'ROLE_ADMIN',
      description: 'Administrator',
    });
    await user1.setRoles([role]);
    const token = await user1.generateToken();
    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'João',
        email: user1.email,
      });
    expect(response.status).toBe(400);
  });
  it('should not create a new user without admin permissions', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer Test')
      .send({
        name: 'João',
        email: 'jckonewalik@gmail.com',
      });
    expect(response.status).toBe(401);
  });
});
