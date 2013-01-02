var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var path = require('path');
var resource_file_handler = require('./../handlers/resource_file_handler');
var _DEBUG = false;


module.exports = function (root, file) {
	if (_DEBUG) console.log('resources type laoder root: %s', root);

	var res_type = root.split('/').pop();
	return hive_loader.loader(
		{name: 'resources_loader'},
		{
			root:     root,
			handlers: [ resource_file_handler(res_type)]
		}
	);
}