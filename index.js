var util = require('util');
var _ = require('underscore');
var events = require('events');

function Hive_MVC() {
	_.extend(this, {
		Action:   require('./lib/action'),
		Tree:     require('./lib/tree'),
		Model:    require('./lib/model'),
		Hive:     require('./lib/hive'),
		Resource: require('./lib/resource'),
		Static:   require('./lib/static'),
		Frame:    require('./lib/frame'),
		Context:  require('./lib/context')
	});
}

util.inherits(Hive_MVC, events.EventEmitter);

Hive_MVC.prototype.serve = function(app){
	var actions = this.Action.list.all();
	function _serve(action){
		action.serve(app);
	}

	actions.forEach(_serve);

	this.on('action', _serve);
};

module.exports = new Hive_MVC();