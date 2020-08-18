const httpStatus = require('http-status');

const logger = require('../../loader/logger');
const APIError = require('../helpers/APIError');
const dbPool = require('../../loader/database');
const dbHelper = require('../helpers/database');
const parseDatabaseResult = require('../helpers/dbResultParser');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function addTodoItem(req, res, next) {
  logger.info(`Incoming request to add new task for ${req.user.email}`);
  dbHelper
    .fetchUserLists(req.user.id)
    .then(function (result) {
      const listId = result[0].id;

      const insertData = {
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription
          ? req.body.taskDescription
          : null,
        listId: listId,
        status: 'GOING',
      };

      dbPool.query(`INSERT INTO task SET ? `, insertData, function (
        err,
        result
      ) {
        if (err) {
          logger.error(
            `Failed to add new task for ${req.user.email}, error: ${err.message}`
          );

          return next(
            new APIError(err.message),
            httpStatus.INTERNAL_SERVER_ERROR
          );
        } else {
          logger.info(
            `Add new task for  ${req.user.email} with taskId: ${result.insertId}`
          );

          res.json({
            msg: 'OK',
            taskId: result.insertId,
          });
        }
      });
    })
    .catch(function (err) {
      logger.error(
        `Failed to add new task for ${req.user.email}, error: ${err.message}`
      );

      return next(new APIError(err.message), httpStatus.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Returns all the todos of user.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getAllTodos(req, res, next) {
  logger.info(`Request to get all todos of ${req.user.email}`);

  const query = `SELECT lists.id,lists.listName,task.id, task.taskName, task.taskDescription, task.status FROM lists, task, list_owners WHERE
  (lists.id = task.listId) AND (list_owners.listId = lists.id) AND (list_owners.userId = ${req.user.id})`;

  dbPool.query(query, function (err, result) {
    if (err) {
      logger.error(
        `Error during getting all todos for ${req.user.email}, error: ${err.message}`
      );

      return next(new APIError(err.message), httpStatus.INTERNAL_SERVER_ERROR);
    }
    logger.info(`returned all todos of ${req.user.email}`);

    res.json({
      todos: parseDatabaseResult(result),
    });
  });
}

/**
 * Makes changes to the todo item.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function updateTask(req, res, next) {
  logger.info(
    `Incoming request to update task for ${req.user.email} with taskId: ${req.params.taskId}`
  );

  dbPool.query(
    `UPDATE task SET ? WHERE id = '${req.params.taskId}'`,
    req.body,
    function (err) {
      if (err) {
        logger.error(
          `Error during updating task for ${req.user.email} with taskId: ${req.params.taskId}, error: ${err.message}`
        );

        return next(
          new APIError(err.message),
          httpStatus.INTERNAL_SERVER_ERROR
        );
      }
      logger.info(
        `Succesfully updated task for ${req.user.email} with taskId: ${req.params.taskId}`
      );

      res.json({
        msg: 'Updated',
        content: req.body,
      });
    }
  );
}

/**
 * Deletes a task from a todo list.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function deleteTask(req, res, next) {
  logger.info(
    `Incoming request to delete task for ${req.user.email} with taskId: ${req.params.taskId}`
  );

  dbPool.query(`DELETE FROM task WHERE id = ${req.params.taskId}`, function (
    err
  ) {
    if (err) {
      logger.error(
        `Error during deleting task for ${req.user.email} with taskId: ${req.params.taskId}, error: ${err.message}`
      );

      return next(new APIError(err.message), httpStatus.INTERNAL_SERVER_ERROR);
    }
    logger.info(
      `Succesfully deleted task for ${req.user.email} with taskId: ${req.params.taskId}`
    );

    res.json({
      msg: 'Succesfully Deleted task',
    });
  });
}

module.exports = {
  addTodoItem,
  getAllTodos,
  updateTask,
  deleteTask,
};
