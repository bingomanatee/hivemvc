var hc = require('hive-component');
var _mixins = require('./mixins');
var util = require('util');

module.exports = function (apiary, callback) {

	var _mixin = {
		_make_pk: require('./make_pk'),
		name:     '$resources',
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
	};


	function _enlist(cb) {
		Resource.list.put(this, function(){
			cb();
		});
	}

	function Resource(mixins, config, cb) {

		return hc([mixins, _mixins], [
			{
				apiary: apiary,
				init_tasks: [ _enlist ]
			},
			config,
			{weight: 0}
		], cb)

	}

	Resource.list = apiary.Model(_mixin, {}, function(){

		apiary.Resource = Resource;
		callback();

	});
};