var hive_loader = require('hive-loader');
var actions_handler = require('./../handlers/actions_handler');
// note - there is a module named 'hive-loader' which is the loading base class, namespaced to hive.
// this hive-loader is an instance of that loader, for loading hives.

module.exports = function (cb, hive_path, hive) {
	var ah = actions_handler({}, {target: hive});
	var config = {
		root:   hive_path,
		target: hive,
		dir:    true, handlers: [ah]
	};
	return  hive_loader.loader({}, config, cb);

};