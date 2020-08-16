const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const config = require('../../config');
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
    return next(new APIError('No token found', httpStatus.BAD_REQUEST));
  }

  jwt.verify(token, config.jwtSecret, function (error, decoded) {
    if (error) {
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
        return next(
          new APIError('User removed from system', httpStatus.BAD_REQUEST)
        );
      });
  });
};
