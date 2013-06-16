var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var path = require('path');
var resource_file_handler = require('./../handlers/resource_file_handler');
var _DEBUG = false;


module.exports = function (root, file) {
	if (_DEBUG) console.log('resources type laoder root: %s', root);

	var res_type = root.split('/').pop();
	var match = /(view_helper|model|resource|mixin)(s)?$/.exec(res_type);
	if (match){
		res_type = match[1];
		return hive_loader.loader(
			{name: 'resources_loader'},
			{
				root:     root,
				handlers: [ resource_file_handler(res_type)]
			}
		);
	} else {
		return hive_loader.loader(
			{name: 'resources_loader_null'},
			{
				root:     root,
				handlers: []
			}
		);
	}
}