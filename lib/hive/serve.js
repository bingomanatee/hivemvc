var _ = require('underscore');
var Gate = require('gate');

module.exports = function (app, cb) {
	var gate = Gate.create();
	this.app = app;
	this.actions.forEach(function (action) {
		action.serve(app, gate.latch());
	});
	gate.await(cb);
};