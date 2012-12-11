var frame_loader = require('./../loaders/frame_loader');
var util = require('util');
var Gate = require('gate');
var _ = require('underscore');
var _DEBUG = false;

module.exports = function (cb, root) {
	if (!root) {
		root = this.get_config('root');
	} else {
		this.set_config('root', root);
	}

	return frame_loader(
		function(err, fl){
			fl.load(cb);
		},
		root,
		this
	);
};