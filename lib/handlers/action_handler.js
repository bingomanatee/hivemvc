var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var _DEBUG = false;
var Action = require('./../action')

var _mixins = {
	name:    'action_dir_handler',
	respond: function (params) {
		if (_DEBUG) console.log('loading action %s', params.file_path);

		var action = Action({}, {root: params.file_path});
		action.init(params.gate.latch());
		if (this.actions){
			this.actions.push(action);
		}
	}
};
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
module.exports = function (mixins, config) {

	return hive_loader.handler(
		[_mixins, mixins],
		[
			{
				dir: true,
				name_filter: /(.*)(_action)?$/
			}, // handles any folder found in an actions folder; ideally, suffixed with _action
			config
		]);
}