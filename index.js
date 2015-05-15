var Api           = require('./lib/api'),
    configFactory = require('./lib/config-factory');

/**
 * Create a new trackthis instance.
 *
 * @param {{}} config
 *
 * @constructor
 */
function TrackThis (config) {
  this.config  = configFactory(config);
  this.api     = new Api(this.config);
}

module.exports = TrackThis;
