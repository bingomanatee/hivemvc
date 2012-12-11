var frame_loader = require('./../loaders/frame_loader');
var util = require('util');
var Gate = require('gate');
var _ = require('underscore');
var _DEBUG = false;

module.exports = function (cb) {
	var root = this.get_config('root');

	var loader = action_loader(
		root,
		this
	);
	loader.load(cb);
};