var hive_loader = require('hive-loader');
var actions_handler = require('./../handlers/actions_handler');
var resources_handler = require('./../handlers/resources_handler');

// note - there is a module named 'hive-loader' which is the loading base class, namespaced to hive.
// this hive-loader is an instance of that loader, for loading hives.
// that is, this 'hive loader' is an instance of module hive-loader's loader.

module.exports = function (hive_path, hive) {
	var apiary = hive.get_config('apiary');

	if (!apiary) {
		throw new Error('hive doesnt have an apiary');
	}

	var ah = actions_handler(apiary);
	var rh = resources_handler(apiary);
	var config = {
		root:   hive_path,
		target: hive,
		dir:    true, handlers: [ah, rh]
	};
	return  hive_loader.loader({name: 'hive_loader'}, config);

};