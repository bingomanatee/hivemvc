var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var Model = require('./../model');
var _mixins = require('./mixins');

var hive_list = Model({name: '__hives'}, {pk: '_hive_root'});

function _load(cb) {
	this.load(cb);
}

function _enlist(cb) {
	var root = this.get_config('root');
	if (!root) {
		throw new Error('attempting to index hive - no root');
	}

	var existing_hive = hive_list.get(root);
	if (existing_hive) {
		throw new Error('redundant hive for root %s', root);
	}

	hive_list.put(this);
	cb(null, this);
}

function _emit(cb){
	var mvc = require('./../../index');
	mvc.emit('hive', this);
	cb(null, this);
}

function Hive(mixins, config, callback){
	if (_.isString(config)){
		config = {
			root: config
		};
	}
	return Component([mixins, _mixins], [config, {init_tasks: [
		_load,
		_enlist,
		_emit
	]}], callback);
}

Hive.list = hive_list;

module.exports = Hive;

module.exports.spawn = require('./spawn')