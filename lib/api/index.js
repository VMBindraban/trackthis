/**
 * The API.
 *
 * @param {Transport} transport
 *
 * @constructor
 */
function Api (transport) {
  this.transport = transport;
}

/**
 * Search for accounts based on filters.
 *
 * @param {{}}       filters
 * @param {Function} [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 *
 * @see {@link http://trackthis.nl/docs/api} for further information.
 */
Api.prototype.searchAccounts = function (filters, done) {
  var parameters = {action: 'search'};

  if (typeof filters === 'function') {
    done = filters;
    filters = null;
  }

  if (filters) {
    parameters.filter = filters;
  }

  return this.transport.get('api/action/accountv2', parameters, done);
};

module.exports = Api;
