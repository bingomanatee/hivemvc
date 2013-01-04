var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

var _mixins = {
	name:    'config_handler',
	respond: function (params) {

		var configs = require(params.file_path);
		var apiary = this.get_config('apiary');
		this._config.setAll(configs);
		apiary.add_static(this, params.gate.latch());
	}
};

/**
 *
 * This handler listens for action configurations; it is attached to the action loader.
 *
 * The found action_config is attached to the loaders' action_config property.
 *
 * Though this handler is designed for actions,
 * it can be cloned and used for any construct with a config file.
 *
 * @param mixins
 * @param config
 * @param cb
 * @return {*}
 */

module.exports = function (mixins, config, cb) {

	return hive_loader.handler(
		[ _mixins, mixins],
		[
			{dir: false, name_filter: /(.*_)?config\.json$/i},
			config
		],
		cb);
};