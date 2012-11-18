var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');

module.exports = function () {

	var self = this;
	var args = _.toArray(arguments);
	var callback = args.pop();
	if (args.length) {
		var dump_path = args[0];
	} else {
		var dump_path = this.get_config('dump_path');
	}

	dump_path = this._fix_dump_path(dump_path);

	fs.readFile(dump_path, 'utf8', function (err, data) {
		if (err) {
			console.log('error reading dump path %s: %s', dump_path, err.message);
			return callback(err);
		}
		try {
			self._data = JSON.parse(data);
			callback(null, dump_path);
		} catch (e) {
			callback(e);
		}
	})

}