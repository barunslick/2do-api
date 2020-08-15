const dbPool = require('../loader/database');

/**
 * Allows to check if a user exists in database.
 *
 * @param {String} useremail
 * @returns {Promise}
 */
function checkUserAlreadyExists(useremail) {
  return new Promise(function (resolve, reject) {
    dbPool.query('SELECT * FROM users where name = ?', [useremail], function (
      error,
      results
    ) {
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
    });
  });
}
/**
 *
 *
 * @param {*} userDetails
 */
function addnewUser(userDetails) {
  return new Promise(function (resolve, reject) {
    dbPool.query(
      'INSERT into users (name, type, password) VALUES ?',
      [[[userDetails.username, 'user', userDetails.password]]],
      function (error) {
        if (error) {
          reject({
            msg: error,
          });
        } else {
          resolve({
            username: userDetails.username,
            msg: 'Following user added succesfully',
          });
        }
      }
    );
  });
}

module.exports = {
  checkUserAlreadyExists,
  addnewUser,
};
