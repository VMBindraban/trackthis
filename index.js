var _         = require('lodash'),
    Promise   = require('bluebird'),
    Api       = require('./lib/api'),
    Transport = require('./lib/transport');

/**
 * Create a new trackthis instance.
 *
 * @param {{}} config
 *
 * @constructor
 */
function TrackThis (config) {
  this.config = _.defaults(config, {
    endpoint: 'http://trackthis.nl/api/action',
    auth    : {
      username: '',
      password: ''
    }
  });

  this.transport = new Transport(this.config);
  this.api       = new Api(this.transport);
}

module.exports = TrackThis;
