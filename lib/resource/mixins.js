var _ = require('underscore');
var model = require('./../model');


var list = model({
	_make_pk: function (resource) {
		return resource.TYPE + ':' + resource.name;
	},

	resource: function(type, name){
		if (name && type){
			return this.get(this._make_pk({TYPE: type, name: name}))
		} else if (type){
			return this.find({TYPE: type}, cb);
		}
	}
}, {name: '__resource_list'});

//@ TODO: collision detection for add.

module.exports = {
	_pk:        'res_id',
	init_tasks: [function (cb) {
		list.put(this, cb);
	}]
};

module.exports.list = list;