const dbPool = require('../loader/database');

const databaseService = require('../services/database');

/**
 * A service layer for registering new user.
 *
 * @param {Object} userInput
 */
function register(userInput) {
  return new Promise(function (resolve, reject) {
    databaseService
      .checkUserAlreadyExists(userInput.username)
      .then(function () {
        databaseService
          .addnewUser(userInput)
          .then(function (result) {
            resolve(result);
          })
          .catch(function (error) {
            reject(error);
          });
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

module.exports = {
  register,
};
