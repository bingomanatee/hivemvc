var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var resources_loader = require('./../loaders/resources_loader');
var _DEBUG = false;

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

module.exports = function () {

	var _mixins = {
		name:    'resources_dir_handler',
		respond: function (params) {
			if (_DEBUG) 	console.log('resources_handler: found resources folder %s', params.file_path);

			var self = this;

			var res_loader = resources_loader(params.file_path);
			var apiary = handler.core();

			if (_DEBUG) console.log('apiary for resources_handler: ', apiary);
			res_loader.core(apiary);
			var l = params.gate.latch();
			if (_DEBUG) console.log('starting to laod resources %s', params.file_path);

			res_loader.load(function () {
				if (_DEBUG) console.log('done loading resources for %s', params.file_path)

				l();
			});
		}
	};

	var handler = hive_loader.handler(
		_mixins,
		[
			{
				dir:         true,
				name_filter: /(.*)(_)?resources$/i
			}

		]);

	return handler;
}