var _ = require('underscore');

module.exports = function (data, query, callback) {
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