var _ = require('lodash');

module.exports = function configFactory (config) {
  return _.defaults(config, {
    tracker : {
      websiteKey   : null,
      productGroup : 'webcamsv4',
      websiteDomain: null,
      product      : 'vpscash',
    },
    api     : {
      endpoint   : 'http://trackthis.nl',
      credentials: {
        username: '',
        password: ''
      }
    }
  });
};
