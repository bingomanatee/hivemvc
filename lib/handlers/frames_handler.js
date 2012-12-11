var hl = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var Component = require('hive-component');
var frames_loader = require('./../loaders/frames_loader');
var _DEBUG = false;

var _mixins = {
	name:    'frames_handler',
	respond: function (params) {
		if (_DEBUG) console.log('frames_handler: found frame folder %s', params.file_path);
		var frames_loader = frames_loader(params.file_path);
		frames_loader.load(params.gate.latch());
	}
};

/**
 *
 * This handler handles a folder of frames.
 * The folder name must END in hives
 * but you can have any (or no) prefix,
 * if you want to divide your hives into multiple groups.
 *
 * It is usually attached to a frames_loader.
 *
 */

module.exports = function (mixins, config, cb) {

	return hl.handler(
		 [_mixins, mixins],
		[{
			dir: true,
			name_filter: /(.*)(_)?frames$/i
		}, config],
		cb);
};