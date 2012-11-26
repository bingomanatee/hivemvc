var hive_config = require('hive-configuration');
var parse_body = require('./parse_body');

function Context(req, res, action){
	this.$req = req;
	this.$res = res;
	this.$out = new hive_config();
	this.$action = action;
	parse_body.call(this);
}

module.exports = function(req, res, action){
	return new Context(req, res, action);
}