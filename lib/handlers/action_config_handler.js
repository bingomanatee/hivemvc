var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var _DEBUG = false;

var _mixins = {
	name:    'config_handler',
	respond: function (params) {
		if (_DEBUG) console.log('found config path: %s', params.file_path);
		this.action_config = params.file_path;

	}
};


/**
 *
 * This handler listens for action configurations; it is attached to the action loader.
 *
 * The found action_config is attached to the loaders' action_config property.
 *
 * It is attached exclusively to the action loader.
 *
 * @param mixins
 * @param config
 * @param cb
 * @return {*}
 */

module.exports = function (mixins, config, cb) {

	return hive_loader.handler(
		[ _mixins, mixins],
		[
			{dir: false, name_filter: /(.*_)?config\.json$/i},
			config
		],
		cb);
}