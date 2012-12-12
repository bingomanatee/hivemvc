var hl = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;
var Hive = require('./../hive');

var _mixins = {
	name:    'action_dir_handler',
	respond: function (params) {
		if (_DEBUG) {
			console.log('loading hive %s', params.file_path);
		}

		var l = params.gate.latch();
		var frame = this;
		//console.log('hive_handler self == %s', util.inspect(self));
		var hive = Hive({}, {root: params.file_path});
		hive.init(function () {
			if (_DEBUG) console.log('done with hive %s', hive.get_config('root'));
			frame.hives.push(hive);
			l();
		});

	}
};

/**
 * This handler detects individual hives and launches a hive loader.
 *
 * it is usually attached to an hives loader.
 *
 * @param mixins
 * @param config
 * @param cb
 *
 * @return Handler
 */
module.exports = function (mixins, config, cb) {

	return hl.handler(
		[_mixins, mixins],
		[
			{
				dir:         true,
				name_filter: /(.*)(_hive)?$/
			},
			// handles any folder found in an actions folder; ideally, suffixed with _action
			config
		],
		cb);
};