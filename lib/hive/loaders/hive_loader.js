var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Gate = require('gate');

var actions_handler = require('./../handlers/actions_handler');

module.exports = function(cb, hive_path){

	return hive_loader.loader({},{root: hive_path, dir: true, handlers: [actions_handler()]});
}