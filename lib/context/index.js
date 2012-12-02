var hive_config = require('hive-configuration');
var parse_body = require('./parse_body');
var session = require('./session');
var _ = require('underscore');

function Context(req, res, action){
	this.TYPE = 'context';
	this.$req = req;
	this.$res = res;
	this.$out = new hive_config(); // note that out is a convenience collection
		// - you still have to return the value of out manually through on_output.
	this.$action = action;
	parse_body.call(this);
}

_.extend(Context.prototype, session);

module.exports = function(req, res, action){
	return new Context(req, res, action);
}