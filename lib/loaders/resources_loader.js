var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');

var _DEBUG = false;
var resource_types_handler = require('./../handlers/resource_types_handler');

module.exports = function (root ) {
	if (_DEBUG) console.log('resoures loader loading root %s', root);
	var loader =  hive_loader.loader(
		{name: 'resources_loader'},
		{
			root:     root,
			handlers: [ resource_types_handler()]
		}
	);

	return loader;
}