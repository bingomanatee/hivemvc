var _ = require('underscore');


module.exports = function (item, cb) {

	var id = item[this.pk()];
	if (!id) {
		id = this._make_pk();
		item[this.pk()] = id;

	} else if (this._index[id]) {
		this.delete(id);
	}
	this._index[id] = item;
	this._data.push(item);
	if (cb) cb(null, item);
}