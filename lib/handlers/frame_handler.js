var hl = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var Component = require('hive-component');
var frame_loader = require('./../loaders/frame_loader');
var _DEBUG = false;


/**
 *
 * This handler handles a folder of frames.
 * Any directory in a frames folder is accepted as a frame.
 *
 * It is usually attached to a frames_loader.
 *
 */

module.exports = function ( cb) {

	var _mixins = {
		name:    'frames_handler',
		respond: function (params) {
			var apiary = handler.core();

			if (_DEBUG) console.log('frames_handler: found frame folder %s for apiary %s', params.file_path, util.inspect(apiary, false, 0));
			var frame = apiary.Frame( params.file_path);
			frame.init(params.gate.latch());
		}
	};

	var handler =  hl.handler(
		 _mixins,
		[{
			dir: true,
			name_filter: /.*/i
		}],
		cb);

	return handler;
};