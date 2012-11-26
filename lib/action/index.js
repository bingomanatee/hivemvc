var Component = require('hive-component');
var _ = require('underscore');
var util = require('util');
var _DEBUG = true;
var _mixins = require('./mixins');
var _config = require('./config');

module.exports = function (mixins, config, cb) {
	if (_DEBUG) console.log('creating action with config %s', config);

	return Component(
		[mixins, _mixins]
		, [config, _config]
		, cb);
};