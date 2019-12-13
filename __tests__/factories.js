const { factory } = require('factory-girl');
const { Course, Lesson, User } = require('../src/app/models');
const faker = require('faker');

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email,
  password: faker.internet.password,
});

factory.define('Course', Course, {
  name: 'Fundamentos da Fé',
  active: true,
});

factory.define('Lesson', Lesson, {
  number: 1,
  name: 'Pecado',
  active: true,
});

module.exports = factory;
