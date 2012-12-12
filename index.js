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

Hive_MVC.prototype.load_frames = function(root, cb){
	var frames_loader = require('./lib/loaders/frames_loader');
	var fl = frames_loader(root);
	fl.load(cb);
};

Hive_MVC.prototype.serve = function(app){
	function _serve(action){
		if(!action.TYPE == 'action'){
			throw new Error(util.format('non_action in actions list: %s', util.inspect(action)));
		}
		action.serve(app);
	}

	this.on('action', _serve);
	var actions = this.Action.list.all(function(err, actions){

		actions.forEach(_serve);
	});
};

module.exports = new Hive_MVC();