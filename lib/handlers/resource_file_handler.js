var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var path = require('path');

var _DEBUG = false;
/**
 *
 * this handler loads and initializes a specific resource.
 * Note that resources are stored in a global closure, not in
 * any specific hive or frame.
 *
 */

module.exports = function ( res_type) {


	var _mixins = {
		name:    'resources_dir_handler',
		respond: function (params) {
			var apiary = handler.core();
			var self = this;

			if (_DEBUG) 	console.log('======= found resource %s %s at %s', res_type, params.file, params.file_path);

			function _load_resource(file_path, cb) {
				require(file_path)(apiary, function (err, resource) {
					if (resource) {
						resource.TYPE = res_type;
						apiary.Resource.list.put(resource);
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

					//@TODO: validate this method of instantiation
					_load_resource( params.file_path, function (err, model) {
						apiary.add_model(model);
						l();
					});
					break;

				case 'mixin':
					_load_resource( params.file_path, function (err, mixin) {
						apiary.get_config('mixins').push(mixin);
						l();
					});
					break;

				case 'view_helper':
					_load_resource( params.file_path, function (err, resource) {
						resource.post = !!resource.post;
						l();
					});
					break;

				default:
					_load_resource( params.file_path, l);
					break;
			}
		}
	};

	var handler = hive_loader.handler(
		_mixins,
		{
			dir:         false,
			name_filter: /(.*)\.js$/i
		}
	);

	return handler;
}