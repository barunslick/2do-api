const Joi = require('joi');

module.exports = {
  // POST /api/auth/register
  createUser: {
    body: Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(5),
    }),
  },

  // POST /api/auth/login
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },

  // POST /api/user/todos/add
  addNewTask: {
    body: Joi.object({
      taskName: Joi.string().required(),
      taskDescription: Joi.string(),
      status: Joi.string().valid('COMPLETED', 'GOING').required(),
    }),
  },

  // POST /api/user/todos/update/:taskId
  updateTask: {
    body: Joi.object({
      taskName: Joi.string(),
      taskDescription: Joi.string(),
      status: Joi.string().valid('COMPLETED', 'GOING'),
    }),
    params: Joi.object({
      // express automatically changes params to string
      taskId: Joi.string().regex(/^[0-9]*$/),
    }),
  },

  // DELETE /api/user/todos/delete/:taskId
  deleteTask: {
    params: Joi.object({
      params: Joi.object({
        // express automatically changes params to string
        taskId: Joi.string().regex(/^[0-9]*$/),
      }),
    }),
  },
};
