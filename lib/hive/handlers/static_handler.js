var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');


var _mixins = {
	name:    'static_handler',
	respond: function (params) {
		//@TODO: handle statics
	}
};

/**
 *
 * This handler listens for static folder; it is attached to the action loader and the layout loader
 * @param mixins
 * @param config
 * @param cb
 * @return Handler
 */

module.exports = function (mixins, config, cb) {
	return  hive_loader.handler(
		[_mixins, mixins],
		[
			{dir: true, name_filter: /^static$/i},
			config
		],
		cb);
}