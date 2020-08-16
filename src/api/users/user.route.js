const router = require('express').Router();

const todos = require('../todos/todos.route');
const authMiddleware = require('../auth/auth.middleware');

// Dynamic routing is not used as it wouldnt make sense for a todo app.
router.use('/todos', authMiddleware, todos);

module.exports = router;
