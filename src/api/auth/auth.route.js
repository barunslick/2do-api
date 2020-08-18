const router = require('express').Router();
const { validate } = require('express-validation');

const authController = require('./auth.controller');
const paramValidation = require('../../config/param-validation');

router
  .route('/login')
  .post(
    validate(
      paramValidation.login,
      { keyByField: true },
      { abortEarly: false }
    ),
    authController.login
  );

router
  .route('/register')
  .post(
    validate(
      paramValidation.createUser,
      { keyByField: true },
      { abortEarly: false }
    ),
    authController.register
  );

module.exports = router;
