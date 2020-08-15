const mysql = require('mysql');
const config = require('../config');

const pool = mysql.createPool({
  connectionLimit: config.dbConnectionLimit,
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.db,
  debug: false,
});

module.exports = pool;
