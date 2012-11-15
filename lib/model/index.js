var Component = require("./../component");
var _ = require('underscore');
var util = require('util');
var fs = require('fs');

function _filter_data(data, query, callback) {
	var data = _.filter(data, function (item) {
		var match = true;
		_.each(query, function (value, key) {
			if (!item[key] != value) {
				match = false;
			}
		})
		return match;
	})

	if (callback) {
		callback(null, data);
	}
	return data;
}

var _mixin = {
	_data:   [],
	_pk:     '',
	_index:  {},
	_init_tasks: [function(cb){
		var self = this;
		var data = this.data;
		this.data = [];
		_.each(data, function(record){
			self.put(record); // adds to index, ensures ID
		});
		cb();
	}],
	indexes: [],
	pk:      function () {
		if (!(this._pk)) {
			this._pk = this.get_config('pk');
			if (!(this._pk)) {
				this._pk = 'id';
			}
		}
		return this._pk;
	},

	get: function (pk, cb) {
		if (!pk) {
			cb(new Error('no pk passed into model.get'));
		}
		if (this._index[pk]) {
			cb(null, this._index[pk]);
		} else {
			var item = _.find(this._data, function (record) {
				return record[this.pk()] == pk;
			});

			if (item) {
				cb(null, item);
			} else {
				cb(null, null);
			}
		}
	},

	_make_pk: function () {
		var max_pk = _.max(_.keys(this._index));
		return 1 + max_pk;
	},

	put: function (item, cb) {

		var id = item[this.pk()];
		if (!id) {
			id = this._make_pk();
			item[this.pk()] = id;

		} else if (this._index[id]) {
			this.delete(id);
		}
		this._index[id] = item;
		this._data.push(item);
		if (cb) cb(null, item);
	},

	delete: function (i) {
		if (_.isObject(i)) {
			i = i[this.pk()];
		}
		delete(this._index[i]);
		this._data = _.reject(this._data, function (item) {
			return item[pk] == i;
		})
	},

	find: function (query, callback) {
		if (query) {
			var data = _filter_data(this.data, query, callback);
			if (!callback) {
				return Query(this, data)
			}
		} else {
			return query(this, this._data.slice(0));
		}
	},

	dump: function (data_path, cb, mode) {
		//@TODO: mode - write individual files
		try {
			var data = JSON.stringify(this._data);
			fs.writeFile(data_path, data, 'utf8', cb);
		} catch (e) {
			cb(e);
		}
	},

	load: function (data_path, cb, mode) {
		var self = this;
		fs.readFile(data_path, 'utf8', function (err, data) {
			try {
				self._data = JSON.parse(data);
				cb(null, self);
			} catch (e) {
				cb(e);
			}
		})
	}
}

_query_mixin = {

	_kov:    function (key, op, value, callback) {

		var _ops = {
			'=': function (record) {
				return record[key] == value;
			},
			'>': function (record) {
				return record[key] > value;
			},
			'<': function (record) {
				return record[key] < value;
			}
		}

		this.data = _.filter(this.data, _ops[op]);
		if (callback) {
			callback(null, this.data);
		} else {
			return this.data;
		}
	},
	where:   function () {
		var args = _.toArray(arguments);

		if (_.isFunction(_.last(args))) {
			var callback = args.pop();
		}

		switch (args.length) {
			case 3:
				if (callback) {
					args.push(callback);
				}
				this.data = this._kov.apply(this, args);
				break;

			case 2:
				args.splice(1, 0, '=');
				if (callback) {
					args.push(callback);
				}
				this.data = this._kov.apply(this, args);
				break;

			case 1:
				if (callback) {
					this.data = _filter_data(this.data, args[0], callback);
				} else {
					return _filter_data(this.data, args[0])
				}
				break;

			default:
				var e = new Error('bad length of query args: ' + args.length)
				if (callback) {
					return callback(e)
				} else {
					throw e;
				}
		}

		return this;
	},
	records: function (cb) {
		if (cb) {
			return cb(null, this.data);
		}
		return this.data();
	},

	_sort: function (key) {

		if (_.isFunction(key)) {
			this.data = _.sortBy(this.data, key);
		} else {
			this.data = _.sortBy(this.data, function (record) {
				return record[key];
			})
		}
	},

	sort:   function () {
		var callback;
		var args = _.toArray(arguments);
		if (_.isFunction(_.last(args))) {
			callback = args.pop();
		}

		switch (args.length) {
			case 1:
				this._sort(args[1]);
				break;

			case 2:
				if (args[1]) {
					this.data = _.reverse(this.data);
				}
				this._sort(args[0]);

			default:
				var e = new Error('bad length of query args: ' + args.length)
				if (callback) {
					return callback(e)
				} else {
					throw e;
				}
		}

		if (callback) {
			callback(null, this.data)
		} else {
			return this;
		}
	},
	slice:  function () {

		var callback;
		var args = _.toArray(arguments);
		if (_.isFunction(_.last(args))) {
			callback = args.pop();
		}

		this.data = this.data.slice.call(args);

		if (callback) {
			callback(null, this.data)
		} else {
			return this;
		}
	}

}

function Query(model, data, cb) {
	return Component(_.defaults({model: model, data: data}, _query_mixin), {}, cb);
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