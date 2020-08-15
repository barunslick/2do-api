const bcrypt = require('bcrypt');

module.exports = function (plainTextPassword, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(plainTextPassword, hash, function (error, result) {
      if (error) {
        reject({
          msg: error,
        });
      } else {
        resolve(result);
      }
    });
  });
};
