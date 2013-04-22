var hive_loader = require('hive-loader');
var actions_handler = require('./../handlers/actions_handler');
var resources_handler = require('./../handlers/resources_handler');
var config_handler = require('./../handlers/hive_config_handler');
var util = require('util');

// note - there is a module named 'hive-loader' which is the loading base class, namespaced to hive.
// this hive-loader is an instance of that loader, for loading hives.
// that is, this 'hive loader' is an instance of module hive-loader's loader.

module.exports = function (hive_path, hive) {

	var ah = actions_handler();
	var rh = resources_handler();
	var config = {
		root:   hive_path,
		target: hive,
		hive:   hive,
		dir:    true, handlers: [actions_handler({hive: hive}), resources_handler(), config_handler()]
	};
	var loader = hive_loader.loader({name: 'hive_loader'}, config);
	loader.core(hive.get_config('apiary'));
	return loader;

};