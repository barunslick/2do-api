const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const config = require('../../config');
const logger = require('../../loader/logger');
const APIError = require('../helpers/APIError');
const dbHelper = require('../helpers/database');

module.exports = function (req, res, next) {
  let token;

  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.info('No token found in request');

    return next(new APIError('No token found', httpStatus.BAD_REQUEST));
  }

  jwt.verify(token, config.jwtSecret, function (error, decoded) {
    if (error) {
      logger.info('Token verification error.');

      return next(
        new APIError(
          'Token verification error',
          httpStatus.INTERNAL_SERVER_ERROR
        )
      );
    }

    const fieldToSearchBy = 'id';

    dbHelper
      .fetchUser(fieldToSearchBy, decoded.id)
      .then(function (result) {
        req.user = result;
        next();
      })
      .catch(function () {
        logger.info('User removed from system.');

        return next(
          new APIError('User removed from system', httpStatus.BAD_REQUEST)
        );
      });
  });
};
