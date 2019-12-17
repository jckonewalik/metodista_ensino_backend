const { factory } = require('factory-girl');
const { Teacher, Lesson, User } = require('../src/app/models');
const faker = require('faker');

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Lesson', Lesson, {
  number: 1,
  name: 'Pecado',
  active: true,
});

factory.define('Teacher', Teacher, {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  gender: 'male',
  birthDate: faker.date.past(),
  // UserId: User.create({
  //   name: faker.name.findName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  // }).then(user => user.id),
});

module.exports = factory;
