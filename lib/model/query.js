var Component = require("hive-component");
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');

_query_mixin = {

	count: function (cb) {
		if (cb) {
			return cb(null, this.data.length);
		}
		this._count = true;
		return this;
	},

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
		if (this._count) {
			return this.count(cb);
		}
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

	sort:  function () {
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
	slice: function () {

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

module.exports = Query;