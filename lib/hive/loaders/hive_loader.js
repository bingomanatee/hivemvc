var hive_loader     = require('hive-loader');
var actions_handler = require('./../handlers/actions_handler');

module.exports = function (cb, hive_path) {
	var ah = actions_handler({}, {target: this});
	return hive_loader.loader({}, {root: hive_path, dir: true, handlers: [ah]});

}