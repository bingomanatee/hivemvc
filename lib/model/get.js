var _ = require('underscore');

module.exports = function (id, cb) {
	var self = this;
	var pk = self.pk();
	if (!id) {
		cb(new Error('no pk passed into model.get'));
	}
	if (this._index[id]) {
		cb(null, this._index[id]);
	} else {
		var item = _.find(this._data, function (record) {
			return record[pk] == id;
		});

		if (item) {
			cb(null, item);
		} else {
			cb(null, null);
		}
	}
}