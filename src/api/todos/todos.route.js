const router = require('express').Router();

const todoMiddleware = require('./todos.middlware');
const todoController = require('./todos.controller');

/* router.route('/todos/').get(todoController); */
router.get('/', todoController.getAllTodos);

router.post('/add', todoController.addTodoItem);

router.put('/update/:taskId', todoMiddleware, todoController.updateTask);

router.delete('/delete/:taskId', todoMiddleware, todoController.deleteTask);

module.exports = router;
