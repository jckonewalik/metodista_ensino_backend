const routes = require('express').Router();
const AttendanceController = require('./app/controllers/AttendanceController');
const SessionController = require('./app/controllers/SessionController');
const LessonController = require('./app/controllers/LessonController');
const CourseController = require('./app/controllers/CourseController');
const UserController = require('./app/controllers/UserController');
const TeacherController = require('./app/controllers/TeacherController');
const StudentsClassController = require('./app/controllers/StudentsClassController');
const StudentController = require('./app/controllers/StudentController');
const authMiddleware = require('./app/middlewares/auth');

routes.post('/sessions', SessionController.store);
routes.put('/users/reset-password', UserController.update);

routes.use(authMiddleware);

routes.get('/sessions', SessionController.show);

routes.post('/attendances', AttendanceController.store);
routes.get('/attendances', AttendanceController.find);

routes.post('/users', UserController.store);

routes.delete('/lessons/:id', LessonController.delete);

routes.post('/teachers', TeacherController.store);
routes.get('/teachers', TeacherController.list);
routes.get('/teachers/:id', TeacherController.show);

routes.get('/students-classes', StudentsClassController.list);
routes.get('/students-classes/:id', StudentsClassController.show);

routes.post('/students-classes', StudentsClassController.store);
routes.put('/students-classes/:id', StudentsClassController.update);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.list);
routes.delete('/students/:id', StudentController.delete);
routes.put('/students/:id', StudentController.update);

routes.get('/courses', CourseController.list);
routes.get('/courses/:id', CourseController.show);
routes.put('/courses/:id', CourseController.update);
routes.delete('/courses/:id', CourseController.delete);
routes.get('/courses/:id/lessons', CourseController.listLessons);
routes.post('/courses', CourseController.store);

module.exports = routes;
