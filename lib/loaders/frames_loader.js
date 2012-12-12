var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');

var frame_handler = require('./../handlers/frame_handler');

module.exports = function (root) {
	return hive_loader.loader(
		{name: 'frames_loader'},
		{
			root:     root,
			handlers: [ frame_handler()]
		}
	)
};