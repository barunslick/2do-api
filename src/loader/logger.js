const winston = require('winston');

const loggerInstance = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: './logs/app.log' }),
    new winston.transports.Console(),
  ],
});

module.exports = loggerInstance;
