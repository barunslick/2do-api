const httpStatus = require('http-status');

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
    `SELECT listId from task WHERE task.id = ${req.params.taskId}`,
    function (error, result) {
      if (error) {
        next(new APIError(error.msg, httpStatus.INTERNAL_SERVER_ERROR));
      }
      if (!result.length) {
        next(new APIError(error.msg, httpStatus.BAD_REQUEST));
      }

      const listId = result[0].listId;

      dbPool.query(
        `SELECT * FROM lists, list_owners WHERE (lists.id = list_owners.listId) AND (list_owners.userId = ${req.user.id}) AND (lists.id = ${listId})`,
        function (error, result) {
          if (error) {
            next(new APIError(error.msg, httpStatus.INTERNAL_SERVER_ERROR));
          }
          if (!result.length) {
            next(
              new APIError(
                'User doesnt own task with such id.',
                httpStatus.UNAUTHORIZED
              )
            );
          }
          next();
        }
      );
    }
  );
}

module.exports = verifyPermission;
