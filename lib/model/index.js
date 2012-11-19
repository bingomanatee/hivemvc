var Component = require("hive-component");
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var filter_data = require('./filter_data');

var _mixin = {
	_data:       [],
	_pk:         '',
	_index:      {},
	_init_tasks: [function (cb) {
		var self = this;
		var data = this.data;
		//console.log('init tasks for %s', util.inspect(this));
		this.data = [];
		_.each(data, function (record) {
			self.put(record); // adds to index, ensures ID
		});
		cb();
	}],
	indexes:     [],
	pk:          function () {
		if (!(this._pk)) {
			this._pk = this.get_config('pk');
			if (!(this._pk)) {
				this._pk = 'id';
			}
		}
		return this._pk;
	},

	get: require('./get'),

	_make_pk: function () {
		var max_pk = _.max(_.keys(this._index));
		return 1 + max_pk;
	},

	put: require('./put'),

	as_id:  function (i) {
		if (_.isObject(i)) {
			return i[this.pk()]
		} else {
			return i;
		}
	},

	delete: require('./delete'),

	find: require('./find'),

	all: require('./all'),

	dump: require('./dump'),

	load: require('./load'),

	_fix_dump_path: require('./fix_dump_path'),

	count: function (cb) {
		cb(null, this._data.length);
	}
}

module.exports = function (mixin, config, cb) {
	var name = mixin.name.toLowerCase();
	mixin.name = name;
	mixin.TYPE = 'model';
	_.defaults(config, {pk: 'id'});
	_.defaults(mixin, _mixin);

	var model = Component(mixin, config, cb);
	module.exports.models[name] = model;
	return model;
};

module.exports.models = {};