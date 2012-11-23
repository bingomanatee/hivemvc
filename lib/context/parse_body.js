var _ = require('underscore');

function _clean(o){
	var obj = {};

	_.each(o, function(v, key){
		if (!/^\$/.test(key)){
			obj[key] = value;
		}
	});

	return obj;
}

module.exports = function(){
	if (this.$_req.hasOwnProperty('params')) {
		//    console.log('parms: %s, keys: %s', util.inspect(this.$_req.params), util.inspect(this.$_req.route.keys));
		this.$_req.route.keys.forEach(function (key_data) {
			var key = key_data.name;
			self[key] = self.$_req.param(key);
		});

	}

	if (this.$_req.hasOwnProperty('query')) {
		//     console.log('query: %s', util.inspect(this.$_req.query));

		_.extend(this, _clean(this.$_req.query));
	}

	if (this.$_req.hasOwnProperty('body')) {
		if (_.isObject(this.$_req.body)) {
			_clean(this.$_req.body);
			_.extend(this, _clean(this.$_req.body));
		} else {
			this.body = this.$_req.body;
		}
	}
};