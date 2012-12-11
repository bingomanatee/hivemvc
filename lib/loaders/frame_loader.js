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

module.exports = function (root, frame) {
	return hive_loader.loader(
		{name: 'frame_loader'},
		{
			root:     root,
			target:   frame,
			handlers: [ hives_handler(), resources_handler()]
		}
	)
}