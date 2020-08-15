const router = require('express').Router();
const { validate } = require('express-validation');

const authController = require('./auth.controller');
const paramValidation = require('../../config/param-validation');

router
  .route('/register')
  .post(validate(paramValidation.createUser, {}, {}), authController.register);

module.exports = router;