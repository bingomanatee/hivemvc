var _ = require('underscore');

module.exports = function (i, cb) {
	var self = this;
	i = this.as_id(i);
	var pk = this.pk();
	this.get(i, function (err, record) {
			if (record){
				if (_.isObject(i)) {
					i = i[this.pk()];
				}
				delete(self._index[i]);
				self._data = _.reject(self._data, function (item) {
					return item[pk] == i;
				})
				cb(null, record);
			} else {
				cb(null, null);
			}
		}
	)
}