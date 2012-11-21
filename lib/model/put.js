var _ = require('underscore');
var util = require('util');

var _DEBUG = false;
module.exports = function (item, cb) {
	this.index_record(item);
	if (_DEBUG) console.log('after insertion, _index == %s', util.inspect(this._index));
	this.data.push(item);
	if (cb) cb(null, item);

	return item;
}