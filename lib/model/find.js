var Query = require('./query');
var filter_data = require('./filter_data');

module.exports = function (query, callback) {
	if (query) {
		var data = filter_data(this.data, query, callback);
		if (!callback) {
			return Query(this, data)
		}
	} else {
		return Query(this, this._data.slice(0));
	}
}