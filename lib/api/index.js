var Transport = require('../transport'),
    _         = require('lodash');

/**
 * The API.
 *
 * @param {Transport} transport
 *
 * @constructor
 */
function Api (config) {
  this.config = config;
  this.transport = new Transport(config.api);
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
Api.prototype.searchAccounts = function searchAccounts (filters, done) {
  var parameters = {action: 'search'};

  if (typeof filters === 'function') {
    done = filters;
    filters = null;
  }

  if (filters) {
    parameters.filter = filters;
  }

  return this.transport.get('api/action/accountv2', parameters).then(function (response) {
    return response.data.result.data;
  }).nodeify(done);
};

/**
 * Find all info for partnerCode. This includes subcodes.
 *
 * @param {Number|String} partnerCode
 * @param {Function}      [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.findFull = function findFull (partnerCode, done) {
  var parameters = {
    action   : 'full',
    hoofdcode: partnerCode
  };

  return this.transport.get('api/action/accountv2', parameters, done);
};

/**
 * Create a new account.
 *
 * @param {Object}   accountOptions
 * @param {Function} [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.createAccount = function createAccount (accountOptions, done) {
  var mutableFields = [
    'username',
    'type'
  ], parameters     = _.pick(accountOptions, mutableFields);
  parameters.action = 'create';
  parameters.product = this.config.tracker.product;

  return this.transport
    .get('api/action/accountv2', parameters)
    .then(function (response) {
      if (!response.ok) {
        console.log(response);
        // @todo figure out all possible error combinations...
        throw 'failed';
      }

      return response.data;
    }).nodeify(done);
};

/**
 * Find account.
 *
 * @param {String|Object} username
 * @param {Function}      [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.findAccount = function findAccount (username, done) {
  return this.searchAccounts(_.isPlainObject(username) ? username : {username: username})
    .then(function (accounts) {
      return accounts[0] || null;
    }).nodeify(done);
};

/**
 * Find a performer.
 *
 * @param {String|Object} username
 * @param {Function}      [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.findPerformer = function findPerformer (username, done) {
  var params = _.isPlainObject(username) ? username : {username: username};

  params.type = 'webcam';

  return this.findAccount(params).nodeify(done);
};

/**
 * Find a studio.
 *
 * @param {String|Object} username
 * @param {Function}      [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.findStudio = function findStudio (username, done) {
  var params = _.isPlainObject(username) ? username : {username: username};

  params.type = 'studio';

  return this.findAccount(params).nodeify(done);
};

/**
 * Register a new performer.
 *
 * @param {Object}   performerOptions
 * @param {Function} [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.registerPerformer = function registerPerformer (performerOptions, done) {
  performerOptions.type = 'webcam';

  return this.createAccount(performerOptions).then(function (createdAccount) {
    return this.editAccount(createdAccount.result.hoofdcode, performerOptions);
  }.bind(this)).nodeify(done);
};

/**
 * Edit an account.
 *
 * @param {Number|String} partnerCode
 * @param {Object}        changes
 * @param {Function}      [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.editAccount = function editAccount (partnerCode, changes, done) {
  var mutableFields = [
    'password',
    'email',
    'name_private',
    'name_company',
    'address_postalcode',
    'address_city',
    'address_street',
    'address_country',
    'birthdate',
    'account_iban',
    'account_bic',
    'btw',
    'kvk',
    'account_name',
    'account_city',
    'account_free',
    'account_message',
    'account_country',
    'ssn',
    'website',
    'skypeid',
    'phonenumber',
    'passport_id'
  ], parameters     = {
    action   : 'edit',
    hoofdcode: partnerCode,
    changes  : _.pick(changes, mutableFields)
  };

  return this.transport.get('api/action/accountv2', parameters, done);
};

/**
 * Validate user credentials.
 *
 * @param {Object}   credentials
 * @param {Function} [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.validateCredentials = function validateCredentials (credentials, done) {
  var mutableFields = [
    'type',
    'username',
    'password'
  ];

  return this.transport.get('api/action/checkLogin', _.pick(credentials, mutableFields))
    .then(function (response) {
      return {
        valid  : response.data.correct,
        details: response.data.details
      };
    }).nodeify(done);
};

/**
 * Find payments
 *
 * @param {Object}   filterOptions
 * @param {Function} [done] Optional callback, in case you don't feel like using promises.
 *
 * @returns {Promise}
 */
Api.prototype.findPayments = function findPayments (filterOptions, done) {
  var mutableFields = [
    'grouping',
    'period',
    'date',
    'filters'
  ], parameters           = _.pick(filterOptions, mutableFields);
  parameters.type         = 'payments';
  parameters.responseType = 'trackthis';

  return this.transport
    .get('api/action/stats', parameters)
    .then(function (response) {

      // it is possible that no payments can be found, trackthis will not give an OK then.
      if (response.length < 1) {
        return false;
      }

      if (!response.ok) {
        // @todo figure out all possible error combinations...
        throw 'failed';
      }

      return response.data;
    }).nodeify(done);
};

module.exports = Api;
