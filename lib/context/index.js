var _ = require('underscore');
var hive_config = require('hive-configuration');
var parse_body = require('./parse_body');
var session = require('./session');
var routing = require('./routing');

function Context(req, res, action) {
	this.TYPE = 'context';
	this.$req = req;
	this.$res = res;
	this.$phases = [];
	this.$out = new hive_config(); // note that out is a convenience collection
	// - you still have to return the value of out manually through on_output.
	this.$action = action;

	if (this.$action.template){
		this.$template = this.$action.template;
	}
	parse_body.call(this);
}

_.extend(Context.prototype, session);
_.extend(Context.prototype, routing);

module.exports = function (req, res, action) {
	return new Context(req, res, action);
}