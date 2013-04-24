var hl = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

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
module.exports = function () {

	var _mixins = {
		name:    'action_dir_handler',
		respond: function (params) {
			var apiary = handler.core();

			if (_DEBUG) console.log('loading hive %s', params.file_path);

			var l = params.gate.latch();
			var frame = this;
			//console.log('hive_handler self == %s', util.inspect(self));
			var hive = apiary.Hive({}, {root: params.file_path, frame: frame});
			hive.init(function () {
				if (_DEBUG) console.log('done with hive %s', hive.get_config('root'));

				frame.hives.push(hive);
				l();
			});

		}
	};

	var handler = hl.handler(
		_mixins,
		{
			dir:         true,
			name_filter: /(.*)(_hive)?$/
		}
	);

	return handler;
};