var hl = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var Component = require('hive-component');
var frame_loader = require('./../loaders/frame_loader');
var _DEBUG = false;

var _mixins = {
	name:    'frames_handler',
	respond: function (params) {
		if (_DEBUG) console.log('frames_handler: found frame folder %s', params.file_path);

		var frame = mvc.Frame({}, {root: params.file_path});
		frame.init(params.gate.latch());
	}
};

/**
 *
 * This handler handles a folder of frames.
 * Any directory in a frames folder is accepted as a frame.
 *
 * It is usually attached to a frames_loader.
 *
 */

module.exports = function (mixins, config, cb) {

	return hl.handler(
		 [_mixins, mixins],
		[{
			dir: true,
			name_filter: /.*/i
		}, config],
		cb);
};