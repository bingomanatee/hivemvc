var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Gate = require('gate');

var action_handler = require('./../handlers/action_handler');

module.exports = function ( action_path, frame, hive) {

	return hive_loader.loader(
		{actions: []},
		{
			root:     action_path,
			target: frame,
			hive: hive,
			handlers: [action_handler({hive: hive})]
		}
	);
};