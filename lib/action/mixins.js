var util = require('util');
var _ = require('underscore');

module.exports = function (apiary) {
	return {

		TYPE: 'HIVE_ACTION',

		request: require('./request')(apiary),

		ready: require('./ready'),

		respond: require('./respond'),

		serve: require('./serve'),

		load: require('./load'),

		on_output: function (context, output, cb) {
			if (_.isFunction(output)) {
				cb = output;
				output = null;
			}
			if (!output) {
				if (context.out) {
					output = context.out.valueOf();
				}
			}
			cb(null, context, output);
		}
	};
}


