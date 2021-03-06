'use strict';

var CharField = require('./CharField')

var $__0=  require('validators'),validateIPv4Address=$__0.validateIPv4Address

/**
 * Validates that its input is a valid IPv4 address.
 * @constructor
 * @extends {CharField}
 * @param {Object=} kwargs
 * @deprecated in favour of GenericIPAddressField
 */
var IPAddressField = CharField.extend({
  defaultValidators: [validateIPv4Address]

, constructor: function IPAddressField(kwargs) {
    if (!(this instanceof IPAddressField)) { return new IPAddressField(kwargs) }
    CharField.call(this, kwargs)
  }
})

module.exports = IPAddressField