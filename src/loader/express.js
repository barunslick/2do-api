const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const methodOverride = require('method-override');
const { ValidationError } = require('express-validation');

const routes = require('../api');

/**
 * Prechecks the incoming requests.
 *
 * @param {express.Application} app
 */
function loadExpress(app) {
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(express.json());

  app.use(methodOverride());

  app.use(helmet());

  app.use(cors());

  // health check
  app.get('/status', (req, res) => {
    res.status(200).send('OK');
  });

  app.use('/api', routes);

  app.use(function (req, res, next) {
    next({
      msg: 'Not Found',
      status: 404,
    });
  });

  app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }

    res.status(err.status || 400).json({
      msg: err.msg || err,
      status: err.status || 400,
    });
  });
}

module.exports = loadExpress;
