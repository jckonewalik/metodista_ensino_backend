const routes = require('express').Router();
const SessionController = require('./app/controllers/SessionController');
const LessonController = require('./app/controllers/LessonController');
const CourseController = require('./app/controllers/CourseController');

routes.post('/sessions', SessionController.store);

routes.get('/lessons', LessonController.show);
routes.post('/lessons', LessonController.store);

routes.get('/courses', CourseController.show);
routes.post('/courses', CourseController.store);
module.exports = routes;
