var Query = require('./query');

module.exports = function (callback) {
	if (callback) {
		callback(null, this._data.slice(0));
	} else {
		return Query(this, this._data.slice(0));
	}
}