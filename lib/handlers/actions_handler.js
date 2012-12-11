var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var actions_loader = require('./../loaders/actions_loader');
var _DEBUG = false;

var _mixins = {
	name:    'actions_dir_handler',
	respond: function (params) {
		if (_DEBUG) console.log('actions_handler: found actions folder %s', params.file_path);

		var frame = this;
		var loader = actions_loader({}, {target: frame});
		loader.load(params.gate.latch());
	}
};

/**
 *
 * this handler searches for an actions folder. Note the folder must END in actions, but can have any
 * prefix you want, if a hive has multiple actions.
 *
 * It is usually attached to a hive.
 *
 */

module.exports = function (mixins, config, cb) {

	return hive_loader.handler(
		 [_mixins, mixins],
		[{
			dir: true,
			name_filter: /(.*)(_)?actions$/i
		}, config],
		cb);
}