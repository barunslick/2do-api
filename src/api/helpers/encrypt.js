const bcrypt = require('bcrypt');

const config = require('../../config');

module.exports = function (plainTextPassword) {
  console.log(config);

  return new Promise(function (resolve, reject) {
    bcrypt.hash(plainTextPassword, config.encryptSaltRounds, function (
      error,
      hash
    ) {
      if (error) {
        reject({
          msg: error,
        });
      } else {
        resolve({
          hashedPassword: hash,
        });
      }
    });
  });
};
