const routes = require('express').Router();
const SessionController = require('./app/controllers/SessionController');
const LessonController = require('./app/controllers/LessonController');
const CourseController = require('./app/controllers/CourseController');
const UserController = require('./app/controllers/UserController');
routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.get('/lessons', LessonController.show);
routes.post('/lessons', LessonController.store);

routes.get('/courses', CourseController.show);
routes.post('/courses', CourseController.store);
module.exports = routes;
