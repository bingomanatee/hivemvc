var model = require('./../model');

module.exports = model({
	_make_pk: function (resource) {
		return resource.TYPE + ':' + resource.name;
	},
	name:     '__resource_list',
	resource: function (type, name) {
		if (name && type) {
			return this.get(this._make_pk({TYPE: type, name: name}))
		} else if (type) {
			var records;
			this.find({TYPE: type}, function (err, r) {
				records = r;
			});
			return records;
		} else {
			return null;
		}
	}
}, {});
