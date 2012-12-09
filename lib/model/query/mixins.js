var _ = require('underscore');
var util = require('util');
var fs = require('fs');

function _slice() {

	var callback;
	var args = _.toArray(arguments);
	if (_.isFunction(_.last(args))) {
		callback = args.pop();
	}

	var start = args[0] || 0;
	var length = args[1] || this.data.length;

	if (this.data.slice == _slice) {
		console.log('data: %s', util.inspect(this.data));
		throw new Error ('data == query recursion');
	}

	this.data = this.data.slice(start, length);
	return this.callback(callback);
}

module.exports = {

	TYPE: 'model_query'

	, count: function (cb) {
		if (cb) {
			return cb(null, this.data.length);
		} else {
			return this.data.length;
		}
	},

	where:   require('./where'),

	records: function (cb) {
		if (cb) {
			cb(null, this.data.slice(0));
			return this;
		}
		return this.data.slice(0);
	},

	sort:  require('./sort'),

	slice: _slice,

	callback: function (callback) {
		if (callback) {
			callback(null, this.data.slice(0));
		}
		return this;
	}

}