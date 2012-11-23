var _ = require('underscore');
var Gate = require('gate');

module.exports = function (cb, app) {
	var gate = Gate.create();
	if (app){
		this.app = app;
	}
	if (this.app){
		var self = this;
		this.actions.forEach(function (action) {
			action.serve(gate.latch(), self.app);
		});
	}
	gate.await(cb);
};