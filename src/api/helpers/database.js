const dbPool = require('../../loader/database');
const parseDatabaseResult = require('../helpers/dbResultParser');

/**
 * Allows to check if a user exists in database based on email address.
 *
 * @param {String} email
 * @returns {Promise}
 */
function checkUserExists(email) {
  return new Promise(function (resolve, reject) {
    dbPool.query(
      'SELECT username FROM users where email = ?',
      [email],
      function (error, results) {
        if (error) {
          reject({
            msg: error,
          });
        } else {
          if (!results.length) {
            resolve(true);
          } else {
            reject({
              msg: 'User already exists',
            });
          }
        }
      }
    );
  });
}

/**
 * Add a new user to database.
 *
 * @param {*} userDetails
 */
function addnewUser(userDetails) {
  return new Promise(function (resolve, reject) {
    dbPool.query('INSERT into users SET ?', userDetails, function (error) {
      if (error) {
        reject({
          msg: error,
        });
      } else {
        resolve({
          username: userDetails.username,
          msg: 'User added succesfully',
        });
      }
    });
  });
}

/**
 * Fetches record of user from email.
 *
 * @param {*} field
 * @param {*} value
 * @returns
 */
function fetchUser(field = 'email', value) {
  return new Promise(function (resolve, reject) {
    if (field !== 'id' && field !== 'email') {
      reject({
        msg: 'Field can be only set as id or email',
      });
    }

    dbPool.query(`SELECT * FROM users where ${field} = ?`, [value], function (
      error,
      results
    ) {
      if (error) {
        reject({
          msg: error,
        });
      } else {
        if (!results.length) {
          reject({
            msg: 'Invalid login. No such user.',
          });
        } else {
          resolve(parseDatabaseResult(results[0]));
        }
      }
    });
  });
}

/**
 * Fetches all the list of a user.
 *
 * @param {Number} userId
 */
function fetchUserLists(userId) {
  return new Promise(function (resolve, reject) {
    const checkUserOwnsAList = `SELECT lists.id, lists.listName FROM lists,list_owners WHERE (lists.id = list_owners.listId) AND (list_owners.userId = ${userId})`;

    dbPool.query(checkUserOwnsAList, function (error, result, fields) {
      if (error) {
        reject({
          msg: error,
        });
      } else {
        resolve(parseDatabaseResult(result));
      }
    });
  });
}

/**
 * Creates a new list for a user.
 *
 * @param {String} listName
 * @param {Number} userId
 * @returns
 */
function createUserList(listName, userId) {
  return new Promise(function (resolve, reject) {
    const createUserListQuery = `INSERT INTO lists SET listName = '${listName}'`;

    dbPool.query(createUserListQuery, function (error, result, fields) {
      if (error) {
        reject({
          msg: error,
        });
      }
      const listId = result.insertId;

      const linkListOwner = `INSERT INTO list_owners SET listId= ${listId}, userId = ${userId}`;

      dbPool.query(linkListOwner, function (error) {
        if (error) {
          reject({
            msg: error,
          });
        }
        resolve({
          listId,
        });
      });
    });
  });
}

module.exports = {
  checkUserExists,
  addnewUser,
  fetchUser,
  fetchUserLists,
  createUserList,
};
