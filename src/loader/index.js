const logger = require('./logger');
const loadExpress = require('./express');

/**
 * Loads the neccesary modules during startup.
 *
 * @param {express.Application} app
 */
function loader(app) {
  logger.info('Logging started!');

  loadExpress(app);
}

module.exports = loader;
