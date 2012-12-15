var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var Model = require('./../model');
var Resource = require('./../resource');
var path = require('path');

var _DEBUG = false;

var _mixins = {
	name:    'resources_dir_handler',
	respond: function (params) {
		//var latch = params.gate.latch();
		var self = this;
		var res_type = this.get_config('res_type');

		if (_DEBUG) {
			console.log('======= found resource %s %s at %s', res_type, params.file, params.file_path);
		}

		function _load_resource(file_path, cb) {
			require(file_path)(function (err, resource) {
				if (resource) {
					resource.TYPE = res_type;
					Resource.list.put(resource);
				}
				if (!resource.name) {
					resource.name = path.basename(file_path, 'js').replace(new RegExp('((_)?' + res_type + '(_))?\.js'), '');
				}
				cb(null, resource);
			});
		}

		var l = params.gate.latch();

		switch (res_type) {
			case 'model':
				_load_resource(params.file_path, function (err, model) {
					Model.list.put(model);
					l();
				});
				break;

			case 'mixin':
				_load_resource(params.file_path, function (err, mixin) {
					mixin.respond(l);
				});
				break;

			case 'view_helper':
				_load_resource(params.file_path, function (err, resource) {
					resource.post = !!resource.post;
					l();
				});
				break;

			default:
				_load_resource(params.file_path, l);
				break;
		}
	}
};

/**
 *
 * this handler loads and initializes a specific resource.
 * Note that resources are stored in a global closure, not in
 * any specific hive or frame.
 *
 */

module.exports = function (mixins, config) {
	return hive_loader.handler(
		[_mixins, mixins],
		[
			{
				dir:         false,
				name_filter: /(.*)\.js$/i
			},
			config
		]);
}