var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var Model = require('./../model');
var _mixins = require('./mixins');

var frame_list = Model({name: '__frames'}, {pk: '$root'});

function _load(cb) {
	this.load(cb);
}

function _enlist(cb) {
	var root = this.get_config('root');
	if (!root) {
		throw new Error('attempting to index frame - no root');
	}
	this.$root = root;

	var existing_frame = frame_list.get(root);
	if (existing_frame) {
		throw new Error('redundant frame for root %s', root);
	}

	frame_list.put(this); q
	cb(null, this);
}

function _emit(cb) {
	var mvc = require('./../../index');
	mvc.emit('frame', this);
	cb(null, this);
}

function Frame(mixins, config, callback) {
	if (_.isString(config)) {
		config = {
			name: 'frame',
			root: config,

		};
	}
	return Component([mixins, _mixins], [config, {
		init_tasks: [
			_load,
			_enlist,
			_emit
		]
	}], callback);
}

Frame.list = frame_list;

module.exports = Frame;
