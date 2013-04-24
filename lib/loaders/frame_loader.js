var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
/*var fs = require('fs');
 var support = require('support');
 var path = require('path');
 var Gate = require('gate');
 */

var hives_handler = require('./../handlers/hives_handler');
var resources_handler = require('./../handlers/resources_handler');
var frame_config_handler = require('./../handlers/frame_config_handler');

module.exports = function (root, frame) {
	var handler = hive_loader.loader(
		{name: 'frame_loader'},
		{
			root:   root,
			target: frame,
			handlers: [frame_config_handler(),  hives_handler({frame: frame}), resources_handler() ]
		}
	);

	handler.core(frame.get_config('apiary'));

	return handler;
}