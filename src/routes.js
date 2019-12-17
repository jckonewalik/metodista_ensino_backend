const routes = require('express').Router();
const SessionController = require('./app/controllers/SessionController');
const LessonController = require('./app/controllers/LessonController');
const CourseController = require('./app/controllers/CourseController');
const UserController = require('./app/controllers/UserController');
const TeacherController = require('./app/controllers/TeacherController');
const StudentsClassController = require('./app/controllers/StudentsClassController');

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.get('/lessons', LessonController.list);
routes.post('/lessons', LessonController.store);

routes.post('/teachers', TeacherController.store);
routes.get('/teachers', TeacherController.list);
routes.get('/teachers/:id', TeacherController.show);

routes.post('/students-classes', StudentsClassController.store);

routes.get('/courses', CourseController.show);
routes.post('/courses', CourseController.store);
module.exports = routes;
