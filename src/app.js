const express = require('express');

const loader = require('./loader');
const config = require('./config/index');
const logger = require('./loader/logger');

/**
 * Creates an express app and calls loader, then creates listener.
 *
 */
function startServer() {
  const app = express();

  loader(app);

  app.listen(config.port, function () {
    // eslint-disable-next-line
    logger.info('listening on port http://localhost:' + config.port);
  });
}

startServer();
