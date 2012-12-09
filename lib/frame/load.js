var frame_loader = require('./../loaders/frame_loader');
var util = require('util');
var Gate = require('gate');
var _ = require('underscore');
var _DEBUG = false;

module.exports = function (cb, root) {
	if (!root) {
		root = this.get_config('root');
	}

	var self = this;

	return frame_loader(
		null,
		root,
		this
	).load(function(){
			if (_DEBUG) console.log('hives: %s', util.inspect(self.hives));
			var gate = Gate.create();
			_.each(self.hives, function(hive){
				var l = gate.latch();
				hive.init(function(){
					hive.load(l)
				});
			});

			gate.await(cb);
		});
};