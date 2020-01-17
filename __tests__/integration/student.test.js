const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');
describe('Students', () => {
  beforeEach(async () => {
    try {
      await truncate();
    } catch (error) {
      console.log(error);
    }
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
  it('should returna a list of students when pass a string as query param', async () => {
    await factory.create('Student', { firstName: 'Joao' });
    await factory.create('Student', { firstName: 'Maria' });

    const response = await request(app)
      .get('/students?name=ma')
      .set('Authorization', 'Bearer Test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('students');
    expect(response.body.students.length).toBe(1);
  });
  it('should return with no content status when the string provided in query doesnt match with no students', async () => {
    await factory.create('Student', { firstName: 'Joao' });
    await factory.create('Student', { firstName: 'Maria' });

    const response = await request(app)
      .get('/students?name=asd')
      .set('Authorization', 'Bearer Test');

    expect(response.status).toBe(204);
  });

  it('should delete a student passing the id as parameter', async () => {
    const student = await factory.create('Student');
    const response = await request(app)
      .delete(`/students/${student.id}`)
      .set('Authorization', 'Bearer Test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Aluno removido com sucesso');
  });

  it('should update a student passing id as parameter', async () => {
    const newStudent = await factory.create('Student');

    const response = await request(app)
      .put(`/students/${newStudent.id}`)
      .set('Authorization', 'Bearer Test')
      .send({ firstName: 'Joao' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('student');
    const { student } = response.body;
    expect(student.firstName).not.toBe(newStudent.firstName);
  });
});
