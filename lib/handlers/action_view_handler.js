var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var _DEBUG = false;

var _mixins = {
	name:    'action_view_handler',
	respond: function (params) {
		if (_DEBUG) console.log('------------ view template found %s', params.file_path);
		this.template = params.file_path;
	}
};

/**
 *
 * This handler listens for templates; it is attached to the action loader.
 * @param mixins
 * @param config
 * @param cb
 * @return {*}
 */

module.exports = function (mixins, config, cb) {
	return  hive_loader.handler(
		[_mixins, mixins],
		[
			{dir: false, name_filter: /(.*)(_)?(view|template)\.(html|ejs|jade)/},
			config
		],
		cb);
}