var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var resource_type_loader = require('./../loaders/resources_type_loader');
var _DEBUG = false;


/**
 *
 * this handler searches for resource type folders.
 * Note the folder must END in resources, but can have any
 * prefix you want, if a folder has multiple resources.
 *
 * Resources can be found almost ANYWHERE
 * - in hives, frames, actions, and layouts.
 *
 */

module.exports = function () {

	var _mixins = {
		name:    'resource_types_handler',
		respond: function (params) {
			if (_DEBUG) console.log('actions_handler: found actions folder %s', params.file_path);

			var rtl = resource_type_loader(params.file_path, params.file);

			var apiary = handler.core();
			if (_DEBUG) console.log('resource_types_handler apiary: ', apiary);

			rtl.core(apiary);
			rtl.load(params.gate.latch());
		}
	};

	var handler =  hive_loader.handler(
		_mixins,
		{
			dir: true,
			name_filter: /(view_helper|model|resource|mixin)(s)?$/
		});

	return handler;
}