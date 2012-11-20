var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var action_script_handler = require('./../handlers/action_script_handler');
var action_config_handler = require('./../handlers/action_config_handler');

var _mixins = {
	name: 'action_loader',
	action_config: false,
	action_script: false
};

module.exports = function (cb, action_path) {
	return hive_loader.loader(
		_mixins,
		{
			handlers:    [action_script_handler(), action_config_handler()],
			root:        action_path
		},
		cb);
}