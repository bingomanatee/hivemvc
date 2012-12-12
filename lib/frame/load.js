var frame_loader = require('./../loaders/frame_loader');
var util = require('util');
var Gate = require('gate');
var _ = require('underscore');
var _DEBUG = false;

module.exports = function (cb) {

	var loader = frame_loader(
		this.get_config('root'),
		this
	);

	var self = this;
	var lto = setTimeout(function(){
		console.log('hanging timeout for %s', self.get_config('root'));
	}, 2000);
	loader.load(function(){
		clearTimeout(lto);
		cb();
	})
};