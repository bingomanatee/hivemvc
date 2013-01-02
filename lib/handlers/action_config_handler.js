var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

var _mixins = {
	name:    'config_handler',
	respond: function (params) {
		if (_DEBUG) console.log('found config path: %s', params.file_path);
		var self = this;
		try {
			var configs = require(params.file_path);
			var apiary = this.get_config('apiary');

			if (_DEBUG) console.log('target for setting config: %s %s, current config for action %s: %s',
				self.TYPE, self.name,
				self.get_config('root'), util.inspect(self._config.valueOf()));
			if (_DEBUG) console.log('routes: for action %s: %s', self.get_config('root'), util.inspect(configs));
			self._config.setAll(configs);
			if (_DEBUG) console.log('..reset config for action %s: %s', self.get_config('root'), util.inspect(self._config.valueOf()));
		} catch(e){
			console.log('error reading config file %s: %s', params.file_path, e)
		}

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