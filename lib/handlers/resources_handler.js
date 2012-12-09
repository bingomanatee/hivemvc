var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var resources_loader = require('./../loaders/resources_loader');
var _DEBUG = false;

var _mixins = {
	name:    'resources_dir_handler',
	respond: function (params) {
		if (_DEBUG) console.log('resources_handler: found actions folder %s', params.file_path);
		var latch = params.gate.latch();
		var self = this;
		resources_loader(function(err, al){
			if (_DEBUG) console.log('resources loader created in resources_handler for %s: %s',
				params.file_path, self.get_config('root'));
			al.set_config('target', self);
			al.load(latch, params.file_path)
		});
	}
};

/**
 *
 * this handler searches for an actions folder.
 * Note the folder must END in resources, but can have any
 * prefix you want, if a folder has multiple resources.
 *
 * Resources can be found almost ANYWHERE
 * - in hives, frames, actions, and layouts.
 *
 */

module.exports = function (mixins, config, cb) {

	return hive_loader.handler(
		[_mixins, mixins],
		[{
			dir: true,
			name_filter: /(.*)(_)?resources$/i
		}, config],
		cb);
}