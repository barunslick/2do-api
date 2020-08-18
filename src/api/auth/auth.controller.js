const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const config = require('../../config');
const logger = require('../../loader/logger');
const encrypt = require('../helpers/encrypt');
const decrypt = require('../helpers/decrypt');
const dbHelper = require('../helpers/database');
const APIError = require('../helpers/APIError');

/**
 * Function for creating a jwt token from given data.
 *
 * @param {*} data
 * @returns
 */
function createToken(data) {
  return jwt.sign(data, config.jwtSecret);
}

/**
 * Returns a jwt token if a valid user credential is provided.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function login(req, res, next) {
  const fieldToSearchBy = 'email';

  logger.info(`Incoming login request for: ${req.body.email}`);
  dbHelper
    .fetchUser(fieldToSearchBy, req.body.email)
    .then(function (result) {
      decrypt(req.body.password, result.password)
        .then(function (checkResult) {
          const data = {
            id: result.id,
            email: result.email,
          };

          if (checkResult) {
            const token = createToken(data);

            logger.info(`User logged on. email: ${req.body.email}`);

            res.json({
              user: data,
              token,
            });
          } else {
            logger.error(
              `Invalid credentials during login for: ${req.body.email}`
            );

            return next(
              new APIError('Invalid credentails', httpStatus.UNAUTHORIZED)
            );
          }
        })
        .catch(function (err) {
          logger.error(
            `Invalid credentials during login for: ${req.body.email}, error: ${err.message}`
          );

          return next(new APIError(err.msg, httpStatus.INTERNAL_SERVER_ERROR));
        });
    })
    .catch(function (err) {
      logger.error(
        `Failed login attempt for: ${req.body.email}, error: ${err.msg}`
      );

      return next(new APIError(err.msg, httpStatus.NOT_FOUND));
    });
}

/**
 * Creates a new user if valid credentails provided.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function register(req, res, next) {
  logger.info(`Incoming register request for: ${req.body.email}`);

  dbHelper
    .checkUserExists(req.body.email)
    .then(function () {
      encrypt(req.body.password)
        .then(function (result) {
          const details = {
            email: req.body.email,
            username: req.body.username,
            password: result.hashedPassword,
            type: 'user',
          };

          dbHelper
            .addnewUser(details)
            .then(function (result) {
              logger.info(
                `Added new user for email: ${req.body.email} and username: ${req.body.username}`
              );

              // Create a default personal list for user when user signs up.
              const listName = 'personal';

              const userId = result.sqlResult.insertId;

              dbHelper
                .createUserList(listName, userId)
                .then(function () {
                  logger.info(
                    `Created an empty personal list for ${req.body.email}`
                  );
                  res.json({
                    msg: 'Succesfully registeres new user.',
                  });
                })
                .catch(function (err) {
                  logger.info(
                    `Failed to create an empty list for ${req.body.email}, error: ${err.message}`
                  );

                  return next(
                    new APIError(err.message),
                    httpStatus.INTERNAL_SERVER_ERROR
                  );
                });
            })
            .catch(function (err) {
              logger.error(
                `Error while trying to set new user with  ${req.body.email} and username: ${req.body.username}, error:` +
                  err.msg
              );

              next(new APIError(err.msg, httpStatus.CONFLICT));
            });
        })
        .catch(function (err) {
          logger.error('Error while hashing password error:' + err.msg);

          return next(
            new APIError(
              'Error hashing password',
              httpStatus.INTERNAL_SERVER_ERROR,
              false
            )
          );
        });
    })
    .catch(function (err) {
      logger.error(
        `Error while trying to set new user with email:${req.body.email} and username: ${req.body.username}, error:` +
          err.msg
      );

      return next(new APIError(err.msg, httpStatus.CONFLICT));
    });
}

module.exports = {
  register,
  login,
};
