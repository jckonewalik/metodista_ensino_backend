const truncate = require('../utils/truncate');
const request = require('supertest');
const app = require('../../src/app');
const factory = require('../factories');
const { Course } = require('../../src/app/models');
describe('Attendance', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should save the attendance with their appointments', async () => {
    const user = await factory.create('User');
    const teacher = await factory.create('Teacher', { UserId: user.id });
    const course = await Course.create({ name: 'Fundamentos', active: true });
    const lesson = await factory.create('Lesson', { CourseId: course.id });
    const student1 = await factory.create('Student');
    const student2 = await factory.create('Student');
    const student3 = await factory.create('Student');

    const studentsClass = await factory.create('StudentsClass', {
      CourseId: course.id,
    });
    const response = await request(app)
      .post('/attendances')
      .send({
        date: '2019-12-23',
        StudentsClassId: studentsClass.id,
        TeacherId: teacher.id,
        LessonId: lesson.id,
        appointments: [
          {
            StudentId: student1.id,
            status: true,
          },
          {
            StudentId: student2.id,
            status: true,
          },
          {
            StudentId: student3.id,
            status: false,
          },
        ],
      })
      .set('Authorization', 'Bearer Test');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('attendance');
  });
});
