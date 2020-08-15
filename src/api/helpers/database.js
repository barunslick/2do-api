const dbPool = require('../../loader/database');

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
 * @param {*} email
 * @returns
 */
function fetchUser(email) {
  return new Promise(function (resolve, reject) {
    dbPool.query('SELECT * FROM users where email = ?', [email], function (
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
          resolve(results[0]);
        }
      }
    });
  });
}

module.exports = {
  checkUserExists,
  addnewUser,
  fetchUser,
};
