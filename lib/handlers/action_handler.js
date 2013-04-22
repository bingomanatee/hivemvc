var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var _DEBUG = false;

/**
 * This handler detects individual actions and launches an action loader. That loader is triggered, and its results pushed into the
 * actions property of its host handler.
 *
 * it is usually attached to an actions loader.
 *
 * @param mixins
 * @param config
 * @param cb
 * @return Handler
 */
module.exports = function (config) {

	var _mixins = {
		name:    'action_dir_handler',
		respond: function (params) {
			var apiary = handler.core();
			if (_DEBUG) console.log('loading action %s', params.file_path);
			var action = apiary.Action({}, {root: params.file_path, hive: config.hive});
			action.init(params.gate.latch());
			if (this.actions){
				this.actions.push(action);
			}
		}
	};

	var handler = hive_loader.handler(
		_mixins,
		[
			{
				dir: true,
				name_filter: /(.*)(_action)?$/
			} // handles any folder found in an actions folder; ideally, suffixed with _action

		]);

	return handler;
}