const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const { Role, Course, StudentsClass } = require('../../src/app/models');
const factory = require('../factories');
describe('Students Class', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should get the student class when pass the id as parameter', async () => {
    const user1 = await factory.create('User');
    const teacher1 = await factory.create('Teacher', { UserId: user1.id });
    const student1 = await factory.create('Student');
    const student2 = await factory.create('Student');
    const student3 = await factory.create('Student');

    const course = await Course.create({
      name: 'Fundamentos da Fé',
      active: true,
    });
    const newClass = await StudentsClass.create({
      name: 'Class 1',
      description: 'Class 1 Description',
      CourseId: course.id,
    });
    await newClass.addStudents([student1, student2, student3]);
    await newClass.addTeachers([teacher1]);

    const response = await request(app)
      .get(`/students-classes/${newClass.id}`)
      .set('Authorization', 'Bearer Test');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('studentsClass');
    const { studentsClass } = response.body;
    expect(studentsClass).toHaveProperty('students');
    expect(studentsClass.students).toHaveLength(3);
    expect(studentsClass).toHaveProperty('teachers');
    expect(studentsClass.teachers).toHaveLength(1);
  });

  it('should create a new class', async () => {
    const user1 = await factory.create('User');
    const teacher1 = await factory.create('Teacher', { UserId: user1.id });
    const student1 = await factory.create('Student');
    const student2 = await factory.create('Student');
    const student3 = await factory.create('Student');

    const course = await Course.create({
      name: 'Fundamentos da Fé',
      active: true,
    });
    const response = await request(app)
      .post('/students-classes')
      .set('Authorization', 'Bearer Test')
      .send({
        name: 'Fundamentos da Fé',
        description: '2° sem - 2019',
        active: true,
        CourseId: course.id,
        teachers: [teacher1],
        students: [student1, student2, student3],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('studentsClass');
    const { studentsClass } = response.body;
    expect(studentsClass.id).not.toBe(undefined);
    expect(studentsClass).toHaveProperty('amountOfStudents');
    expect(studentsClass.amountOfStudents).toBe(3);
  });

  it('should update class when pass the id', async () => {
    const user1 = await factory.create('User');
    const teacher1 = await factory.create('Teacher', { UserId: user1.id });
    const course = await Course.create({
      name: 'Fundamentos da Fé',
      active: true,
    });
    const myClass = await factory.create('StudentsClass', {
      CourseId: course.id,
    });
    const response = await request(app)
      .put(`/students-classes/${myClass.id}`)
      .set('Authorization', 'Bearer Test')
      .send({
        teachers: [teacher1],
      });
    const { studentsClass } = response.body;
    expect(studentsClass.teachers).toHaveLength(1);
  });

  it('should return an error when try update class that doesnt exists', async () => {
    const response = await request(app)
      .put('/students-classes/1')
      .set('Authorization', 'Bearer Test')
      .send({
        description: 'myClass.description',
        active: true,
      });

    expect(response.status).toBe(204);
  });

  it('should return a list containing just current users active classes', async () => {
    const role = await Role.create({
      id: 'ROLE_ADMIN',
      description: 'Administrator',
    });
    const user = await factory.create('User');
    await user.setRoles([role]);
    const teacher = await factory.create('Teacher', { UserId: user.id });
    const course = await Course.create({
      name: 'Fundamentos da Fé',
      active: true,
    });
    const class1 = await StudentsClass.create({
      name: 'Turma 1',
      description: 'Turma 1',
      active: true,
      CourseId: course.id,
    });
    await class1.setTeachers([teacher]);
    const class2 = await StudentsClass.create({
      name: 'Turma 2',
      description: 'Turma 2',
      active: false,
      CourseId: course.id,
    });
    await class2.setTeachers([teacher]);
    const class3 = await StudentsClass.create({
      name: 'Turma 3',
      description: 'Turma 3',
      active: true,
      CourseId: course.id,
    });
    const token = await user.generateToken();
    const response = await request(app)
      .get('/students-classes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('studentsClasses');
    expect(response.body.studentsClasses).toHaveLength(1);
  });
});
