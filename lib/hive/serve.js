var _ = require('underscore');
var Gate = require('gate');
var util = require('util');
var _DEBUG = false;

/**
 * deprecated - only actions serve
 * @param app
 */
module.exports = function (app) {
	var apiary = this.get_config('apiary');
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
			mixins.template = al.template ? al.template: false;
			apiary.Action(mixins, config, function (err, action) {
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
	} else {
		throw new Error('hive has no app: ' + this.get_config('root'))
	}
};