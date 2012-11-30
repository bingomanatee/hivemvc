var _ = require('underscore');
var Gate = require('gate');
var util = require('util');
var _DEBUG = false;

module.exports = function (cb, app) {
	var hive_mvc = require('./../../index');
	var gate = Gate.create();
	if (app) {
		this.app = app;
	}
	if (this.app) {

		this.emit('serve', app);
		var self = this;
		this.action_loaders.forEach(function (al, i) {
			var config = al.action_config || {};

			if (_DEBUG) console.log('action config: %s', config);
			var mixins = al.action_script ? require(al.action_script) : {}
			hive_mvc.Action(mixins, config, function (err, action) {
				action.set_config('root', al.get_config('root'));
				var l = gate.latch();
				action.init(function () {
					action.serve(function () {
						self.emit('serve_action', action);
						l();
						if (_DEBUG) console.log('serving action %s(%s)', action.root, action.TYPE);
					}, self.app);
				});
			});
			if (_DEBUG) console.log('serving action_loader %s(%s)', al.root, al.TYPE);
		});
	}
	gate.await(cb);
};