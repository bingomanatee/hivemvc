var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

module.exports = function (apiary, cb) {

	var helper = {
		name: 'post_bar',

		test: function (ctx) {

			return ctx.$req.url == "/bar"
		},

		respond: function (ctx, output, cb) {
			if (_DEBUG) console.log('post_bar filter: .$out: %s', util.inspect(output));

			if (output.bar && _.isArray(output.bar)){
				output.bar.forEach(function(v, i){
					output.bar[i] = 2 * v;
				})
			}
			cb(null, ctx, output);
		}
	};

	cb(null, helper);
};