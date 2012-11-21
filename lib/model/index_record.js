var _DEBUG = false;

module.exports = function(item){
	var id = item[this._pk];
	if (_DEBUG) console.log('putting record with id of %s into model with pk of %s', id, this._pk);
	if (!id) {
		id = this._make_pk(item);
		if (_DEBUG) console.log('making key for %s: %s', util.inspect(item), id);
		item[this._pk] = id;
	}
	this._index[id] = item;
}