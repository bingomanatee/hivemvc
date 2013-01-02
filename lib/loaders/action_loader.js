var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var action_script_handler = require('./../handlers/action_script_handler');
var action_config_handler = require('./../handlers/action_config_handler');
var action_view_handler = require('./../handlers/action_view_handler');

var _mixins = {
	TYPE:          'action_loader',
	action_config: false,
	action_script: false
};

module.exports = function (action_path, action) {
	return hive_loader.loader(
		_mixins,
		{
			handlers: [action_script_handler(), action_config_handler(), action_view_handler()],
			root:     action_path,
			target:   action
		});

}