var Component = require('hive-component');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;
var _mixins = require('./mixins');
var Model = require('./../model');

var action_list =  Model({name: '$actions'}, {pk: '$root'});

function _load(cb){
	this.load(cb);
}

function _enlist(cb) {
	var root = this.get_config('root');
	if (!root) {
		throw new Error('attempting to index frame - no root');
	}
	this.$root = root;

	var existing_action = action_model.get(root);
	if (existing_action) {
		throw new Error('redundant action for root %s', root);
	}

	action_list.put(this); 
	cb(null, this);
}

function _emit(){
	var mvc = require('./../../index');
	mvc.emit('action', this);
}

function Action(mixins, config, cb) {
	if (_DEBUG) console.log('creating action with config %s', config);

	return Component(
		[mixins, _mixins]
		, [config, {init_tasks: [
			_load,
			_enlist,
			_emit]}]
		, cb);
}

Action.list = action_list;

module.exports = Action;