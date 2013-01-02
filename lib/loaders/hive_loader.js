var hive_loader = require('hive-loader');
var actions_handler = require('./../handlers/actions_handler');
var resources_handler = require('./../handlers/resources_handler');

// note - there is a module named 'hive-loader' which is the loading base class, namespaced to hive.
// this hive-loader is an instance of that loader, for loading hives.
// that is, this 'hive loader' is an instance of module hive-loader's loader.

module.exports = function (hive_path, hive) {

	var ah = actions_handler();
	var rh = resources_handler();
	var config = {
		root:   hive_path,
		target: hive,
		dir:    true, handlers: [ah, rh]
	};
	var loader = hive_loader.loader({name: 'hive_loader'}, config);
	loader.core(hive.get_config('apiary'));
	return loader;

};