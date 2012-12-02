var _ = require('underscore');

function _clean(o){
	var obj = {};

	_.each(o, function(v, key){
		if (!/^\$/.test(key)){
			obj[key] = v;
		}
	});

	return obj;
}

module.exports = function(){
	var self = this;
	if (this.$req.hasOwnProperty('params')) {

		//    console.log('parms: %s, keys: %s', util.inspect(this.$req.params), util.inspect(this.$req.route.keys));
		this.$req.route.keys.forEach(function (key_data) {
			var key = key_data.name;
			self[key] = self.$req.param(key);
		});

	}

	if (this.$req.hasOwnProperty('query')) {
		//     console.log('query: %s', util.inspect(this.$req.query));

		_.extend(this, _clean(this.$req.query));
	}

	if (this.$req.hasOwnProperty('body')) {
		if (_.isObject(this.$req.body)) {
			_clean(this.$req.body);
			_.extend(this, _clean(this.$req.body));
		} else {
			this.body = this.$req.body;
		}
	}
};