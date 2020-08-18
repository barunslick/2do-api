const httpStatus = require('http-status');

const logger = require('../../loader/logger');
const dbPool = require('../../loader/database');
const APIError = require('../helpers/APIError');

/**
 * Verifies user owns a todo.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function verifyPermission(req, res, next) {
  dbPool.query(
    `SELECT listId from task WHERE task.id = '${req.params.taskId}'`,
    function (err, result) {
      if (err) {
        logger.error(
          `Invalid task id given by ${req.user.email}, error: ${err.message}`
        );

        next(new APIError('Invalid TaskId', httpStatus.INTERNAL_SERVER_ERROR));
      }
      if (!result.length) {
        logger.error(
          `Invalid task id given by ${req.user.email}, Couldnt find any user owned lists with task of taskId ${req.params.taskId}`
        );

        next(new APIError('User doesnt own any lists', httpStatus.BAD_REQUEST));
      } else {
        const listId = result[0].listId;

        dbPool.query(
          `SELECT * FROM lists, list_owners WHERE (lists.id = list_owners.listId) AND (list_owners.userId = '${req.user.id}') AND (lists.id = '${listId}')`,
          function (err, result) {
            if (err) {
              logger.error(
                `Invalid task id given by ${req.user.email}, error: ${err.message}`
              );

              next(new APIError(err.msg, httpStatus.INTERNAL_SERVER_ERROR));
            }
            if (!result.length) {
              logger.error(
                `User ${req.body.email} doesnt have task with taskId ${req.user.id}`
              );

              next(
                new APIError(
                  'User doesnt own task with such id.',
                  httpStatus.UNAUTHORIZED
                )
              );
            } else {
              next();
            }
          }
        );
      }
    }
  );
}

module.exports = verifyPermission;
