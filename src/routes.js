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

routes.use(authMiddleware);

routes.post('/attendances', AttendanceController.store);

routes.post('/users', UserController.store);

routes.get('/lessons', LessonController.list);
routes.post('/lessons', LessonController.store);

routes.post('/teachers', TeacherController.store);
routes.get('/teachers', TeacherController.list);
routes.get('/teachers/:id', TeacherController.show);

routes.get('/students-classes', StudentsClassController.list);
routes.get('/students-classes/:id', StudentsClassController.show);

routes.post('/students-classes', StudentsClassController.store);
routes.put('/students-classes/:id', StudentsClassController.update);

routes.post('/students', StudentController.store);

routes.get('/courses', CourseController.show);
routes.get('/courses/:id/lessons', CourseController.listLessons);
routes.post('/courses', CourseController.store);

module.exports = routes;
