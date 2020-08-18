const router = require('express').Router();
const { validate } = require('express-validation');

const todoMiddleware = require('./todos.middlware');
const todoController = require('./todos.controller');
const paramValidation = require('../../config/param-validation');

router.get('/', todoController.cacheRedisCheck, todoController.getAllTodos);

router.post(
  '/',
  validate(paramValidation.addNewTask, {}, {}),
  todoController.addTodoItem
);

router.put(
  '/:taskId',
  validate(paramValidation.updateTask, {}, { abortEarly: false }),
  todoMiddleware,
  todoController.updateTask
);

router.delete(
  '/:taskId',
  validate(paramValidation.updateTask, {}, {}),
  todoMiddleware,
  todoController.deleteTask
);

module.exports = router;
