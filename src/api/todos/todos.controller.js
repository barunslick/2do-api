const httpStatus = require('http-status');

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
  dbHelper
    .fetchUserLists(req.user.id)
    .then(function (result) {
      // Right now personal is hard coded. But if later the applicaiton allows user to create multiple list.. this can be changed.
      const listName = 'personal';

      let listId;

      if (!result.length) {
        dbHelper
          .createUserList(listName, req.user.id)
          .then(function (result) {
            listId = result.listId;
          })
          .catch(function (error) {
            return next(
              new APIError(error.message),
              httpStatus.INTERNAL_SERVER_ERROR
            );
          });
      } else {
        listId = result[0].id;
      }

      const insertData = {
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription
          ? req.body.taskDescription
          : null,
        listId: listId,
        status: 'GOING',
      };

      dbPool.query(`INSERT INTO task SET ? `, insertData, function (
        error,
        result
      ) {
        if (error) {
          return next(
            new APIError(error.message),
            httpStatus.INTERNAL_SERVER_ERROR
          );
        } else {
          res.json({
            msg: 'OK',
            taskId: result.insertId,
          });
        }
      });
    })
    .catch(function (error) {
      return next(
        new APIError(error.message),
        httpStatus.INTERNAL_SERVER_ERROR
      );
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
  const query = `SELECT lists.id,lists.listName,task.id, task.taskName, task.taskDescription, task.status FROM lists, task, list_owners WHERE
  (lists.id = task.listId) AND (list_owners.listId = lists.id) AND (list_owners.userId = ${req.user.id})`;

  dbPool.query(query, function (error, result) {
    if (error) {
      return next(
        new APIError(error.message),
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
  dbPool.query(
    `UPDATE task SET ? WHERE id = ${req.params.taskId}`,
    req.body,
    function (error) {
      if (error) {
        return next(
          new APIError(error.message),
          httpStatus.INTERNAL_SERVER_ERROR
        );
      }
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
  dbPool.query(`DELETE FROM task WHERE id = ${req.params.taskId}`, function (
    error
  ) {
    if (error) {
      return next(
        new APIError(error.message),
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    res.json({
      msg: 'Deleted',
      content: req.body,
    });
  });
}

module.exports = {
  addTodoItem,
  getAllTodos,
  updateTask,
  deleteTask,
};
