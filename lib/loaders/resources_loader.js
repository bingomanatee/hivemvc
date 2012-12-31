var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');

var resource_types_handler = require('./../handlers/resource_types_handler');

module.exports = function (root, apiary) {
	return hive_loader.loader(
		{name: 'resources_loader'},
		{
			root:     root,
			handlers: [ resource_types_handler(apiary)]
		}
	);
}