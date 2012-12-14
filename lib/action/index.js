var Component = require('hive-component');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;
var _mixins = require('./mixins');
var Model = require('./../model');

var action_list =  Model({name: '$actions', _pk: '$root'}, {});

function _load(cb){
	var self = this;
	var lto = setTimeout(function(){
		console.log('hanging timeout for %s', self.get_config('root'));
	}, 2000)
	this.load(function(){
		clearTimeout(lto);
		if (_DEBUG) 	console.log('done with loading action');
		cb();
	});
}

function _enlist(cb) {
	if (_DEBUG) console.log('enlisting action');
	var root = this.get_config('root');
	if (!root) {
		if (_DEBUG) 	console.log('attempting to enlist action - no root');
		root = this.component_id; // gotta have something...
	}
	this.$root = root;

	var existing_action = action_list.get(root);
	if (existing_action) {
		throw new Error('redundant action for root %s', root);
	}

	action_list.put(this);
	cb();
}

function _emit(cb){
	if (_DEBUG)   console.log('emitting action %s', this.get_config('root'));
	var mvc = require('./../../index');
	mvc.emit('action', this);
	cb();
}

function Action(mixins, config) {
	if (_DEBUG) console.log('creating action with config %s', config);

	return Component(
		[mixins, _mixins]
		, [config, {init_tasks: [
			_load,
			_enlist,
			_emit]}]
		);
}

Action.list = action_list;

module.exports = Action;