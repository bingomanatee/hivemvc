var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Gate = require('gate');

var hive_handler = require('./../handlers/hive_handler');

module.exports = function( action_path, frame, apiary){

	return hive_loader.loader(
		{
			name: 'hives_loader'
		},
		{
			root: action_path,
			target: frame,
			apiary: apiary,
			handlers: [hive_handler(apiary)]
		}
	);
}