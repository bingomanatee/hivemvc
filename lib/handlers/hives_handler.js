var hl = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var Component = require('hive-component');
var hive_loader = require('./../loaders/hive_loader');
var _DEBUG = false;

var _mixins = {
	name:    'hives_handler',
	respond: function (params) {
		if (_DEBUG) console.log('hive_handler: found hives folder %s', params.file_path);
		var latch = params.gate.latch();

		hive_loader(function(err, loader){
			if (_DEBUG) console.log('hive_handler: hive loader created in actions_handler for %s: %s',params.file_path, self.get_config('root'));
			loader.load(latch)
		}, params.file_path, this);
	}
};

/**
 *
 * This handler handles a folder of hives. The folder name must END in hives
 * but you can have any (or no) prefix, if you want to divide your hives into multiple groups.
 *
 * It is usually attached to a frame_loader.
 *
 */

module.exports = function (mixins, config, cb) {

	return hl.handler(
		 [_mixins, mixins],
		[{
			dir: true,
			name_filter: /(.*)(_)?hives$/i
		}, config],
		cb);
};