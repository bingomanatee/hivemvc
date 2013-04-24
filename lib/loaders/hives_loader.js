var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Gate = require('gate');

var _DEBUG = false;
var hive_handler = require('./../handlers/hive_handler');

module.exports = function(action_path, frame){
	if (_DEBUG) console.log('hives loader loading action path %s', action_path);

	var loader =  hive_loader.loader(
		{
			name: 'hives_loader'
		},
		{
			root: action_path,
			frame: frame,
			target: frame,
			handlers: [hive_handler({frame: frame})]
		}
	);

	loader.core(frame.get_config('apiary'));

	return loader;
}