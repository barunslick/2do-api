const router = require('express').Router();
const { validate } = require('express-validation');

const authController = require('./auth.controller');
const authMiddleware = require('./auth.middleware');
const paramValidation = require('../../config/param-validation');

router
  .route('/login')
  .post(validate(paramValidation.login, {}, {}), authController.login);

router
  .route('/register')
  .post(validate(paramValidation.createUser, {}, {}), authController.register);

module.exports = router;
