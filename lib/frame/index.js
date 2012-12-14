var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var Model = require('./../model');
var _mixins = require('./mixins');
var _DEBUG = false;
var frame_list = Model({name: '__frames', _pk: '$root'}, {});

function _load(cb) {
	if (_DEBUG) console.log('loading frame %s with callback ', this.get_config('root'), cb.toString());
	var self = this;
	var lto = setTimeout(function(){
		console.log('hanging timeout for %s', self.get_config('root'));
	}, 4000);
	this.load(function(){
		clearTimeout(lto);
		cb();
	});
}

function _enlist(cb) {
	if (_DEBUG) console.log('_enlisting frame %s', this.get_config('root'));

	var root = this.get_config('root');
	if (!root) {
		throw new Error('attempting to index frame - no root');
	}
	this.$root = root;

	var existing_frame = frame_list.get(root);
	if (existing_frame) {
		throw new Error('redundant frame for root %s', root);
	}

	frame_list.put(this);
	cb();
}

function _emit(cb) {
	if (_DEBUG) console.log('_emitting frame');
	var mvc = require('./../../index');
	mvc.emit('frame', this);
	cb(null, this);
}

function Frame(root) {
	return Component(_mixins, [{root: root}, {
		init_tasks: [
			_load,
			_enlist,
			_emit
		]
	}]);
}

Frame.list = frame_list;

module.exports = Frame;
