var Component = require("hive-component");
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var filter_data = require('./filter_data');

var _mixin = {
	data:    [],
	_pk:     'id',
	_index:  {},
	indexes: [],

	get: require('./get'),

	_make_pk: function (item) {
		var max_pk = _.max(_.keys(this._index));
		var id = 1 + max_pk;
		if (item) {
			item[this._pk] = id;
		}
		return id;
	},

	put: require('./put'),

	as_id: function (i) {
		if (_.isObject(i)) {
			i = i[this._pk];
		}
		return i;
	},

	index_record: require('./index_record'),

	delete: require('./delete'),

	find: require('./find'),

	all: require('./all'),

	dump: require('./dump'),

	load: require('./load'),

	_fix_dump_path: require('./fix_dump_path'),

	count: function (cb) {
		cb(null, this.data.length);
		return this.data.length;
	}
}

module.exports = function (mixin, config, cb) {
	var name = mixin.name.toLowerCase();
	if (!name){
		throw new Error('all models must have names')
	}
	var model = Component([
		{name: name, TYPE: 'model'},
		mixin,
		_mixin
	], [config, {
		pk: 'id', init_tasks: [function (cb) {
			var self = this;
			var data = this.data;
			//console.log('init tasks for %s', util.inspect(this));
			this.data = [];
			_.each(data, function (record) {
				self.put(record); // adds to index, ensures ID
			});
			cb();
		}]
	}], cb);
	module.exports.models[name] = model;
	return model;
};

module.exports.models = {};