var util = require('util');
var Gate = require('gate');
var _ = require('underscore');
var _DEBUG = true;

module.exports = function(cb, app){
	var gate = Gate.create();

	_.each(this.hives, function(hive){
		var l = gate.latch();
		hive.init(function(){
			hive.serve(l, app)
		});
	});

	gate.await(cb);
};