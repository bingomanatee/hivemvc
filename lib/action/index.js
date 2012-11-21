var _mixins = require('./mixins');
var Component = require('hive-component');
var _ = require('underscore');
var util = require('util');

module.exports = function (mixins, config, cb) {
	return Component(
		[mixins, _mixins],
		[
			config,
			{
				req_models:    [],
				req_resources: []
			}
		]
		, cb);
}