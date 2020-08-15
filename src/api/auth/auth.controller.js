const jwt = require('jsonwebtoken');

const config = require('../../config');
const logger = require('../../loader/logger');
const encrypt = require('../helpers/encrypt');
const decrypt = require('../helpers/decrypt');
const dbHelper = require('../helpers/database');

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
  dbHelper
    .fetchUser(req.body.email)
    .then(function (result) {
      decrypt(req.body.password, result.password)
        .then(function (checkResult) {
          const data = {
            id: result.id,
            email: result.email,
          };

          if (checkResult) {
            const token = createToken(data);

            res.json({
              user: data,
              token,
            });
          } else {
            next({
              msg: 'Invalid login credentails',
            });
          }
        })
        .catch(function (checkError) {
          next({
            msg: checkError.msg,
          });
        });
    })
    .catch(function (error) {
      next({
        msg: error.msg,
      });
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
              res.json({
                msg: result.msg,
              });
            })
            .catch(function (error) {
              next({ error: error.msg });
            });
        })
        .catch(function (error) {
          logger.info('Error while hashing password error:' + error.msg);
          next({ msg: error.msg });
        });
    })
    .catch(function (error) {
      logger.info('Error while trying to set new user, error:' + error.msg);
      next({ msg: error.msg });
    });
}

module.exports = {
  register,
  login,
};
