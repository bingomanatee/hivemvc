var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var Model = require('./../model');
var _mixins = require('./mixins');

var hive_list = Model({name: '__hives'}, {pk: '_hive_root'});
var _DEBUG = false;

function Hive(mixins, config){
	if (_.isString(config)){
		config = {
			root: config
		};
	}
	function _load(cb) {
		if (_DEBUG) console.log('loading hive %s', this.get_config('root'));
		var self = this;
		this.load(function(){
			if (_DEBUG) console.log('done loading hive %s', self.get_config('root'))
			cb()
		});
	}

	function _enlist(cb) {
		if (_DEBUG) console.log('enlisting hive %s', this.get_config('root'))
		var root = this.get_config('root');

		var existing_hive = hive_list.get(root);
		if (existing_hive) {
			throw new Error('redundant hive for root %s', root);
		}

		hive_list.put(this);
		cb();
	}

	function _emit(cb){

		if (_DEBUG) console.log('emitting hive %s', this.get_config('root'))
		var mvc = require('./../../index');
		mvc.emit('hive', this);
		cb();
	}
	return Component([mixins, _mixins], [config, {init_tasks: [
		_load,
		_enlist,
		_emit
	]}]);
}

Hive.list = hive_list;

module.exports = Hive;

module.exports.spawn = require('./spawn')