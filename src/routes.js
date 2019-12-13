const routes = require('express').Router();
const { User } = require('./app/models');
const SessionController = require('./app/controllers/SessionController');
const LessonController = require('./app/controllers/LessonController');

User.create({ email: 'jckonewalik@gmail.com', password: '123', name: 'Joao' });

routes.post('/sessions', SessionController.store);

routes.get('/lessons', LessonController.show);
routes.post('/lessons', LessonController.store);
module.exports = routes;
