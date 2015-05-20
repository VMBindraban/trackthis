var request    = require('request'),
    _          = require('lodash'),
    JSONStream = require('JSONStream'),
    Promise    = require('bluebird');

/**
 * The transport engine for TrackThis.
 *
 * @param {{}} config
 *
 * @constructor
 */
function Transport (config) {
  this.config = config;
}

/**
 * Create a requestUrl.
 *
 * @param {string} path The path.
 *
 * @returns {string}
 */
Transport.prototype.requestUrl = function (path) {
  return this.config.endpoint.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
};

/**
 * Perform a get request to the trackthis API.
 *
 * @param {string}    path          The path to call.
 * @param {{}}        [parameters]  Parameters for the get request.
 * @param {Function}  [done]        Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Transport.prototype.get = function (path, parameters, done) {
  if (typeof parameters === 'function') {
    done = parameters;
    parameters = null;
  }

  if (parameters) {
    parameters = {qs: parameters};
  }

  return this.request('get', path, parameters, done);
};

/**
 * Perform a request to the trackthis API.
 *
 * @param {string}    method    The request method (e.g. POST, GET, PUT or delete.)
 * @param {string}    path      The path to call.
 * @param {{}}        [options] The options for this request.
 * @param {Function}  [done]    Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Transport.prototype.request = function (method, path, options, done) {
  var results    = {},
      requestUrl = this.requestUrl(path);

  if (typeof options === 'function') {
    done = options;
    options = {};
  }

  options = _.defaults(options || {}, {
    'auth': {
      'user': this.config.credentials.username,
      'pass': this.config.credentials.password
    }
  });

  return new Promise(function (resolve, reject) {
    request[method](requestUrl, options)
      .pipe(JSONStream.parse())
      .on('error', reject)
      .on('data', function (decoded) {
        results = decoded;
      })
      .on('end', function () {
        resolve(results);
      });
  }).nodeify(done);
};

module.exports = Transport;
