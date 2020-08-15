const logger = require('../../loader/logger');
const encrypt = require('../helpers/encrypt');
const dbHelper = require('../helpers/database');

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

module.exports = { register };
