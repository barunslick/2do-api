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

  // UPDATE /api/users/:userId
  /* updateUser: {
    body: Joi.object({
      username: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required(),
    }),
    params: Joi.object({
      userId: Joi.string().hex().required(),
    }),
  }, */

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
      taskId: Joi.string().regex(/^[0-9]*$/),
    }),
  },

  // DELETE /api/user/todos/delete/:taskId
  deleteTask: {
    params: Joi.object({
      params: Joi.object({
        taskId: Joi.string().regex(/^[0-9]*$/),
      }),
    }),
  },
};
