var _ = require('underscore');
var _DEBUG = false;
var util = require('util');

module.exports = function (data, query, callback) {
	var filtered_data = _.filter(data, function (item) {
		var match = true;
		_.each(query, function (value, key) {
			if (match && (!(item[key] == value))) {
				if (_DEBUG) console.log('field %s of %s is not %s; returning false', key, util.inspect(item), value)
				match = false;
			}
		})
		return match;
	})

	if (callback) {
		callback(null, filtered_data);
	}
	return filtered_data;
}