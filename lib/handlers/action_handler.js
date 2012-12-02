var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var _DEBUG = false;
var action_loader = require('./../loaders/action_loader')

var _mixins = {
	name:    'action_dir_handler',
	respond: function (params) {
		if (_DEBUG) console.log('loading action %s', params.file_path);
		var al = action_loader(params.gate.latch(), params.file_path);
		if (!this.action_loaders){
			throw new Error(util.format('no action_loaders in %s', util.inspect(this, true)))
		}
		this.action_loaders.push(al);
		al.load(params.gate.latch());

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
module.exports = function (mixins, config, cb) {

	return hive_loader.handler(
		[_mixins, mixins],
		[
			{
				dir: true,
				name_filter: /(.*)(_action)?$/
			}, // handles any folder found in an actions folder; ideally, suffixed with _action
			config
		],
		cb);
}