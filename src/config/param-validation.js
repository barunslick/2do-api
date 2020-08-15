const Joi = require('joi');

module.exports = {
  // POST /api/auth/register
  createUser: {
    body: Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: Joi.object({
      username: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required(),
    }),
    params: Joi.object({
      userId: Joi.string().hex().required(),
    }),
  },

  // POST /api/auth/login
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
};
