var util = require('util');
var path = require('path');
var _ = require('underscore');

module.exports = function (apiary) {
	return {

		TYPE: 'HIVE_ACTION',

		request: require('./request')(apiary),

		ready: require('./ready'),

		respond: require('./respond'),

		serve: require('./serve'),

		load: require('./load'),

		model: function(name){
			var a = this.get_config('apiary');
			return a.model(name);
		},

		parse_route: require('./parse_route'),

		name: function(){
			return this.get_config('name', path.basename(this.$path));
		}
	};
}


