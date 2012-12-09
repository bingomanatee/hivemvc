var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var Model = require('./../model');
var Resource = require('./../resource');

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

		switch (res_type) {
			case 'model':
				var l = params.gate.latch();
				require(params.file_path)(function(err, model){
					if(model) Model.list.put(model);
					l(err);
				});
				break;

			default:
				var l = params.gate.latch();
				require(params.file_path)(
					function(err, resource){
						if (resource) {
							resource.TYPE = res_type;
							Resource.list.put(resource);
						}
						if (!resource.name){
							resource.name = params.file.replace(new RegExp('((_)?' + res_type + '(_))?\.js'), '');
						}

						l(err);
					}
				);
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

module.exports = function (mixins, config, cb) {

	return hive_loader.handler(
		[_mixins, mixins],
		[
			{
				dir:         false,
				name_filter: /(.*)\.js$/i
			},
			config
		],
		cb);
}